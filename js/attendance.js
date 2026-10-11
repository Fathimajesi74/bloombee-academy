// Load saved attendance and preserve existing records
let attendanceData = JSON.parse(
    localStorage.getItem("attendance")
) || {};

// Convert old attendance records into the new array format.
// Old records such as "Present" become ["Present", ""].
Object.keys(attendanceData).forEach(date => {
    const day = attendanceData[date];

    if (!day || day.holiday) return;

    Object.keys(day).forEach(studentId => {
        if (studentId === "holiday") return;

        if (typeof day[studentId] === "string") {
            day[studentId] = [day[studentId], ""];
        }

        if (!Array.isArray(day[studentId])) {
            day[studentId] = ["", ""];
        }

        while (day[studentId].length < 2) {
            day[studentId].push("");
        }
    });
});

function saveAttendance() {
    localStorage.setItem(
        "attendance",
        JSON.stringify(attendanceData)
    );
}

function getSelectedDate() {
    const input = document.getElementById("attendanceDate");
    return input ? input.value : "";
}

function getClassesToday() {
    const selector = document.getElementById("dailyClasses");
    return selector ? Number(selector.value) : 1;
}

// Count all marked class sessions for one student.
// Each Present or Absent mark counts as one class.
function getStudentSessions(studentId) {
    let count = 0;

    Object.keys(attendanceData).sort().forEach(date => {
        const day = attendanceData[date];

        if (!day || day.holiday) return;

        let marks = day[studentId];

        if (typeof marks === "string") {
            marks = [marks, ""];
        }

        if (!Array.isArray(marks)) return;

        marks.forEach(status => {
            if (status === "Present" || status === "Absent") {
                count++;
            }
        });
    });

    return count;
}

