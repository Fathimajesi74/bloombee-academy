let attendanceData =
    JSON.parse(localStorage.getItem("attendance")) || {};



function todayDate() {

    return document.getElementById("attendanceDate").value;

}





function loadAttendance() {


    let list =
        document.getElementById("attendanceList");


    if (!list) return;


    list.innerHTML = "";


    let date =
        todayDate();



    students.forEach((student, index) => {


        let status = "";



        if (
            attendanceData[date] &&
            attendanceData[date][index]
        ) {

            status =
                attendanceData[date][index];

        }



        list.innerHTML += `


<div class="attendance-card">


    <div>


        <strong>
            ${student.name}
        </strong>


        <br>


        <small>
            ${student.class}
        </small>


        <br>


        <small>
            Status:
            ${status || "Not Marked"}
        </small>


    </div>



    <div>


        <button
        class="present-btn"
        onclick="markAttendance(${index},'Present')">

        ✅

        </button>



        <button
        class="absent-btn"
        onclick="markAttendance(${index},'Absent')">

        ❌

        </button>


    </div>


</div>


`;

    });


}






function markAttendance(index, status) {


    let date =
        todayDate();



    if (!attendanceData[date]) {

        attendanceData[date] = {};

    }



    let oldStatus =
        attendanceData[date][index];



    if (!students[index].attendance) {

        students[index].attendance = {

            present: 0,

            absent: 0

        };

    }





    // Remove previous attendance count


    if (oldStatus === "Present") {


        students[index].attendance.present =
            Math.max(
                0,
                students[index].attendance.present - 1
            );


    }



    if (oldStatus === "Absent") {


        students[index].attendance.absent =
            Math.max(
                0,
                students[index].attendance.absent - 1
            );


    }






    // Add new attendance count


    if (status === "Present") {


        students[index].attendance.present++;

    }



    if (status === "Absent") {


        students[index].attendance.absent++;

    }






    attendanceData[date][index] = status;



    localStorage.setItem(
        "attendance",
        JSON.stringify(attendanceData)
    );



    saveStudents();



    loadAttendance();



    updateDashboard();


}








function markAllPresent() {


    let date =
        todayDate();



    if (!attendanceData[date]) {

        attendanceData[date] = {};

    }




    students.forEach((student, index) => {



        if (!student.attendance) {


            student.attendance = {

                present: 0,

                absent: 0

            };


        }





        let oldStatus =
            attendanceData[date][index];






        if (oldStatus === "Absent") {


            student.attendance.absent =
                Math.max(
                    0,
                    student.attendance.absent - 1
                );


        }






        if (oldStatus !== "Present") {


            student.attendance.present++;


        }





        attendanceData[date][index] =
            "Present";



    });





    localStorage.setItem(
        "attendance",
        JSON.stringify(attendanceData)
    );



    saveStudents();



    loadAttendance();



    updateDashboard();


}









document
    .getElementById("attendanceDate")
    .addEventListener(
        "change",
        loadAttendance
    );








setTimeout(() => {


    let dateInput =
        document.getElementById("attendanceDate");



    if (dateInput) {



        dateInput.value =
            new Date()
            .toISOString()
            .split("T")[0];



        loadAttendance();


    }



}, 500);





updateDashboard();