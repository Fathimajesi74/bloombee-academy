function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}



function displayFees() {

    let feeList =
        document.getElementById(
            "feeList"
        );


    if (!feeList) return;


    feeList.innerHTML = "";


    let filter =
        document.getElementById(
            "feeFilter"
        ).value;



    students

        .filter(student => {

        if (filter === "All") {

            return true;

        }

        return student.class === filter;

    })


    .forEach((student, index) => {


        feeList.innerHTML += `


<div class="student-card">


<h3>
👤 ${student.name}
</h3>


<p>
🎓 Class:
${student.class}
</p>


<p>
💰 Monthly Fee:
₹${student.fee}
</p>


<p>
📄 Payment Status:
<strong>
${student.feeStatus}
</strong>
</p>


<button
onclick="markFeePaid(${index})">

${student.feeStatus==="Paid"

?

"↩ Mark Unpaid"

:

"✅ Mark Paid"}

</button>



</div>


`;



    });



    updatePendingFees();


}




function markFeePaid(index) {


    if (
        students[index].feeStatus === "Paid"
    ) {

        students[index].feeStatus =
            "Not Paid";

    } else {

        students[index].feeStatus =
            "Paid";

    }



    saveStudents();


    displayFees();


    updateDashboard();


}




function updatePendingFees() {


    let total = 0;


    students.forEach(student => {


        if (
            student.feeStatus === "Not Paid"
        ) {

            total += Number(
                student.fee
            );

        }


    });



    let element =
        document.getElementById(
            "pendingFees"
        );


    if (element) {

        element.innerText =
            "₹" + total;

    }


}



displayFees();