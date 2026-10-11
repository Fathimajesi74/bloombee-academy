const STUDENTS_STORAGE_KEY = "students";

let students = JSON.parse(
    localStorage.getItem(STUDENTS_STORAGE_KEY) || "[]"
);

const classFees = {
    "LKG": 500,
    "UKG": 500,
    "Class 1": 600,
    "Class 2": 600,
    "Class 3": 700,
    "Class 4": 700,
    "Class 5": 800,
    "Class 6": 900,
    "Class 7": 1000,
    "Class 8": 1200
};

function saveStudents(studentList = students) {
    students = studentList;
    localStorage.setItem(
        STUDENTS_STORAGE_KEY,
        JSON.stringify(students)
    );
}

function escapeStudentText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getStudentAttendance(student) {
    if (typeof getStudentAttendanceStats === "function") {
        return getStudentAttendanceStats(student.id);
    }

    return {
        totalSessions: 0,
        completedCycles: 0,
        currentCycleCount: 0,
        present: 0,
        attendancePercentage: 0
    };
}

function addStudent() {
    const nameInput =
        document.getElementById("studentName") ||
        document.getElementById("name");

    const classInput =
        document.getElementById("classSelect") ||
        document.getElementById("studentClass");

    const parentInput =
        document.getElementById("parentName");

    const phoneInput =
        document.getElementById("parentPhone") ||
        document.getElementById("phone");

    const name = nameInput?.value.trim();
    const studentClass = classInput?.value || "";

    if (!name) {
        alert("Please enter the student's name.");
        nameInput?.focus();
        return;
    }

    const student = {
        id: Date.now().toString(),
        name,
        class: studentClass,
        parentName: parentInput?.value.trim() || "",
        phone: phoneInput?.value.trim() || "",
        fee: classFees[studentClass] || 0,
        feeStatus: "Not Paid",
        attendance: {}
    };

    students.push(student);
    saveStudents();

    if (nameInput) nameInput.value = "";
    if (parentInput) parentInput.value = "";
    if (phoneInput) phoneInput.value = "";

    displayStudents();

    if (typeof loadAttendance === "function") loadAttendance();
    if (typeof displayFees === "function") displayFees();
}

function displayStudents() {
    const container =
        document.getElementById("studentList") ||
        document.getElementById("students") ||
        document.getElementById("studentsList");

    if (!container) return;

    if (!students.length) {
        container.innerHTML = "<p>No students added yet.</p>";
        return;
    }

    container.innerHTML = students.map(student => {
        const stats = getStudentAttendance(student);
        const fee = Number(student.fee ?? classFees[student.class] ?? 0);
        const feeStatus = student.feeStatus || "Not Paid";

        return `
            <div class="student student-card">
                <div class="student-info">
                    <h3>${escapeStudentText(student.name)}</h3>

                    <p>Class: ${escapeStudentText(student.class || "Not specified")}</p>

                    <p>Parent: ${escapeStudentText(student.parentName || "—")}</p>

                    <p>Phone: ${escapeStudentText(student.phone || "—")}</p>

                    <p>Fee per 25 classes: ₹${fee}</p>

                    <p>
                        Current cycle:
                        <strong>${stats.currentCycleCount}/25</strong>
                    </p>

                    <p>
                        Fee status:
                        <strong>${escapeStudentText(feeStatus)}</strong>
                    </p>
                </div>

                <div class="student-actions">
                    <button type="button"
                        onclick="toggleStudentFee('${student.id}')">
                        ${feeStatus === "Paid" ? "Mark Not Paid" : "Mark Paid"}
                    </button>

                    <button type="button"
                        onclick="deleteStudent('${student.id}')">
                        Delete Student
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function toggleStudentFee(studentId) {
    const student = students.find(
        item => String(item.id) === String(studentId)
    );

    if (!student) return;

    student.feeStatus =
        student.feeStatus === "Paid" ? "Not Paid" : "Paid";

    saveStudents();
    displayStudents();

    if (typeof displayFees === "function") displayFees();
}

function deleteStudent(studentId) {
    const confirmed = confirm(
        "Delete this student? Their student profile will be removed."
    );

    if (!confirmed) return;

    students = students.filter(
        item => String(item.id) !== String(studentId)
    );

    saveStudents();

    displayStudents();

    if (typeof loadAttendance === "function") loadAttendance();
    if (typeof displayFees === "function") displayFees();
}

document.addEventListener("DOMContentLoaded", () => {
    displayStudents();
});