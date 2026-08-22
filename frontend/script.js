/* =========================================================
   WANDERLYST - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const TRIPS_KEY = "wanderlystTrips";
const CURRENT_TRIP_KEY = "wanderlystCurrentTrip";
const USER_KEY = "wanderlystUser";



/* =========================================================
   HELPER FUNCTIONS
========================================================= */


/* Get saved trips */

function getTrips() {

    try {

        const trips = localStorage.getItem(TRIPS_KEY);

        return trips ? JSON.parse(trips) : [];

    } catch (error) {

        console.error("Could not read trips:", error);

        return [];

    }

}


/* Save trips */

function saveTrips(trips) {

    localStorage.setItem(
        TRIPS_KEY,
        JSON.stringify(trips)
    );

}


/* Show toast */

function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);

    }


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* Generate unique ID */

function generateId() {

    return Date.now().toString() +
        Math.random().toString(36).substring(2, 9);

}


/* Format date */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date = new Date(dateString + "T00:00:00");


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* Calculate number of days */

function calculateDays(start, end) {

    if (!start || !end) {
        return 1;
    }


    const startDate =
        new Date(start + "T00:00:00");

    const endDate =
        new Date(end + "T00:00:00");


    const difference =
        endDate.getTime() -
        startDate.getTime();


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1;


    return days > 0 ? days : 1;

}


/* =========================================================
   LOGIN
========================================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                showToast(
                    "Please enter your email and password."
                );

                return;

            }


            /* Save simple local login */

            const user = {

                email: email,

                loggedIn: true,

                loginTime:
                    new Date().toISOString()

            };


            localStorage.setItem(
                USER_KEY,
                JSON.stringify(user)
            );


            showToast(
                "Login successful! Welcome to Wanderlyst."
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 700);

        }
    );

}



/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(USER_KEY);

            window.location.href =
                "index.html";

        }
    );

}



/* =========================================================
   DESTINATION SUGGESTIONS
========================================================= */


/*
    IMPORTANT:

    These are ONLY suggestions.

    They do NOT decide the destination.

    Whatever the user actually types is saved.
*/

const popularDestinations = [

    {
        city: "Tokyo",
        country: "Japan"
    },

    {
        city: "Paris",
        country: "France"
    },

    {
        city: "London",
        country: "United Kingdom"
    },

    {
        city: "New York",
        country: "United States"
    },

    {
        city: "Dubai",
        country: "United Arab Emirates"
    },

    {
        city: "Singapore",
        country: "Singapore"
    },

    {
        city: "Sydney",
        country: "Australia"
    },

    {
        city: "Rome",
        country: "Italy"
    },

    {
        city: "Barcelona",
        country: "Spain"
    },

    {
        city: "Bali",
        country: "Indonesia"
    },

    {
        city: "Switzerland",
        country: "Switzerland"
    },

    {
        city: "Istanbul",
        country: "Turkey"
    },

    {
        city: "Amsterdam",
        country: "Netherlands"
    },

    {
        city: "Cairo",
        country: "Egypt"
    },

    {
        city: "Ahmedabad",
        country: "India"
    },

    {
        city: "Mumbai",
        country: "India"
    },

    {
        city: "Delhi",
        country: "India"
    },

    {
        city: "Goa",
        country: "India"
    }

];


const destinationInput =
    document.getElementById("destination");
/* =========================================================
   DESTINATION FROM DISCOVER PAGE
========================================================= */

if (destinationInput) {

    const selectedDestination =
        localStorage.getItem(
            "wanderlystSelectedDestination"
        );

    if (selectedDestination) {

        destinationInput.value =
            selectedDestination;

        localStorage.removeItem(
            "wanderlystSelectedDestination"
        );

    }

}

const destinationSuggestions =
    document.getElementById(
        "destinationSuggestions"
    );



