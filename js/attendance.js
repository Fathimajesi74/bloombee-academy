// ========================================
// BLOOMBEE - ATTENDANCE MANAGEMENT
// 25-class cycles, two classes per day
// Historical attendance is preserved.
// ========================================

let attendanceData = {};

try {
    attendanceData = JSON.parse(
        localStorage.getItem("attendance")
    ) || {};
} catch (error) {
    attendanceData = {};
}

// Convert legacy records into the two-class format.
// Old: "Present"
// New: ["Present", ""]
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
    const count = selector ? Number(selector.value) : 1;

    return count === 2 ? 2 : 1;
}

// Return all marked class sessions for a student.
// Each Present or Absent mark counts as one class.
function getStudentAttendanceHistory(studentId) {
    const sessions = [];

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
                sessions.push({
                    date,
                    status
                });
            }
        });
    });

    return sessions;
}

// Total marked sessions across all historical cycles.
function getStudentSessions(studentId) {
    return getStudentAttendanceHistory(studentId).length;
}

// Statistics for the student's latest 25-class cycle.
function getStudentAttendanceStats(studentId) {
    const history = getStudentAttendanceHistory(studentId);
    const totalSessions = history.length;

    if (totalSessions === 0) {
        return {
            total: 0,
            present: 0,
            absent: 0,
            percentage: 0,
            completedCycles: 0,
            overallTotal: 0
        };
    }

    // Keep the completed cycle at 25/25 until the next class is marked.
    const cycleTotal = ((totalSessions - 1) % 25) + 1;
    const currentCycle = history.slice(-cycleTotal);

    const present = currentCycle.filter(
        session => session.status === "Present"
    ).length;

    const absent = currentCycle.filter(
        session => session.status === "Absent"
    ).length;

    return {
        total: cycleTotal,
        present,
        absent,
        percentage: Math.round((present / cycleTotal) * 100),
        completedCycles: Math.floor(totalSessions / 25),
        overallTotal: totalSessions
    };
}

// Maintain compatibility with older code that uses this function.
function getIndividualAttendance(student, selectedDate) {
    const stats = getStudentAttendanceStats(student.id);

    return {
        total: stats.total,
        present: stats.present,
        absent: stats.absent,
        percentage: stats.percentage
    };
}

// Reset fee status when a student's 25-class cycle is completed.
function resetFeeStatusIfCycleCompleted(student, before, after) {
    if (!student || after <= before) return;

    if (Math.floor(after / 25) > Math.floor(before / 25)) {
        student.feeStatus = "Not Paid";

        if (typeof saveStudents === "function") {
            saveStudents();
        } else {
            localStorage.setItem("students", JSON.stringify(students));
        }
    }
}

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
        holidayMessage.innerHTML = day && day.holiday ?
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

        const stats = getStudentAttendanceStats(student.id);
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

        card.innerHTML = `
            <div class="attendance-student">
                <h3>👤 ${escapeAttendanceText(student.name)}</h3>
                <p>🎓 Class: ${escapeAttendanceText(student.class || "-")}</p>
                <p>📅 Date: ${escapeAttendanceText(date)}</p>
                <p>📊 Current cycle: ${stats.total}/25 classes marked</p>
                <p>✅ Present: ${stats.present}</p>
                <p>❌ Absent: ${stats.absent}</p>
                <p>📈 Attendance: ${stats.percentage}%</p>
                ${sessionHTML}
            </div>
        `;

        list.appendChild(card);
    });
}

function markAttendance(studentId, slot, status) {
    const date = getSelectedDate();

    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (slot !== 0 && slot !== 1) return;

    if (slot >= getClassesToday()) {
        alert("Please select the number of classes scheduled for this day.");
        return;
    }

    if (status !== "Present" && status !== "Absent") return;

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

    // Change only the selected class mark.
    marks[slot] = status;
    attendanceData[date][studentId] = marks;

    const after = getStudentSessions(studentId);
    const student = students.find(
        item => String(item.id) === String(studentId)
    );

    resetFeeStatusIfCycleCompleted(student, before, after);

    saveAttendance();
    loadAttendance();

    if (typeof updateDashboard === "function") updateDashboard();
    if (typeof displayStudents === "function") displayStudents();
    if (typeof updatePendingFees === "function") updatePendingFees();
}

function clearAttendance(studentId, slot) {
    const date = getSelectedDate();

    if (!date || !attendanceData[date]) return;
    if (slot !== 0 && slot !== 1) return;

    const day = attendanceData[date];

    if (day.holiday) {
        alert("Remove the holiday before editing attendance.");
        return;
    }

    let marks = day[studentId];

    if (typeof marks === "string") {
        marks = [marks, ""];
    }

    if (!Array.isArray(marks)) return;

    marks[slot] = "";
    day[studentId] = marks;

    saveAttendance();
    loadAttendance();

    if (typeof updateDashboard === "function") updateDashboard();
    if (typeof displayStudents === "function") displayStudents();
}

// Mark all students Present for the selected class or classes.
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

    if (typeof students === "undefined" || students.length === 0) {
        alert("Please add students first.");
        return;
    }

    if (!attendanceData[date]) {
        attendanceData[date] = {};
    }

    const classes = getClassesToday();

    students.forEach(student => {
        const before = getStudentSessions(student.id);
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

        for (let slot = 0; slot < classes; slot++) {
            marks[slot] = "Present";
        }

        attendanceData[date][student.id] = marks;

        const after = getStudentSessions(student.id);
        resetFeeStatusIfCycleCompleted(student, before, after);
    });

    saveAttendance();

    if (typeof saveStudents === "function") {
        saveStudents();
    }

    loadAttendance();

    if (typeof updateDashboard === "function") updateDashboard();
    if (typeof displayStudents === "function") displayStudents();
    if (typeof updatePendingFees === "function") updatePendingFees();

    alert(`All students marked Present for ${classes} class(es).`);
}

// Toggle a holiday without deleting historical records.
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

            if (typeof updateDashboard === "function") updateDashboard();
        }

        return;
    }

    if (confirm("Mark this date as a holiday?")) {
        attendanceData[date].holiday = true;
        saveAttendance();
        loadAttendance();

        if (typeof updateDashboard === "function") updateDashboard();
    }
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

// Initialize date and attendance controls.
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

    const classSelector = document.getElementById("dailyClasses");

    if (classSelector) {
        classSelector.addEventListener("change", loadAttendance);
    }

    loadAttendance();
});