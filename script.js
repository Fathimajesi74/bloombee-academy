let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function updateDashboard() {

    const total = students.length;

    const present = students.filter(student => student.attendance === "Present").length;

    const absent = students.filter(student => student.attendance === "Absent").length;

    document.getElementById("totalStudents").innerText = total;
    document.getElementById("presentStudents").innerText = present;
    document.getElementById("absentStudents").innerText = absent;
}

function displayStudents() {

    const container = document.getElementById("students");

    container.innerHTML = "";

    const search = document
        .getElementById("searchStudent")
        .value
        .toLowerCase();

    const filter = document
        .getElementById("filterClass")
        .value;

    students.forEach((student, index) => {

        if (
            student.name.toLowerCase().includes(search) &&
            (filter === "All" || student.class === filter)
        ) {

            let badgeColor = "#999";

            if (student.attendance === "Present")
                badgeColor = "#4CAF50";

            if (student.attendance === "Absent")
                badgeColor = "#f44336";

            container.innerHTML += `

            <div class="student">

                <div>

                    <strong>${student.name}</strong><br>

                    <small>${student.class}</small><br>

                    <small style="color:${badgeColor};font-weight:bold;">
                        ${student.attendance || "Not Marked"}
                    </small>

                </div>

                <div class="actions">

                    <button class="present"
                        onclick="markAttendance(${index},'Present')">
                        Present
                    </button>

                    <button class="absent"
                        onclick="markAttendance(${index},'Absent')">
                        Absent
                    </button>

                    <button
                        onclick="deleteStudent(${index})">
                        🗑 Delete
                    </button>

                </div>

            </div>

            `;
        }

    });

    updateDashboard();

}

function addStudent() {

    const name = document
        .getElementById("studentName")
        .value
        .trim();

    const studentClass = document
        .getElementById("classSelect")
        .value;

    if (name === "") {

        alert("Please enter a student name.");

        return;

    }

    students.push({

        name: name,

        class: studentClass,

        attendance: ""

    });

    saveStudents();

    displayStudents();

    document.getElementById("studentName").value = "";

}

function deleteStudent(index) {

    if (confirm("Are you sure you want to delete this student?")) {

        students.splice(index, 1);

        saveStudents();

        displayStudents();

    }

}

function markAttendance(index, status) {

    students[index].attendance = status;

    saveStudents();

    displayStudents();

}

displayStudents();