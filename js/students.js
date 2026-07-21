let students = JSON.parse(localStorage.getItem("students")) || [];
const classFees = {
    "LKG": 500,
    "UKG": 500,
    "Class 1": 600,
    "Class 2": 600,
    "Class 3": 700,
    "Class 4": 700,
    "Class 5": 700,
    "Class 6": 900,
    "Class 7": 900,
    "Class 8": 900
};
students.forEach(student => {

    if (!student.attendance) {

        student.attendance = {
            present: 0,
            absent: 0
        };

    }

    if (!student.feeStatus) {

        student.feeStatus = "Not Paid";

    }

    if (!student.fee) {

        student.fee = classFees[student.class] || 0;

    }

});
localStorage.setItem(
    "students",
    JSON.stringify(students)
);

// Save students
function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}

// Add Student
function addStudent() {


    let name = document
        .getElementById("studentName")
        .value
        .trim();


    let className = document
        .getElementById("studentClass")
        .value;


    let parent = document
        .getElementById("parentName")
        .value
        .trim();


    let phone = document
        .getElementById("phone")
        .value
        .trim();

    let fee = classFees[className];


    if (name === "") {

        alert("Please enter student name");

        return;

    }

    let student = {

        id: Date.now(),

        name: name,

        class: className,

        parent: parent,

        phone: phone,

        attendance: {
            present: 0,
            absent: 0
        },

        fee: Number(fee),

        feeStatus: "Not Paid"

    };



    students.push(student);



    saveStudents();


    displayStudents();



    // Clear inputs

    document.getElementById("studentName").value = "";

    document.getElementById("parentName").value = "";

    document.getElementById("phone").value = "";



    // Refresh attendance list if available

    if (typeof loadAttendance === "function") {

        loadAttendance();

    }


}




// Display Students

function displayStudents() {


    let list =
        document.getElementById("studentList");



    if (!list) return;



    list.innerHTML = "";



    let searchInput =
        document.getElementById("search");



    let search = "";

    if (searchInput) {

        search = searchInput.value.toLowerCase();

    }



    students

        .filter(student =>

        student.name
        .toLowerCase()
        .includes(search)

    )


    .forEach((student, index) => {


        list.innerHTML += `


        <div class="student-card">


            <h3>
            👤 ${student.name}
            </h3>


            <p>
            🎓 Class: ${student.class}
            </p>


            <p>
            👨‍👩‍👧 Parent: ${student.parent || "Not Added"}
            </p>


            <p>
            📱 ${student.phone || "No Number"}
            </p>

            <p>
💰 Fee: ₹${student.fee}
</p>

<p>
📄 Status: ${student.feeStatus}
</p>

<p>
✅ Present: ${student.attendance?.present || 0}
</p>

<p>
❌ Absent: ${student.attendance?.absent || 0}
</p>
        
            <button 
            class="whatsapp"
            onclick="openWhatsApp('${student.phone}')">

            💬 WhatsApp

            </button>



            <button
class="edit"
onclick="editStudent(${index})">

✏ Edit

</button>

<button
class="delete"
onclick="deleteStudent(${index})">

🗑 Delete

</button>


        </div>


        `;


    });



    updateStudentCount();


}

function editStudent(index) {

    let student = students[index];

    let newName =
        prompt(
            "Student Name",
            student.name
        );

    if (newName === null) return;

    let newParent =
        prompt(
            "Parent Name",
            student.parent
        );

    if (newParent === null) return;

    let newPhone =
        prompt(
            "Phone Number",
            student.phone
        );

    if (newPhone === null) return;

    students[index].name =
        newName.trim();

    students[index].parent =
        newParent.trim();

    students[index].phone =
        newPhone.trim();

    saveStudents();

    displayStudents();

    if (typeof loadAttendance === "function") {

        loadAttendance();

    }

}





// Delete Student

function deleteStudent(index) {


    let confirmDelete =
        confirm(
            "Delete this student?"
        );



    if (confirmDelete) {


        students.splice(index, 1);



        saveStudents();


        displayStudents();



        if (typeof loadAttendance === "function") {

            loadAttendance();

        }


    }


}






// WhatsApp

function openWhatsApp(phone) {


    if (phone === "") {

        alert("Phone number not available");

        return;

    }



    window.open(

        "https://wa.me/91" + phone,

        "_blank"

    );


}

// Update Dashboard Count

function updateStudentCount() {


    let count =
        document.getElementById("totalStudents");



    if (count) {

        count.innerText =
            students.length;

    }


}

// Load students when page opens

displayStudents();