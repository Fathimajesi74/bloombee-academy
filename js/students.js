// Load students from localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Save students
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Add a new student
function addStudent() {
    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value;
    const parent = document.getElementById("parentName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const joiningDate = document.getElementById("joiningDate").value;
    const fee = Number(document.getElementById("fee").value);

    if (!name || !parent || !phone || !joiningDate || document.getElementById("fee").value === "") {
        alert("Please fill in all student details.");
        return;
    }

    if (fee < 0 || !Number.isFinite(fee)) {
        alert("Please enter a valid fee amount.");
        return;
    }

    const student = {
        id: Date.now().toString(),
        name,
        class: studentClass,
        parent,
        phone,
        joiningDate,
        fee,
        feeStatus: "Not Paid",
        attendance: {}
    };

    students.push(student);
    saveStudents();

    document.getElementById("studentName").value = "";
    document.getElementById("parentName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("joiningDate").value = "";
    document.getElementById("fee").value = "";

    displayStudents();

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    if (typeof updatePendingFees === "function") {
        updatePendingFees();
    }

    alert("Student added successfully!");
}

// Get attendance count for the current 25-class cycle
function getStudentAttendance(student) {
    if (typeof getStudentSessions === "function") {
        // ========================================
        // BLOOMBEE - STUDENT MANAGEMENT
        // Attendance tracked in 25-class cycles
        // ========================================

        // Load students from localStorage.
        let students = [];

        try {
            students = JSON.parse(localStorage.getItem("students")) || [];
        } catch (error) {
            students = [];
        }

        // Save students.
        function saveStudents() {
            localStorage.setItem("students", JSON.stringify(students));
        }

        // Add a new student.
        function addStudent() {
            const name = document.getElementById("studentName").value.trim();
            const studentClass = document.getElementById("studentClass").value;
            const parent = document.getElementById("parentName").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const joiningDate = document.getElementById("joiningDate").value;
            const feeInput = document.getElementById("fee").value;
            const fee = Number(feeInput);

            if (!name ||
                !studentClass ||
                !parent ||
                !phone ||
                !joiningDate ||
                feeInput === ""
            ) {
                alert("Please fill in all student details.");
                return;
            }

            if (!Number.isFinite(fee) || fee < 0) {
                alert("Please enter a valid fee amount.");
                return;
            }

            const student = {
                id: Date.now().toString(),
                name,
                class: studentClass,
                parent,
                phone,
                joiningDate,
                fee,
                feeStatus: "Not Paid",
                attendance: {}
            };

            students.push(student);
            saveStudents();

            document.getElementById("studentName").value = "";
            document.getElementById("parentName").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("joiningDate").value = "";
            document.getElementById("fee").value = "";

            displayStudents();

            if (typeof updateDashboard === "function") {
                updateDashboard();
            }

            if (typeof updatePendingFees === "function") {
                updatePendingFees();
            }

            alert("Student added successfully!");
        }

        // Get attendance for the latest 25-class cycle.
        // attendanceData and getStudentAttendanceStats are defined in attendance.js.
        function getStudentAttendance(student) {
            if (typeof getStudentAttendanceStats === "function") {
                return getStudentAttendanceStats(student.id);
            }

            // Safe fallback before attendance.js has initialized.
            return {
                total: 0,
                present: 0,
                absent: 0,
                percentage: 0,
                completedCycles: 0,
                overallTotal: 0
            };
        }

        // Display students and their current cycle statistics.
        function displayStudents() {
            const list = document.getElementById("studentList");

            if (!list) return;

            const searchInput = document.getElementById("search");
            const search = searchInput ?
                searchInput.value.toLowerCase().trim() :
                "";

            list.innerHTML = "";

            const filteredStudents = students.filter(student => {
                const name = String(student.name || "").toLowerCase();
                const studentClass = String(student.class || "").toLowerCase();
                const parent = String(student.parent || "").toLowerCase();

                return (
                    name.includes(search) ||
                    studentClass.includes(search) ||
                    parent.includes(search)
                );
            });

            if (filteredStudents.length === 0) {
                list.innerHTML = "<p>No students found.</p>";
                return;
            }

            filteredStudents.forEach(student => {
                const attendance = getStudentAttendance(student);

                const card = document.createElement("div");
                card.className = "student-card";

                card.innerHTML = `
            <h3>${escapeStudentText(student.name)}</h3>

            <p>
                <strong>Class:</strong>
                ${escapeStudentText(student.class || "-")}
            </p>

            <p>
                <strong>Parent:</strong>
                ${escapeStudentText(student.parent || "-")}
            </p>

            <p>
                <strong>Phone:</strong>
                ${escapeStudentText(student.phone || "-")}
            </p>

            <p>
                <strong>Joining Date:</strong>
                ${escapeStudentText(student.joiningDate || "-")}
            </p>

            <p>
                <strong>Fee for 25 Classes:</strong>
                ₹${Number(student.fee || 0).toLocaleString("en-IN")}
            </p>

            <p>
                <strong>Fee Status:</strong>
                ${escapeStudentText(student.feeStatus || "Not Paid")}
            </p>

            <hr>

            <h4>Current 25-Class Attendance Report</h4>

            <p>
                <strong>Classes Marked:</strong>
                ${attendance.total}/25
            </p>

            <p>
                <strong>Present:</strong>
                ${attendance.present}
            </p>

            <p>
                <strong>Absent:</strong>
                ${attendance.absent}
            </p>

            <p>
                <strong>Attendance Percentage:</strong>
                ${attendance.percentage}%
            </p>

            <p>
                <strong>All-Time Marked Classes:</strong>
                ${attendance.overallTotal}
            </p>

            <button onclick="deleteStudent('${student.id}')">
                🗑 Delete
            </button>
        `;

                list.appendChild(card);
            });
        }

        // Safely display student-entered text.
        function escapeStudentText(value) {
            return String(value ?? "").replace(/[&<>"']/g, character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[character]);
        }

        // Delete a student.
        function deleteStudent(id) {
            if (!confirm("Are you sure you want to delete this student?")) {
                return;
            }

            students = students.filter(
                student => String(student.id) !== String(id)
            );

            saveStudents();
            displayStudents();

            if (typeof updateDashboard === "function") {
                updateDashboard();
            }

            if (typeof displayFees === "function") {
                displayFees();
            }

            if (typeof updatePendingFees === "function") {
                updatePendingFees();
            }
        }

        // Initial display.
        displayStudents();

        // Refresh student statistics after all scripts have loaded.
        document.addEventListener("DOMContentLoaded", function() {
            displayStudents();
        });
        const totalSessions = getStudentSessions(student.id);
        const completed = totalSessions % 25;

        return {
            total: completed === 0 && totalSessions > 0 ? 25 : completed,
            present: 0,
            absent: 0
        };
    }

    // Fallback until attendance.js has loaded
    return {
        total: 0,
        present: 0,
        absent: 0
    };
}

// Display student list
function displayStudents() {
    const list = document.getElementById("studentList");
    if (!list) return;

    const searchInput = document.getElementById("search");
    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

    list.innerHTML = "";

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(search) ||
        student.class.toLowerCase().includes(search) ||
        student.parent.toLowerCase().includes(search)
    );

    if (filteredStudents.length === 0) {
        list.innerHTML = "<p>No students found.</p>";
        return;
    }

    filteredStudents.forEach(student => {
        const attendance = getStudentAttendance(student);

        const card = document.createElement("div");
        card.className = "student-card";

        card.innerHTML = `
            <h3>${escapeStudentText(student.name)}</h3>
            <p><strong>Class:</strong> ${escapeStudentText(student.class)}</p>
            <p><strong>Parent:</strong> ${escapeStudentText(student.parent)}</p>
            <p><strong>Phone:</strong> ${escapeStudentText(student.phone)}</p>
            <p><strong>Joining Date:</strong> ${escapeStudentText(student.joiningDate || "-")}</p>
            <p><strong>Fee for 25 Classes:</strong> ₹${Number(student.fee || 0)}</p>
            <p><strong>Current Cycle:</strong> ${attendance.total}/25 classes marked</p>
            <button onclick="deleteStudent('${student.id}')">🗑 Delete</button>
        `;

        list.appendChild(card);
    });
}

// Safely display student-entered text
function escapeStudentText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Delete a student
function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    students = students.filter(student => student.id !== id);
    saveStudents();

    displayStudents();

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    if (typeof displayFees === "function") {
        displayFees();
    }
}

// Initial display
displayStudents();