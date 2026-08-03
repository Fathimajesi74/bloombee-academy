function generateStudentReport() {


    let report =
        window.open(
            "",
            "_blank"
        );



    report.document.write(`


<html>

<head>


<title>
BLOOMBEE Student Report
</title>


<style>


body{

font-family:Arial;

padding:20px;

}



.card{

border:1px solid #ccc;

padding:15px;

margin:15px;

border-radius:10px;

}


h1{

text-align:center;

}


</style>


</head>


<body>



<h1>
🐝 BLOOMBEE
</h1>


<h2>
Student Report
</h2>



`);





    students.forEach(student => {


        let attendance =
            getStudentAttendance(
                student
            );



        let total =

            attendance.present +

            attendance.absent;



        let percentage =

            total > 0

            ?

            Math.round(

                attendance.present /

                total *

                100

            )

        :

        0;




        report.document.write(`


<div class="card">


<h3>
👤 ${student.name}
</h3>



<p>
🎓 Class:
${student.class}
</p>



<p>
👨‍👩‍👧 Parent:
${student.parent}
</p>



<p>
📱 Phone:
${student.phone}
</p>



<p>
📅 Joining Date:
${student.joiningDate}
</p>



<p>
💰 Monthly Fee:
₹${student.fee}
</p>



<p>
📄 Fee Status:
${student.feeStatus}
</p>



<p>
✅ Total Present:
${attendance.present}
</p>



<p>
❌ Total Absent:
${attendance.absent}
</p>



<p>
📊 Attendance:
${percentage}%
</p>



</div>


`);



    });





    report.document.write(`


</body>

</html>


`);



    report.document.close();


    report.print();



}