if (
    destinationInput &&
    destinationSuggestions
) {


    /* =====================================================
       SHOW SUGGESTIONS
    ====================================================== */

    function showDestinationSuggestions(
        searchText = ""
    ) {


        const query =
            searchText
                .trim()
                .toLowerCase();


        let results;


        if (query === "") {

            results =
                popularDestinations.slice(0, 6);

        } else {

            results =
                popularDestinations.filter(
                    destination => {

                        const city =
                            destination.city
                                .toLowerCase();

                        const country =
                            destination.country
                                .toLowerCase();


                        return (
                            city.includes(query) ||
                            country.includes(query)
                        );

                    }
                ).slice(0, 6);

        }


        if (results.length === 0) {

            destinationSuggestions.innerHTML = "";

            destinationSuggestions.classList.remove(
                "show"
            );

            return;

        }


        destinationSuggestions.innerHTML =
            results.map(
                destination => {

                    return `

                        <button
                            type="button"
                            class="destination-option"
                            data-city="${destination.city}"
                            data-country="${destination.country}"
                        >

                            <span class="destination-option-icon">

                                <i class="fa-solid fa-location-dot"></i>

                            </span>


                            <span>

                                <strong>
                                    ${destination.city}
                                </strong>

                                <small>
                                    ${destination.country}
                                </small>

                            </span>

                        </button>

                    `;

                }
            ).join("");


        destinationSuggestions.classList.add(
            "show"
        );


    }



    /* =====================================================
       INPUT EVENT
    ====================================================== */

    destinationInput.addEventListener(
        "input",
        function () {

            showDestinationSuggestions(
                destinationInput.value
            );

        }
    );



    /* =====================================================
       FOCUS
    ====================================================== */

    destinationInput.addEventListener(
        "focus",
        function () {

            showDestinationSuggestions(
                destinationInput.value
            );

        }
    );



    /* =====================================================
       CLICK SUGGESTION
    ====================================================== */

    destinationSuggestions.addEventListener(
        "click",
        function (event) {


            const option =
                event.target.closest(
                    ".destination-option"
                );


            if (!option) {
                return;
            }


            const city =
                option.dataset.city;


            const country =
                option.dataset.country;


            destinationInput.value =
                `${city}, ${country}`;


            destinationSuggestions.classList.remove(
                "show"
            );

        }
    );



    /* =====================================================
       CLICK OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !destinationInput.contains(
                    event.target
                ) &&
                !destinationSuggestions.contains(
                    event.target
                )
            ) {

                destinationSuggestions.classList.remove(
                    "show"
                );

            }

        }
    );

}



/* =========================================================
   PLAN TRIP
========================================================= */

const tripForm =
    document.getElementById("tripForm");


if (tripForm) {


    /* =====================================================
       SET MINIMUM DATE
    ====================================================== */

    const startDate =
        document.getElementById("startDate");


    const endDate =
        document.getElementById("endDate");


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (startDate) {

        startDate.min = today;

    }


    if (endDate) {

        endDate.min = today;

    }



    /* =====================================================
       START DATE CHANGES
    ====================================================== */

    if (startDate && endDate) {

        startDate.addEventListener(
            "change",
            function () {

                endDate.min =
                    startDate.value;


                if (
                    endDate.value &&
                    endDate.value <
                    startDate.value
                ) {

                    endDate.value = "";

                }

            }
        );

    }



    /* =====================================================
       FORM SUBMISSION
    ====================================================== */

    tripForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* ---------------------------------------------
               GET VALUES
            --------------------------------------------- */

            const tripName =
                document
                    .getElementById("tripName")
                    .value
                    .trim();


            const destination =
                document
                    .getElementById("destination")
                    .value
                    .trim();


            const tripStartDate =
                document
                    .getElementById("startDate")
                    .value;


            const tripEndDate =
                document
                    .getElementById("endDate")
                    .value;


            const travellers =
                Number(
                    document
                        .getElementById("travellers")
                        .value
                );


            const style =
                document
                    .getElementById("style")
                    .value;


            const descriptionElement =
                document.getElementById(
                    "description"
                );


            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";



            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!tripName) {

                showToast(
                    "Please enter a trip name."
                );

                return;

            }


            if (!destination) {

                showToast(
                    "Please enter a destination."
                );

                return;

            }


            if (!tripStartDate) {

                showToast(
                    "Please select a start date."
                );

                return;

            }


            if (!tripEndDate) {

                showToast(
                    "Please select an end date."
                );

                return;

            }


            if (
                new Date(tripEndDate) <
                new Date(tripStartDate)
            ) {

                showToast(
                    "End date cannot be before start date."
                );

                return;

            }


            if (
                !travellers ||
                travellers < 1
            ) {

                showToast(
                    "Please enter at least one traveller."
                );

                return;

            }



            /* ---------------------------------------------
               CREATE TRIP OBJECT
            --------------------------------------------- */

            const trip = {

                id: generateId(),

                name: tripName,

                /*
                    THIS IS THE IMPORTANT PART.

                    We save EXACTLY what the user entered.

                    There is NO Paris fallback.
                */

                destination: destination,

                startDate: tripStartDate,

                endDate: tripEndDate,

                travellers: travellers,

                style: style,

                description: description,

                days: calculateDays(
                    tripStartDate,
                    tripEndDate
                ),

                createdAt:
                    new Date().toISOString()

            };



            /* ---------------------------------------------
               GET OLD TRIPS
            --------------------------------------------- */

            const trips =
                getTrips();



            /* ---------------------------------------------
               SAVE NEW TRIP
            --------------------------------------------- */

            trips.push(trip);


            saveTrips(trips);



            /* ---------------------------------------------
               SAVE CURRENT TRIP
            --------------------------------------------- */

            localStorage.setItem(
                CURRENT_TRIP_KEY,
                JSON.stringify(trip)
            );



            /* ---------------------------------------------
               SUCCESS
            --------------------------------------------- */

            showToast(
                `${destination} has been added to your trips!`
            );


            console.log(
                "Wanderlyst trip created:",
                trip
            );



            /* ---------------------------------------------
               GO TO ITINERARY
            --------------------------------------------- */

            setTimeout(
                function () {

                    window.location.href =
                        "itinerary.html";

                },
                700
            );

        }
    );

}



