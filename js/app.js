function openPage(page) {


    let pages =
        document.querySelectorAll(
            ".page"
        );



    pages.forEach(p => {


        p.classList.remove(
            "active"
        );


    });



    document
        .getElementById(page)
        .classList.add(
            "active"
        );


}



function updateGreeting() {


    let hour =
        new Date()
        .getHours();



    let message = "";



    if (hour < 12) {


        message =
            "Good Morning 👋";


    } else if (hour < 17) {


        message =
            "Good Afternoon 👋";


    } else {


        message =
            "Good Evening 👋";


    }





    let greeting =
        document.getElementById(
            "greeting"
        );



    if (greeting) {

        greeting.innerText =
            message;

    }


}




function updateDashboard() {


    if (
        typeof students === "undefined"
    )
        return;




    let present = 0;

    let absent = 0;



    let today =
        new Date()
        .toISOString()
        .split("T")[0];



    let attendance =
        JSON.parse(

            localStorage.getItem(
                "attendance"

            )

        ) || {};





    if (
        attendance[today]
    ) {



        Object.values(
                attendance[today]

            )
            .forEach(status => {


                if (
                    status === "Present"
                ) {

                    present++;

                }



                if (
                    status === "Absent"
                ) {

                    absent++;

                }



            });


    }





    let total =
        document.getElementById(
            "totalStudents"
        );



    let presentBox =
        document.getElementById(
            "presentCount"
        );



    let absentBox =
        document.getElementById(
            "absentCount"
        );





    if (total) {

        total.innerText =
            students.length;

    }



    if (presentBox) {

        presentBox.innerText =
            present;

    }



    if (absentBox) {

        absentBox.innerText =
            absent;

    }




    if (
        typeof updatePendingFees === "function"
    ) {

        updatePendingFees();

    }



}





window.onload = function() {


    updateGreeting();


    setInterval(
        updateGreeting,
        60000
    );


    updateDashboard();


};