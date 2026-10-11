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
            // getStudentSessions returns a NUMBER, not an array.
            const sessions = typeof getStudentSessions === "function" ?
                getStudentSessions(student.id) :
                0;

            // Show 0/25 after each completed cycle.
            const cycleClasses = sessions % 25;

            feeList.innerHTML += `
                <div class="student-card">
                    <h3>👤 ${escapeFeeText(student.name)}</h3>
                    <p>🎓 Class: ${escapeFeeText(student.class || "")}</p>
                    <p>💰 Fee per 25 classes: ₹${Number(student.fee || 0)}</p>
                    <p>📚 Current cycle: ${cycleClasses}/25</p>
                    <p>📄 Payment Status:
                        <strong>${escapeFeeText(student.feeStatus || "Not Paid")}</strong>
                    </p>
                    <button type="button"
                        onclick="markFeePaid('${String(student.id).replace(/'/g, "\\'")}')">
                        ${student.feeStatus === "Paid"
                            ? "↩ Mark Unpaid"
                            : "✅ Mark Paid"}
                    </button>
                </div>
            `;
        });

    updatePendingFees();
}

function escapeFeeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function markFeePaid(studentId) {
    const student = students.find(
        s => String(s.id) === String(studentId)
    );

    if (!student) return;

    student.feeStatus =
        student.feeStatus === "Paid" ? "Not Paid" : "Paid";

    saveStudents();
    displayFees();

    if (typeof displayStudents === "function") displayStudents();
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