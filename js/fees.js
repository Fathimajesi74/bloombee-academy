function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function displayFees() {
    const feeList = document.getElementById("feeList");
    if (!feeList) return;

    feeList.innerHTML = "";

    const filter = document.getElementById("feeFilter")?.value || "All";

    students
        .filter(student => filter === "All" || student.class === filter)
        .forEach(student => {
            const sessions = typeof getStudentSessions === "function" ?
                getStudentSessions(student.id) :
                [];

            const cycleClasses = sessions.length % 25 ||
                (sessions.length > 0 ? 25 : 0);

            feeList.innerHTML += `
                <div class="student-card">
                    <h3>👤 ${student.name}</h3>
                    <p>🎓 Class: ${student.class}</p>
                    <p>💰 Fee per 25 classes: ₹${student.fee}</p>
                    <p>📚 Classes completed: ${cycleClasses}/25</p>
                    <p>📄 Payment Status:
                        <strong>${student.feeStatus || "Not Paid"}</strong>
                    </p>
                    <button onclick="markFeePaid(${student.id})">
                        ${student.feeStatus === "Paid"
                            ? "↩ Mark Unpaid"
                            : "✅ Mark Paid"}
                    </button>
                </div>
            `;
        });

    updatePendingFees();
}

function markFeePaid(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    student.feeStatus =
        student.feeStatus === "Paid" ? "Not Paid" : "Paid";

    saveStudents();
    displayFees();

    if (typeof updateDashboard === "function") updateDashboard();
}

function updatePendingFees() {
    const total = students.reduce((sum, student) => {
        return student.feeStatus !== "Paid" ?
            sum + Number(student.fee || 0) :
            sum;
    }, 0);

    const element = document.getElementById("pendingFees");

    if (element) element.innerText = "₹" + total;
}

document.addEventListener("DOMContentLoaded", displayFees);