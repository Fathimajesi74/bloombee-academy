function updateFeeDashboard() {


    let pendingAmount = 0;


    students.forEach(student => {


        if (student.feeStatus === "Not Paid") {

            pendingAmount += Number(student.fee);

        }


    });



    let feeBox = document.getElementById("pendingFees");



    if (feeBox) {

        feeBox.innerText = "₹" + pendingAmount;

    }


}





function toggleFeeStatus(index) {


    if (students[index].feeStatus === "Paid") {


        students[index].feeStatus = "Not Paid";


    } else {


        students[index].feeStatus = "Paid";


    }


    saveStudents();


    displayFees();


    updateFeeDashboard();


}





function displayFees() {


    let box = document.getElementById("feeList");


    if (!box) return;


    box.innerHTML = "";



    let filter =
        document.getElementById("feeFilter").value;

    students

        .filter(student => {

        if (filter === "All") {

            return true;

        }

        return student.class === filter;

    })

    .forEach((student, index) => {



        box.innerHTML += `


<div class="student-card">


<h3>
${student.name}
</h3>


<p>
Class: ${student.class}
</p>


<p>
Fee: ₹${student.fee}
</p>



<p class="${
student.feeStatus === 'Paid'
? 'paid-status'
: 'unpaid-status'
}">

Status: ${student.feeStatus}

</p>



<button onclick="toggleFeeStatus(${index})">

${
student.feeStatus === "Paid"
? "↩ Mark Unpaid"
: "✅ Mark Paid"
}

</button>



</div>


`;



    });


}





displayFees();

updateFeeDashboard();