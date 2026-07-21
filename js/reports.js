function generateStudentReport() {

    let report = window.open("", "_blank");

    let today = new Date().toLocaleDateString();

    let totalStudents = students.length;

    let paidStudents = 0;
    let unpaidStudents = 0;

    let totalCollected = 0;
    let totalPending = 0;

    report.document.write(`
<!DOCTYPE html>
<html>

<head>

<title>BLOOMBEE Student Report</title>

<style>

body{
    font-family:Arial,sans-serif;
    padding:25px;
    color:#333;
}

h1{
    text-align:center;
    color:#f4b400;
    margin-bottom:5px;
}

h2{
    text-align:center;
    margin-top:0;
}

.info{
    text-align:center;
    margin-bottom:25px;
}

.card{
    border:1px solid #ddd;
    border-radius:10px;
    padding:15px;
    margin-bottom:15px;
}

.card p{
    margin:6px 0;
}

.summary{
    margin-top:30px;
    border-top:2px solid #000;
    padding-top:15px;
    font-weight:bold;
}

</style>

</head>

<body>

<div style="text-align:center;">
    <img src="assets/logo.jpeg" width="90">
    <h1>BLOOM BEE ACADEMY</h1>
</div>

<h2>Student Report</h2>

<div class="info">
Tutor : <b>Zahirath Farhana</b><br>
Date : ${today}
</div>

`);

    students.forEach(student => {

        let present = student.presentCount || 0;
        let absent = student.absentCount || 0;

        if (student.feeStatus === "Paid") {
            paidStudents++;
            totalCollected += Number(student.fee);
        } else {
            unpaidStudents++;
            totalPending += Number(student.fee);
        }

        report.document.write(`

<div class="card">

<h3>👤 ${student.name}</h3>

<p><b>Class:</b> ${student.class}</p>

<p><b>Parent:</b> ${student.parent}</p>

<p><b>Phone:</b> ${student.phone || "No Number"}</p>

<p><b>Monthly Fee:</b> ₹${student.fee}</p>

<p><b>Fee Status:</b> ${student.feeStatus}</p>

<p><b>Present Days:</b> ${present}</p>

<p><b>Absent Days:</b> ${absent}</p>

</div>

`);

    });

    report.document.write(`

<div class="summary">

<h2>Summary</h2>

<p>Total Students : ${totalStudents}</p>

<p>Paid Students : ${paidStudents}</p>

<p>Unpaid Students : ${unpaidStudents}</p>

<p>Total Fees Collected : ₹${totalCollected}</p>

<p>Total Pending Fees : ₹${totalPending}</p>

</div>

</body>

</html>

`);

    report.document.close();

    report.print();

}