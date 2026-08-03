let attendanceData =
    JSON.parse(
        localStorage.getItem("attendance")
    ) || {};



function saveAttendance() {

    localStorage.setItem(

        "attendance",

        JSON.stringify(
            attendanceData
        )

    );

}



function getSelectedDate() {

    let input =
        document.getElementById(
            "attendanceDate"
        );


    if (!input) {

        return "";

    }


    return input.value;

}



function loadAttendance() {

    let list =
        document.getElementById(
            "attendanceList"
        );


    if (!list) return;


    let selectedDate =
        getSelectedDate();


    if (selectedDate === "") {

        list.innerHTML = `

<p>
Please select a date.
</p>

`;

        return;

    }


    list.innerHTML = "";


    if (

        attendanceData[selectedDate]

        &&

        attendanceData[selectedDate]
        .holiday === true

    ) {

        list.innerHTML = `

<div class="student-card">

<h3>
🏖 Holiday
</h3>

<p>
Attendance is not required
for this date.
</p>

</div>

`;

        return;

    }



    students.forEach(
        student => {


            let status =

                attendanceData[selectedDate]

            ?

            attendanceData[selectedDate]
                [student.id]

            :

            "";


            let summary =

                getIndividualAttendance(
                    student,
                    selectedDate
                );


            list.innerHTML += `

<div class="attendance-card">


<div class="attendance-student">


<h3>

👤 ${student.name}

</h3>


<p>

🎓 Class:

${student.class}

</p>


<p>

📅 Selected Date:

${selectedDate}

</p>


<p>

Status:

<strong>

${status || "Not Marked"}

</strong>

</p>



<div class="attendance-buttons">


<button

class="present-btn"

onclick="markAttendance(
${student.id},
'Present'
)">

✅ Present

</button>



<button

class="absent-btn"

onclick="markAttendance(
${student.id},
'Absent'
)">

❌ Absent

</button>


</div>



<div class="student-attendance-summary">


<h3>

📊 ${student.name}'s
Attendance Summary

</h3>


<p>

Selected Month:

<strong>

${summary.monthName}

</strong>

</p>


<p>

✅ Monthly Present:

<strong>

${summary.monthlyPresent}

</strong>

</p>


<p>

❌ Monthly Absent:

<strong>

${summary.monthlyAbsent}

</strong>

</p>


<p>

🏖 Holidays:

<strong>

${summary.holidays}

</strong>

</p>


<p>

📈 Year Present:

<strong>

${summary.yearPresent}

</strong>

</p>


<p>

📉 Year Absent:

<strong>

${summary.yearAbsent}

</strong>

</p>


</div>


</div>


</div>

`;

        });

}



function markAttendance(
    studentId,
    status
) {

    let date =
        getSelectedDate();


    if (date === "") {

        alert(
            "Please select a date."
        );

        return;

    }


    if (!attendanceData[date]) {

        attendanceData[date] = {};

    }


    if (

        attendanceData[date]
        .holiday === true

    ) {

        alert(

            "This date is marked as a holiday."

        );

        return;

    }


    attendanceData[date]
        [studentId] =

        status;


    saveAttendance();


    loadAttendance();


    if (

        typeof updateDashboard ===
        "function"

    ) {

        updateDashboard();

    }

}



function markAllPresent() {

    let date =
        getSelectedDate();


    if (date === "") {

        alert(

            "Please select a date."

        );

        return;

    }


    if (!attendanceData[date]) {

        attendanceData[date] = {};

    }


    if (

        attendanceData[date]
        .holiday === true

    ) {

        alert(

            "This date is a holiday."

        );

        return;

    }


    students.forEach(
        student => {


            attendanceData[date]
                [student.id] =

                "Present";


        });


    saveAttendance();


    loadAttendance();


    if (

        typeof updateDashboard ===
        "function"

    ) {

        updateDashboard();

    }


    alert(

        "All students marked Present."

    );

}



function toggleHoliday() {

    let date =
        getSelectedDate();


    if (date === "") {

        alert(

            "Please select a date."

        );

        return;

    }


    if (

        attendanceData[date]

        &&

        attendanceData[date]
        .holiday === true

    ) {


        if (

            confirm(

                "Remove holiday?"

            )

        ) {


            delete attendanceData[date];


            saveAttendance();


            loadAttendance();

        }


        return;

    }


    if (

        confirm(

            "Mark this date as a holiday?"

        )

    ) {


        attendanceData[date] = {

            holiday: true

        };


        saveAttendance();


        loadAttendance();


        if (

            typeof updateDashboard ===
            "function"

        ) {

            updateDashboard();

        }

    }

}



function getIndividualAttendance(
    student,
    selectedDate
) {


    let selected =

        new Date(

            selectedDate +

            "T00:00:00"

        );


    let selectedMonth =

        selected.getMonth();


    let selectedYear =

        selected.getFullYear();


    let monthlyPresent = 0;

    let monthlyAbsent = 0;

    let holidays = 0;

    let yearPresent = 0;

    let yearAbsent = 0;



    Object.keys(
        attendanceData
    ).forEach(
        date => {


            let current =

                new Date(

                    date +

                    "T00:00:00"

                );


            let day =

                attendanceData[date];


            let sameMonth =

                current.getMonth()

            ===

            selectedMonth

                &&

                current.getFullYear()

            ===

            selectedYear;


            let sameYear =

                current.getFullYear()

            ===

            selectedYear;



            if (

                day.holiday === true

            ) {


                if (sameMonth) {

                    holidays++;

                }


                return;

            }



            let status =

                day[student.id];



            if (

                status ===

                "Present"

            ) {


                if (sameMonth) {

                    monthlyPresent++;

                }


                if (sameYear) {

                    yearPresent++;

                }

            }



            if (

                status ===

                "Absent"

            ) {


                if (sameMonth) {

                    monthlyAbsent++;

                }


                if (sameYear) {

                    yearAbsent++;

                }

            }


        });



    let monthName =

        selected.toLocaleString(

            "en-IN",

            {

                month: "long",

                year: "numeric"

            }

        );



    return {

        monthName:

            monthName,

        monthlyPresent:

            monthlyPresent,

        monthlyAbsent:

            monthlyAbsent,

        holidays:

            holidays,

        yearPresent:

            yearPresent,

        yearAbsent:

            yearAbsent

    };

}



document.addEventListener(

    "DOMContentLoaded",

    function() {


        let dateInput =

            document.getElementById(

                "attendanceDate"

            );


        if (!dateInput) return;



        if (

            dateInput.value === ""

        ) {


            dateInput.value =

                new Date()

            .toISOString()

            .split("T")[0];


        }



        dateInput.addEventListener(

            "change",

            loadAttendance

        );



        loadAttendance();


    }

);