// Load attendance for the selected date
function loadAttendance() {
    const list = document.getElementById("attendanceList");
    if (!list) return;

    const date = getSelectedDate();

    if (!date) {
        list.innerHTML = "<p>Please select a date.</p>";
        return;
    }

    const day = attendanceData[date];
    const classes = getClassesToday();

    const holidayMessage = document.getElementById("holidayMessage");

    if (holidayMessage) {
        holidayMessage.innerHTML =
            day && day.holiday ?
            "<p>🏖 This date is marked as a holiday.</p>" :
            "";
    }

    if (day && day.holiday) {
        list.innerHTML = `
            <div class="student-card">
                <h3>🏖 Holiday</h3>
                <p>Attendance is not required for this date.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = "";

    if (typeof students === "undefined" || students.length === 0) {
        list.innerHTML = "<p>Please add students first.</p>";
        return;
    }

    students.forEach(student => {
        let marks = day && day[student.id];

        if (typeof marks === "string") {
            marks = [marks, ""];
        }

        if (!Array.isArray(marks)) {
            marks = ["", ""];
        }

        const card = document.createElement("div");
        card.className = "attendance-card";

        let sessionHTML = "";

        for (let slot = 0; slot < classes; slot++) {
            const status = marks[slot] || "";
            const classNumber = slot + 1;

            sessionHTML += `
                <div class="attendance-session">
                    <h4>Class ${classNumber}</h4>
                    <p>Status: <strong>${status || "Not Marked"}</strong></p>

                    <button
                        class="present-btn"
                        onclick="markAttendance('${student.id}', ${slot}, 'Present')">
                        ✅ Present
                    </button>

                    <button
                        class="absent-btn"
                        onclick="markAttendance('${student.id}', ${slot}, 'Absent')">
                        ❌ Absent
                    </button>

                    <button
                        onclick="clearAttendance('${student.id}', ${slot})">
                        Clear
                    </button>
                </div>
            `;
        }

        const totalSessions = getStudentSessions(student.id);
        const currentCycle = totalSessions % 25 || (totalSessions > 0 ? 25 : 0);

        card.innerHTML = `
            <div class="attendance-student">
                <h3>👤 ${escapeAttendanceText(student.name)}</h3>
                <p>🎓 Class: ${escapeAttendanceText(student.class)}</p>
                <p>📅 Date: ${date}</p>
                <p>📊 Current 25-class cycle: ${currentCycle}/25</p>
                ${sessionHTML}
            </div>
        `;

        list.appendChild(card);
    });
}

// Mark one specific class as Present or Absent
function markAttendance(studentId, slot, status) {
    const date = getSelectedDate();

    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (slot !== 0 && slot !== 1) return;

    if (attendanceData[date] && attendanceData[date].holiday) {
        alert("This date is marked as a holiday.");
        return;
    }

    if (!attendanceData[date]) {
        attendanceData[date] = {};
    }

    let marks = attendanceData[date][studentId];

    if (typeof marks === "string") {
        marks = [marks, ""];
    }

    if (!Array.isArray(marks)) {
        marks = ["", ""];
    }

    while (marks.length < 2) {
        marks.push("");
    }

    const before = getStudentSessions(studentId);

    // Update only the selected class.
    // Class 1 and Class 2 remain separate.
    marks[slot] = status;
    attendanceData[date][studentId] = marks;

    const after = getStudentSessions(studentId);

    // Reset the fee status when a new 25-class cycle is completed.
    const student = students.find(
        item => String(item.id) === String(studentId)
    );

    if (
        student &&
        after > before &&
        Math.floor(after / 25) > Math.floor(before / 25)
    ) {
        student.feeStatus = "Not Paid";

        if (typeof saveStudents === "function") {
            saveStudents();
        } else {
            localStorage.setItem("students", JSON.stringify(students));
        }
    }

    saveAttendance();
    loadAttendance();

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    if (typeof displayStudents === "function") {
        displayStudents();
    }

    if (typeof updatePendingFees === "function") {
        updatePendingFees();
    }
}

// Clear one class mark without removing the other class
function clearAttendance(studentId, slot) {
    const date = getSelectedDate();
    if (!date || !attendanceData[date]) return;

    const marks = attendanceData[date][studentId];

    if (!Array.isArray(marks)) return;

    marks[slot] = "";

    saveAttendance();
    loadAttendance();

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }
}

// Mark every student Present for the selected class or classes
function markAllPresent() {
    const date = getSelectedDate();

    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (attendanceData[date] && attendanceData[date].holiday) {
        alert("This date is marked as a holiday.");
        return;
    }

    if (!attendanceData[date]) {
        attendanceData[date] = {};
    }

    const classes = getClassesToday();

    students.forEach(student => {
        let marks = attendanceData[date][student.id];

        if (typeof marks === "string") {
            marks = [marks, ""];
        }

        if (!Array.isArray(marks)) {
            marks = ["", ""];
        }

        while (marks.length < 2) {
            marks.push("");
        }

        const before = getStudentSessions(student.id);

        for (let slot = 0; slot < classes; slot++) {
            marks[slot] = "Present";
        }

        attendanceData[date][student.id] = marks;

        const after = getStudentSessions(student.id);

        if (
            after > before &&
            Math.floor(after / 25) > Math.floor(before / 25)
        ) {
            student.feeStatus = "Not Paid";
        }
    });

    saveAttendance();
    localStorage.setItem("students", JSON.stringify(students));

    loadAttendance();

    if (typeof updateDashboard === "function") updateDashboard();
    if (typeof displayStudents === "function") displayStudents();
    if (typeof updatePendingFees === "function") updatePendingFees();

    alert(`All students marked Present for ${classes} class(es).`);
}

// Mark or remove a holiday without deleting saved attendance records
function toggleHoliday() {
    const date = getSelectedDate();

    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (!attendanceData[date]) {
        attendanceData[date] = {};
    }

    if (attendanceData[date].holiday) {
        if (confirm("Remove holiday for this date?")) {
            delete attendanceData[date].holiday;

            if (Object.keys(attendanceData[date]).length === 0) {
                delete attendanceData[date];
            }

            saveAttendance();
            loadAttendance();
        }

        return;
    }

    if (confirm("Mark this date as a holiday?")) {
        attendanceData[date].holiday = true;
        saveAttendance();
        loadAttendance();

        if (typeof updateDashboard === "function") {
            updateDashboard();
        }
    }
}

// Keep this helper for existing report code that may use monthly/yearly counts
function getIndividualAttendance(student, selectedDate) {
    const selected = new Date(selectedDate + "T00:00:00");

    let monthlyPresent = 0;
    let monthlyAbsent = 0;
    let yearPresent = 0;
    let yearAbsent = 0;
    let holidays = 0;

    Object.keys(attendanceData).forEach(date => {
        const day = attendanceData[date];
        const current = new Date(date + "T00:00:00");

        const sameMonth =
            current.getMonth() === selected.getMonth() &&
            current.getFullYear() === selected.getFullYear();

        const sameYear = current.getFullYear() === selected.getFullYear();

        if (day && day.holiday) {
            if (sameMonth) holidays++;
            return;
        }

        let marks = day && day[student.id];

        if (typeof marks === "string") {
            marks = [marks, ""];
        }

        if (!Array.isArray(marks)) return;

        marks.forEach(status => {
            if (status === "Present") {
                if (sameMonth) monthlyPresent++;
                if (sameYear) yearPresent++;
            } else if (status === "Absent") {
                if (sameMonth) monthlyAbsent++;
                if (sameYear) yearAbsent++;
            }
        });
    });

    return {
        monthName: selected.toLocaleString("en-IN", {
            month: "long",
            year: "numeric"
        }),
        monthlyPresent,
        monthlyAbsent,
        holidays,
        yearPresent,
        yearAbsent
    };
}

function escapeAttendanceText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Initialize the date and attendance page
document.addEventListener("DOMContentLoaded", function() {
    const dateInput = document.getElementById("attendanceDate");

    if (dateInput && !dateInput.value) {
        const now = new Date();
        dateInput.value =
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");
    }

    if (dateInput) {
        dateInput.addEventListener("change", loadAttendance);
    }

    loadAttendance();
});