/* =========================================================
   ITINERARY PAGE
========================================================= */

const itineraryDays =
    document.getElementById(
        "itineraryDays"
    );


if (itineraryDays) {


    /* =====================================================
       GET CURRENT TRIP
    ====================================================== */

    const currentTripData =
        localStorage.getItem(
            CURRENT_TRIP_KEY
        );


    if (!currentTripData) {

        showToast(
            "No trip found. Please create a trip first."
        );


        setTimeout(
            function () {

                window.location.href =
                    "plan.html";

            },
            1200
        );


    } else {


        try {


            const trip =
                JSON.parse(
                    currentTripData
                );


            /* =============================================
               DISPLAY TRIP INFORMATION
            ============================================== */

            const tripNameElement =
                document.getElementById(
                    "itineraryTripName"
                );


            const destinationElement =
                document.getElementById(
                    "itineraryDestination"
                );


            const datesElement =
                document.getElementById(
                    "itineraryDates"
                );


            const travellersElement =
                document.getElementById(
                    "itineraryTravellers"
                );


            const styleElement =
                document.getElementById(
                    "itineraryStyle"
                );


            const descriptionElement =
                document.getElementById(
                    "itineraryDescription"
                );



            if (tripNameElement) {

                tripNameElement.textContent =
                    trip.name;

            }


            if (destinationElement) {

                destinationElement.innerHTML = `

                    <i
                        class="fa-solid fa-location-dot"
                        style="color:#d9a35f;"
                    ></i>

                    ${trip.destination}

                `;

            }


            if (datesElement) {

                datesElement.textContent =
                    `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;

            }


            if (travellersElement) {

                travellersElement.textContent =
                    `${trip.travellers} Traveller${trip.travellers == 1 ? "" : "s"}`;

            }


            if (styleElement) {

                styleElement.textContent =
                    trip.style;

            }


            if (descriptionElement) {

                descriptionElement.textContent =
                    trip.description ||
                    `Explore the best of ${trip.destination}.`;

            }



            /* =============================================
               GENERATE ITINERARY
            ============================================== */

            generateItinerary(trip);


        } catch (error) {

            console.error(
                "Could not load current trip:",
                error
            );


            showToast(
                "There was a problem loading your trip."
            );

        }

    }

}



/* =========================================================
   GENERATE ITINERARY
========================================================= */

function generateItinerary(trip) {


    const container =
        document.getElementById(
            "itineraryDays"
        );


    if (!container) {
        return;
    }


    const numberOfDays =
        trip.days ||
        calculateDays(
            trip.startDate,
            trip.endDate
        );


    const activities = [

        {
            icon: "fa-map-location-dot",

            title: "Explore the city",

            description:
                "Start your journey by exploring the most interesting places around your destination."

        },

        {
            icon: "fa-utensils",

            title: "Taste the local cuisine",

            description:
                "Discover local restaurants, traditional dishes and hidden food spots."

        },

        {
            icon: "fa-camera",

            title: "Discover iconic places",

            description:
                "Visit famous landmarks and capture memorable moments."

        },

        {
            icon: "fa-person-hiking",

            title: "Adventure & exploration",

            description:
                "Spend the day discovering something new and experiencing the local culture."

        },

        {
            icon: "fa-mug-hot",

            title: "Relax and enjoy",

            description:
                "Slow down, enjoy the atmosphere and experience the destination at your own pace."

        },

        {
            icon: "fa-landmark",

            title: "Culture & history",

            description:
                "Explore museums, historical landmarks and stories that make the destination unique."

        },

        {
            icon: "fa-sun",

            title: "Final day",

            description:
                "Enjoy your final moments, shop for souvenirs and prepare for your journey home."

        }

    ];


    let html = "";


    for (
        let day = 1;
        day <= numberOfDays;
        day++
    ) {


        const activity =
            activities[
                (day - 1) %
                activities.length
            ];


        const date =
            new Date(
                trip.startDate +
                "T00:00:00"
            );


        date.setDate(
            date.getDate() + day - 1
        );


        const dateText =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );


        html += `

            <div class="itinerary-day">


                <div class="day-number">

                    <span>
                        DAY
                    </span>

                    <strong>
                        ${day}
                    </strong>

                </div>


                <div class="day-content">


                    <div class="day-date">

                        ${dateText}

                    </div>


                    <div class="activity">


                        <div class="activity-icon">

                            <i
                                class="fa-solid ${activity.icon}"
                            ></i>

                        </div>


                        <div>

                            <h3>
                                ${activity.title}
                            </h3>


                            <p>

                                ${activity.description}

                            </p>


                            <p
                                style="
                                    margin-top:5px;
                                    color:#d9a35f;
                                    font-weight:500;
                                "
                            >

                                📍 ${trip.destination}

                            </p>

                        </div>


                    </div>


                </div>


            </div>

        `;

    }


    container.innerHTML =
        html;

}



/* =========================================================
   DELETE CURRENT TRIP
========================================================= */

const deleteTripBtn =
    document.getElementById(
        "deleteTripBtn"
    );


if (deleteTripBtn) {

    deleteTripBtn.addEventListener(
        "click",
        function () {


            const currentTripData =
                localStorage.getItem(
                    CURRENT_TRIP_KEY
                );


            if (!currentTripData) {

                window.location.href =
                    "trips.html";

                return;

            }


            const trip =
                JSON.parse(
                    currentTripData
                );


            const trips =
                getTrips();


            const remainingTrips =
                trips.filter(
                    savedTrip =>
                        savedTrip.id !==
                        trip.id
                );


            saveTrips(
                remainingTrips
            );


            localStorage.removeItem(
                CURRENT_TRIP_KEY
            );


            showToast(
                "Trip deleted successfully."
            );


            setTimeout(
                function () {

                    window.location.href =
                        "trips.html";

                },
                700
            );

        }
    );

}



/* =========================================================
   MY TRIPS PAGE
========================================================= */

const tripsContainer =
    document.getElementById(
        "tripsContainer"
    );


if (tripsContainer) {

    renderTrips();

}



/* =========================================================
   RENDER TRIPS
========================================================= */

function renderTrips() {


    const container =
        document.getElementById(
            "tripsContainer"
        );


    if (!container) {
        return;
    }


    const trips =
        getTrips();


    if (trips.length === 0) {

        container.innerHTML = `

            <div class="empty-trips">

                <div class="empty-icon">

                    <i class="fa-solid fa-suitcase-rolling"></i>

                </div>


                <h2>
                    No trips yet
                </h2>


                <p>
                    Your next adventure is waiting to be planned.
                </p>


                <a
                    href="plan.html"
                    class="primary-button"
                >

                    <i class="fa-solid fa-plus"></i>

                    PLAN YOUR FIRST TRIP

                </a>

            </div>

        `;

        return;

    }



    container.innerHTML =
        trips
            .slice()
            .reverse()
            .map(
                trip => `

                    <div
                        class="trip-card"
                        data-trip-id="${trip.id}"
                    >


                        <div class="trip-card-image">

                            <i class="fa-solid fa-earth-americas"></i>

                        </div>


                        <div class="trip-card-content">


                            <span class="trip-style">

                                ${trip.style}

                            </span>


                            <h3>

                                ${trip.name}

                            </h3>


                            <div class="trip-location">

                                <i class="fa-solid fa-location-dot"></i>

                                ${trip.destination}

                            </div>


                            <div class="trip-dates">

                                <i class="fa-regular fa-calendar"></i>

                                ${formatDate(trip.startDate)}
                                -
                                ${formatDate(trip.endDate)}

                            </div>


                            <div class="trip-travellers">

                                <i class="fa-solid fa-users"></i>

                                ${trip.travellers}
                                Traveller${trip.travellers == 1 ? "" : "s"}

                            </div>


                        </div>


                        <div class="trip-card-actions">


                            <button
                                class="trip-open"
                                data-action="open"
                                data-id="${trip.id}"
                                title="Open trip"
                            >

                                <i class="fa-solid fa-arrow-right"></i>

                            </button>


                            <button
                                class="trip-delete"
                                data-action="delete"
                                data-id="${trip.id}"
                                title="Delete trip"
                            >

                                <i class="fa-solid fa-trash"></i>

                            </button>


                        </div>


                    </div>

                `
            )
            .join("");



    /* =====================================================
       BUTTON EVENTS
    ====================================================== */

    container
        .querySelectorAll(
            "button[data-action]"
        )
        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    function () {


                        const action =
                            button.dataset.action;


                        const id =
                            button.dataset.id;


                        const trips =
                            getTrips();


                        const trip =
                            trips.find(
                                item =>
                                    item.id === id
                            );


                        if (!trip) {
                            return;
                        }



                        /* OPEN */

                        if (
                            action === "open"
                        ) {

                            localStorage.setItem(
                                CURRENT_TRIP_KEY,
                                JSON.stringify(trip)
                            );


                            window.location.href =
                                "itinerary.html";

                        }



                        /* DELETE */

                        if (
                            action === "delete"
                        ) {


                            const confirmed =
                                confirm(
                                    `Delete "${trip.name}"?`
                                );


                            if (!confirmed) {
                                return;
                            }


                            const remaining =
                                trips.filter(
                                    item =>
                                        item.id !== id
                                );


                            saveTrips(
                                remaining
                            );


                            renderTrips();


                            showToast(
                                "Trip deleted successfully."
                            );

                        }

                    }
                );

            }
        );

}



/* =========================================================
   DASHBOARD
========================================================= */

const recentTripsContainer =
    document.getElementById(
        "recentTrips"
    );


if (recentTripsContainer) {

    renderRecentTrips();

}



/* =========================================================
   RENDER RECENT TRIPS
========================================================= */

function renderRecentTrips() {


    const container =
        document.getElementById(
            "recentTrips"
        );


    if (!container) {
        return;
    }


    const trips =
        getTrips();


    if (trips.length === 0) {

        container.innerHTML = `

            <div class="empty-trips">

                <div class="empty-icon">

                    <i class="fa-solid fa-map"></i>

                </div>


                <h2>
                    Start planning
                </h2>


                <p>
                    Create your first Wanderlyst adventure.
                </p>


                <a
                    href="plan.html"
                    class="primary-button"
                >

                    <i class="fa-solid fa-plus"></i>

                    CREATE TRIP

                </a>

            </div>

        `;

        return;

    }


    const recent =
        trips
            .slice()
            .reverse()
            .slice(0, 3);


    container.innerHTML =
        recent
            .map(
                trip => `

                    <a
                        href="#"
                        class="dashboard-trip-card"
                        data-trip-id="${trip.id}"
                    >


                        <div class="dashboard-trip-image">

                            <i class="fa-solid fa-location-dot"></i>

                        </div>


                        <div class="dashboard-trip-content">


                            <span class="trip-style">

                                ${trip.style}

                            </span>


                            <h3>

                                ${trip.name}

                            </h3>


                            <p>

                                <i class="fa-solid fa-location-dot"></i>

                                ${trip.destination}

                            </p>


                            <span class="trip-date">

                                ${formatDate(trip.startDate)}

                                -

                                ${formatDate(trip.endDate)}

                            </span>


                        </div>


                        <div class="dashboard-trip-arrow">

                            <i class="fa-solid fa-chevron-right"></i>

                        </div>


                    </a>

                `
            )
            .join("");



    container
        .querySelectorAll(
            "[data-trip-id]"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        const id =
                            card.dataset.tripId;


                        const trip =
                            trips.find(
                                item =>
                                    item.id === id
                            );


                        if (!trip) {
                            return;
                        }


                        localStorage.setItem(
                            CURRENT_TRIP_KEY,
                            JSON.stringify(trip)
                        );


                        window.location.href =
                            "itinerary.html";

                    }
                );

            }
        );

}



/* =========================================================
   PROFILE
========================================================= */

const profileEmail =
    document.getElementById(
        "profileEmail"
    );


if (profileEmail) {

    const userData =
        localStorage.getItem(
            USER_KEY
        );


    if (userData) {

        try {

            const user =
                JSON.parse(
                    userData
                );


            profileEmail.textContent =
                user.email || "";

        } catch (error) {

            console.error(
                "Could not load user:",
                error
            );

        }

    }

}



/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%cWanderlyst loaded successfully 🌍✈️",
    "font-size:16px;font-weight:bold;color:#56352a;"
);