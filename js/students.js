let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


students.forEach(
    (student, index) => {

        if (!student.id) {

            student.id =
                Date.now() +
                index;

        }


        if (!student.joiningDate) {

            student.joiningDate =
                "";

        }


        if (
            student.fee === undefined
        ) {

            student.fee = 0;

        }


        if (!student.feeStatus) {

            student.feeStatus =
                "Not Paid";

        }


        if (!student.attendance) {

            student.attendance = {

                present: 0,

                absent: 0

            };

        }

    }
);


saveStudents();


function saveStudents() {

    localStorage.setItem(

        "students",

        JSON.stringify(
            students
        )

    );

}


function addStudent() {

    let name =
        document
        .getElementById(
            "studentName"
        )
        .value
        .trim();


    let className =
        document
        .getElementById(
            "studentClass"
        )
        .value;


    let parent =
        document
        .getElementById(
            "parentName"
        )
        .value
        .trim();


    let phone =
        document
        .getElementById(
            "phone"
        )
        .value
        .trim();


    let joiningDate =
        document
        .getElementById(
            "joiningDate"
        )
        .value;


    let fee =
        Number(

            document
            .getElementById(
                "fee"
            )
            .value

        );


    if (name === "") {

        alert(
            "Enter student name."
        );

        return;

    }


    if (joiningDate === "") {

        alert(
            "Select joining date."
        );

        return;

    }


    if (
        isNaN(fee) ||
        fee < 0
    ) {

        alert(
            "Enter valid monthly fee."
        );

        return;

    }


    students.push({

        id:

            Date.now() +

            Math.floor(
                Math.random() * 1000
            ),

        name:

            name,

        class:

            className,

        parent:

            parent,

        phone:

            phone,

        joiningDate:

            joiningDate,

        fee:

            fee,

        feeStatus:

            "Not Paid",

        attendance: {

            present: 0,

            absent: 0

        }

    });


    saveStudents();


    document
        .getElementById(
            "studentName"
        )
        .value = "";


    document
        .getElementById(
            "parentName"
        )
        .value = "";


    document
        .getElementById(
            "phone"
        )
        .value = "";


    document
        .getElementById(
            "joiningDate"
        )
        .value = "";


    document
        .getElementById(
            "fee"
        )
        .value = "";


    displayStudents();


    if (
        typeof loadAttendance ===
        "function"
    ) {

        loadAttendance();

    }


    if (
        typeof displayFees ===
        "function"
    ) {

        displayFees();

    }


    alert(
        "Student added successfully."
    );

}


function getStudentAttendance(
    student
) {

    let data =

        JSON.parse(

            localStorage.getItem(
                "attendance"
            )

        ) || {};


    let present = 0;

    let absent = 0;


    Object.values(
        data
    ).forEach(day => {

        if (
            day.holiday
        ) {

            return;

        }


        if (
            day[student.id] ===
            "Present"
        ) {

            present++;

        }


        if (
            day[student.id] ===
            "Absent"
        ) {

            absent++;

        }

    });


    return {

        present:

            present,

        absent:

            absent

    };

}


function displayStudents() {

    let list =
        document
        .getElementById(
            "studentList"
        );


    if (!list) return;


    let search =
        document
        .getElementById(
            "search"
        )
        ?.value
        ?.toLowerCase() || "";


    list.innerHTML = "";


    students

        .filter(student =>

        student.name
        .toLowerCase()
        .includes(search)

    )

    .forEach(
        (student, index) => {


            let totals =
                getStudentAttendance(
                    student
                );


            let total =

                totals.present +

                totals.absent;


            let percentage =

                total > 0

                ?

                Math.round(

                    totals.present /

                    total *

                    100

                )

            :

            0;


            list.innerHTML += `

<div class="student-card">

<h3>
👤 ${student.name}
</h3>

<p>
🎓 Class:
${student.class}
</p>

<p>
👨‍👩‍👧 Parent:
${student.parent || "Not Added"}
</p>

<p>
📱
${student.phone || "No Number"}
</p>

<p>
📅 Joining Date:
${student.joiningDate || "Not Added"}
</p>

<p>
💰 Monthly Fee:
₹${student.fee}
</p>

<p>
📄 Status:
${student.feeStatus}
</p>

<p>
✅ Total Present:
${totals.present}
</p>

<p>
❌ Total Absent:
${totals.absent}
</p>

<p>
📊 Attendance:
${percentage}%
</p>

<button
class="whatsapp"
onclick="openWhatsApp(
'${student.phone}'
)">

💬 WhatsApp

</button>

<button
class="edit"
onclick="editStudent(
${index}
)">

✏ Edit

</button>

<button
class="delete"
onclick="deleteStudent(
${index}
)">

🗑 Delete

</button>

</div>

`;

        });


    updateStudentCount();

}


function editStudent(index) {

    let student =
        students[index];


    let name =
        prompt(

            "Student Name",

            student.name

        );


    if (
        name === null
    ) return;


    let parent =
        prompt(

            "Parent Name",

            student.parent

        );


    if (
        parent === null
    ) return;


    let phone =
        prompt(

            "Phone",

            student.phone

        );


    if (
        phone === null
    ) return;


    let joiningDate =
        prompt(

            "Joining Date",

            student.joiningDate

        );


    if (
        joiningDate === null
    ) return;


    let fee =
        prompt(

            "Monthly Fee",

            student.fee

        );


    if (
        fee === null
    ) return;


    fee =
        Number(fee);


    if (
        isNaN(fee) ||
        fee < 0
    ) {

        alert(
            "Invalid fee."
        );

        return;

    }


    student.name =
        name.trim();


    student.parent =
        parent.trim();


    student.phone =
        phone.trim();


    student.joiningDate =
        joiningDate;


    student.fee =
        fee;


    saveStudents();


    displayStudents();


    if (
        typeof displayFees ===
        "function"
    ) {

        displayFees();

    }

}


function deleteStudent(index) {

    if (

        !confirm(
            "Delete this student?"
        )

    ) return;


    students.splice(

        index,

        1

    );


    saveStudents();


    displayStudents();


    if (
        typeof loadAttendance ===
        "function"
    ) {

        loadAttendance();

    }

}


function openWhatsApp(phone) {

    if (!phone) {

        alert(
            "Phone number unavailable."
        );

        return;

    }


    let number =

        phone.replace(

            /\D/g,

            ""

        );


    if (
        number.length === 10
    ) {

        number =
            "91" +
            number;

    }


    window.open(

        "https://wa.me/" +
        number,

        "_blank"

    );

}


function updateStudentCount() {

    let count =
        document
        .getElementById(
            "totalStudents"
        );


    if (count) {

        count.innerText =
            students.length;

    }

}


displayStudents();