function openPage(page) {

    let pages = document.querySelectorAll(".page");


    pages.forEach(function(item) {

        item.classList.remove("active");

    });


    document
        .getElementById(page)
        .classList.add("active");


}



function updateDashboard() {


    let today = new Date()
        .toISOString()
        .split("T")[0];


    let attendance =
        JSON.parse(localStorage.getItem("attendance")) || {};



    let todayAttendance =
        attendance[today] || {};



    let present = 0;

    let absent = 0;



    Object.values(todayAttendance)
        .forEach(status => {


            if (status === "Present") {

                present++;

            }


            if (status === "Absent") {

                absent++;

            }


        });



    let presentBox =
        document.getElementById("presentCount");


    let absentBox =
        document.getElementById("absentCount");



    if (presentBox) {

        presentBox.innerText = present;

    }



    if (absentBox) {

        absentBox.innerText = absent;

    }



}

function updateGreeting() {

    let hour = new Date().getHours();

    let greeting = "";

    if (hour >= 5 && hour < 12) {

        greeting = "🌅 Good Morning";

    } else if (hour >= 12 && hour < 17) {

        greeting = "☀️ Good Afternoon";

    } else if (hour >= 17 && hour < 21) {

        greeting = "🌇 Good Evening";

    } else {

        greeting = "🌙 Good Night";

    }

    let greet = document.getElementById("greeting");

    if (greet) {

        greet.innerText = greeting;

    }

}

updateGreeting();