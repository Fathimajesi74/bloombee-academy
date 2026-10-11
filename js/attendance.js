// ========================================
// BLOOMBEE - ATTENDANCE MANAGEMENT
// ========================================

// Load saved attendance
let attendanceData = JSON.parse(
    localStorage.getItem("attendanceData") || "{}"
);


// ========================================
// SAVE DATA
// ========================================

function saveAttendance() {
    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendanceData)
    );
}


// Use the shared students array from students.js
// Keep only one saveStudents() function in your project.
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}


// ========================================
// DATE AND CLASS SETTINGS
// ========================================

function getSelectedDate() {
    const dateInput = document.getElementById("attendanceDate");

    if (dateInput && dateInput.value) {
        return dateInput.value;
    }

    return new Date().toISOString().split("T")[0];
}


// IMPORTANT: Your index.html uses dailyClasses
function getClassesToday() {
    const classSelect = document.getElementById("dailyClasses");

    return classSelect ? Number(classSelect.value) || 1 : 1;
}


// ========================================
// PRESENT CLASS HISTORY
// ========================================

// Count only Present classes.
// Absent and unmarked classes do not count.
function getStudentSessionHistory(studentId) {
    const history = [];

    Object.keys(attendanceData)
        .sort()
        .forEach(date => {
            const dailyRecords = attendanceData[date];

            if (!dailyRecords) return;

            // Support both numeric and string student IDs
            const studentKey = Object.keys(dailyRecords).find(
                key => String(key) === String(studentId)
            );

            if (studentKey === undefined) return;

            const marks = dailyRecords[studentKey];

            if (!Array.isArray(marks)) return;

            marks.forEach((status, slotIndex) => {
                if (status === "Present") {
                    history.push({
                        date: date,
                        slotIndex: slotIndex,
                        status: status
                    });
                }
            });
        });

    // Class 1 comes before Class 2 for each date
    return history;
}


// Total Present classes across all recorded dates
function getStudentSessions(studentId) {
    return getStudentSessionHistory(studentId).length;
}


// Current cycle count: 0 to 24
function getCurrentCycleClasses(studentId) {
    return getStudentSessions(studentId) % 25;
}


// ========================================
// RESET FEE AFTER EVERY 25 PRESENT CLASSES
// ========================================

function resetFeeIfCycleCompleted(studentId, beforeCount, afterCount) {
    if (
        afterCount > beforeCount &&
        afterCount > 0 &&
        afterCount % 25 === 0
    ) {
        const student = students.find(
            s => String(s.id) === String(studentId)
        );

        if (student) {
            student.feeStatus = "Not Paid";
            saveStudents();

            alert(
                "25 Present classes completed!\n\n" +
                "Fee status reset to Not Paid.\n" +
                "The new cycle starts at 0/25."
            );
        }
    }
}


// ========================================
// ESCAPE TEXT
// ========================================

function escapeAttendanceText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// ========================================
// LOAD ATTENDANCE
// ========================================

function loadAttendance() {
    const attendanceList = document.getElementById("attendanceList");

    if (!attendanceList) return;

    attendanceList.innerHTML = "";

    const date = getSelectedDate();
    const classCount = getClassesToday();

    const classFilter = document.getElementById("attendanceClass");
    const selectedClass = classFilter ? classFilter.value : "All";

    const dailyRecords = attendanceData[date] || {};

    if (!Array.isArray(students) || students.length === 0) {
        attendanceList.innerHTML = "<p>No students added yet.</p>";
        return;
    }

    const filteredStudents = students.filter(student =>
        selectedClass === "All" ||
        student.class === selectedClass
    );

    if (filteredStudents.length === 0) {
        attendanceList.innerHTML = "<p>No students found for this class.</p>";
        return;
    }

    filteredStudents.forEach(student => {
                const studentKey = Object.keys(dailyRecords).find(
                    key => String(key) === String(student.id)
                );

                const marks = studentKey !== undefined &&
                    Array.isArray(dailyRecords[studentKey]) ?
                    dailyRecords[studentKey] : [];

                const firstStatus = marks[0] || "";
                const secondStatus = marks[1] || "";
                const cycleClasses = getCurrentCycleClasses(student.id);

                const studentId = JSON.stringify(String(student.id));

                attendanceList.innerHTML += `
            <div class="student-card">
                <h3>${escapeAttendanceText(student.name)}</h3>

                <p>
                    Class: ${escapeAttendanceText(student.class || "")}
                </p>

                <p>
                    Current cycle:
                    <strong>${cycleClasses}/25</strong>
                </p>

                <div class="attendance-slots">
                    <div class="attendance-slot">
                        <p><strong>Class 1</strong></p>

                        <button
                            type="button"
                            onclick='markAttendance(${studentId}, 0, "Present")'
                            ${firstStatus === "Present" ? "disabled" : ""}
                        >
                            ✅ Present
                        </button>

                        <button
                            type="button"
                            onclick='markAttendance(${studentId}, 0, "Absent")'
                            ${firstStatus === "Absent" ? "disabled" : ""}
                        >
                            ❌ Absent
                        </button>

                        <span>
                            ${escapeAttendanceText(firstStatus || "Not Marked")}
                        </span>
                    </div>

                    ${
                        classCount === 2
                            ? `
                                <div class="attendance-slot">
                                    <p><strong>Class 2</strong></p>

                                    <button
                                        type="button"
                                        onclick='markAttendance(${studentId}, 1, "Present")'
                                        ${secondStatus === "Present" ? "disabled" : ""}
                                    >
                                        ✅ Present
                                    </button>

                                    <button
                                        type="button"
                                        onclick='markAttendance(${studentId}, 1, "Absent")'
                                        ${secondStatus === "Absent" ? "disabled" : ""}
                                    >
                                        ❌ Absent
                                    </button>

                                    <span>
                                        ${escapeAttendanceText(secondStatus || "Not Marked")}
                                    </span>
                                </div>
                            `
                            : ""
                    }
                </div>
            </div>
        `;
    });
}


// ========================================
// MARK INDIVIDUAL ATTENDANCE
// ========================================

function markAttendance(studentId, slotIndex, status) {
    const date = getSelectedDate();

    if (slotIndex < 0 || slotIndex > 1) return;

    // Do not mark Class 2 when only one class is selected
    if (slotIndex === 1 && getClassesToday() !== 2) {
        alert("Please select 2 Classes first.");
        return;
    }

    if (!attendanceData[date]) {
        attendanceData[date] = {};
    }

    const dailyRecords = attendanceData[date];

    let studentKey = Object.keys(dailyRecords).find(
        key => String(key) === String(studentId)
    );

    if (studentKey === undefined) {
        studentKey = String(studentId);
        dailyRecords[studentKey] = ["", ""];
    }

    const marks = dailyRecords[studentKey];

    while (marks.length < 2) {
        marks.push("");
    }

    const previousStatus = marks[slotIndex] || "";

    if (previousStatus === status) return;

    const beforeCount = getStudentSessions(studentId);

    marks[slotIndex] = status;

    // Remove empty attendance records
    if (marks.every(mark => !mark)) {
        delete dailyRecords[studentKey];
    }

    if (Object.keys(dailyRecords).length === 0) {
        delete attendanceData[date];
    }

    saveAttendance();

    const afterCount = getStudentSessions(studentId);

    resetFeeIfCycleCompleted(
        studentId,
        beforeCount,
        afterCount
    );

    refreshAttendanceViews();
}


// ========================================
// MARK ALL PRESENT
// ========================================

function markAllPresent() {
    const date = getSelectedDate();
    const classCount = getClassesToday();

    if (!Array.isArray(students) || students.length === 0) {
        alert("Please add students first.");
        return;
    }

    if (!attendanceData[date]) {
        attendanceData[date] = {};
    }

    students.forEach(student => {
        const studentId = String(student.id);
        const dailyRecords = attendanceData[date];

        let studentKey = Object.keys(dailyRecords).find(
            key => String(key) === studentId
        );

        if (studentKey === undefined) {
            studentKey = studentId;
            dailyRecords[studentKey] = ["", ""];
        }

        const marks = dailyRecords[studentKey];

        while (marks.length < 2) {
            marks.push("");
        }

        const beforeCount = getStudentSessions(student.id);

        for (let slot = 0; slot < classCount; slot++) {
            marks[slot] = "Present";
        }

        const afterCount = getStudentSessions(student.id);

        resetFeeIfCycleCompleted(
            student.id,
            beforeCount,
            afterCount
        );
    });

    saveAttendance();
    refreshAttendanceViews();
}


// ========================================
// REFRESH RELATED PAGES
// ========================================

function refreshAttendanceViews() {
    loadAttendance();

    if (typeof displayStudents === "function") {
        displayStudents();
    }

    if (typeof displayFees === "function") {
        displayFees();
    }

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }
}


// ========================================
// HOLIDAY
// ========================================

function toggleHoliday() {
    const date = getSelectedDate();

    const holidayMessage = document.getElementById("holidayMessage");

    if (attendanceData[date]) {
        const confirmed = confirm(
            "Remove attendance records for this date and mark it as a holiday?"
        );

        if (!confirmed) return;

        delete attendanceData[date];
        saveAttendance();

        if (holidayMessage) {
            holidayMessage.textContent =
                "Attendance records cleared for " + date + ".";
        }
    } else {
        if (holidayMessage) {
            holidayMessage.textContent =
                "Holiday selected for " + date +
                ". No attendance has been recorded.";
        }
    }

    refreshAttendanceViews();
}


// ========================================
// INITIALIZE ATTENDANCE PAGE
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("attendanceDate");

    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split("T")[0];
    }

    const dailyClasses = document.getElementById("dailyClasses");

    if (dailyClasses) {
        dailyClasses.addEventListener("change", loadAttendance);
    }

    if (dateInput) {
        dateInput.addEventListener("change", loadAttendance);
    }

    loadAttendance();
});