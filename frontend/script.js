/* =====================================================
   WANDERLYST
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let travellerCount = 2;

let selectedInterests = [];

let selectedTravelStyle = "Budget";

let currentTrip = null;

let currentUser = null;


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(page) {

    const pages = [
        "homePage",
        "plannerPage",
        "resultsPage",
        "tripsPage"
    ];

    pages.forEach(function(id) {

        const element = document.getElementById(id);

        if (element) {
            element.classList.remove("active-page");
        }

    });


    const selectedPage =
        document.getElementById(page + "Page");

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    window.scrollTo(0, 0);


    if (page === "trips") {

        loadSavedTrips();

    }

}


/* =====================================================
   DESTINATION
===================================================== */

function setDestination(place) {

    const input =
        document.getElementById("destination");

    if (input) {

        input.value = place;

    }


    const suggestions =
        document.getElementById(
            "destinationSuggestions"
        );

    if (suggestions) {

        suggestions.style.display = "none";

    }

}


function suggestDestination() {

    const suggestions =
        document.getElementById(
            "destinationSuggestions"
        );

    if (!suggestions) {
        return;
    }


    if (suggestions.style.display === "flex") {

        suggestions.style.display = "none";

    } else {

        suggestions.style.display = "flex";

    }

}


/* =====================================================
   TRAVELLERS
===================================================== */

function changeTravellers(change) {

    travellerCount =
        travellerCount + change;


    if (travellerCount < 1) {

        travellerCount = 1;

    }


    if (travellerCount > 20) {

        travellerCount = 20;

    }


    const counter =
        document.getElementById(
            "travellerCount"
        );


    if (counter) {

        counter.textContent =
            travellerCount;

    }

}


/* =====================================================
   INTERESTS
===================================================== */

function toggleInterest(button) {

    if (!button) {
        return;
    }


    button.classList.toggle("selected");


    const interest =
        button.textContent.trim();


    if (
        button.classList.contains("selected")
    ) {

        if (
            !selectedInterests.includes(interest)
        ) {

            selectedInterests.push(interest);

        }

    } else {

        selectedInterests =
            selectedInterests.filter(
                function(item) {

                    return item !== interest;

                }
            );

    }

}


/* =====================================================
   TRAVEL STYLE
===================================================== */

function selectStyle(button) {

    if (!button) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".style-card"
        );


    cards.forEach(function(card) {

        card.classList.remove("active");

    });


    button.classList.add("active");


    const name =
        button.querySelector("strong");


    if (name) {

        selectedTravelStyle =
            name.textContent.trim();

    }

}


/* =====================================================
   CALCULATE DAYS
===================================================== */

function calculateDays(start, end) {

    if (!start || !end) {

        return 5;

    }


    const startDate =
        new Date(start);

    const endDate =
        new Date(end);


    const difference =
        endDate.getTime() -
        startDate.getTime();


    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (days <= 0) {

        return 5;

    }


    return days;

}


/* =====================================================
   CURRENCY
===================================================== */

function formatCurrency(value) {

    return (
        "₹" +
        Math.round(value)
            .toLocaleString("en-IN")
    );

}


/* =====================================================
   HELPER
===================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


function setBar(id, percentage) {

    const element =
        document.getElementById(id);


    if (element) {

        element.style.width =
            percentage + "%";

    }

}
/* =====================================================
   WEATHER FORECAST
===================================================== */

async function loadWeather(destination, startDate, endDate) {

    const weatherLocation =
        document.getElementById("weatherLocation");

    const weatherDays =
        document.getElementById("weatherDays");

    const mainTemp =
        document.getElementById("weatherMainTemp");

    const mainCondition =
        document.getElementById("weatherMainCondition");

    const mainIcon =
        document.getElementById("weatherMainIcon");

    const recommendation =
        document.getElementById("weatherRecommendation");


    if (!weatherDays) {
        return;
    }


    weatherDays.innerHTML = `
        <div class="weather-loading">
            ✦ Checking destination weather...
        </div>
    `;


    try {

        /* =================================================
           STEP 1 — FIND DESTINATION COORDINATES
        ================================================= */

        const geoResponse =
            await fetch(
                "https://geocoding-api.open-meteo.com/v1/search?name=" +
                encodeURIComponent(destination) +
                "&count=1&language=en&format=json"
            );


        if (!geoResponse.ok) {
            throw new Error("Could not find destination.");
        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error(
                "Destination not found."
            );

        }


        const location =
            geoData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        if (weatherLocation) {

            weatherLocation.textContent =
                "Forecast for " +
                location.name +
                (location.country
                    ? ", " + location.country
                    : "");

        }


        /* =================================================
           STEP 2 — GET WEATHER
        ================================================= */

        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + latitude +
            "&longitude=" + longitude +
            "&daily=" +
            "weather_code," +
            "temperature_2m_max," +
            "temperature_2m_min," +
            "precipitation_probability_max," +
            "precipitation_sum" +
            "&forecast_days=16" +
            "&timezone=auto";


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {
            throw new Error(
                "Weather service unavailable."
            );
        }


        const weatherData =
            await weatherResponse.json();


        if (!weatherData.daily) {
            throw new Error(
                "No weather data available."
            );
        }


        const daily =
            weatherData.daily;


        /* =================================================
           STEP 3 — DETERMINE DATES
        ================================================= */

        let dates = daily.time;

        let startIndex = 0;
        let endIndex = dates.length - 1;


        if (startDate) {

            const foundStart =
                dates.indexOf(startDate);

            if (foundStart !== -1) {
                startIndex = foundStart;
            }

        }


        if (endDate) {

            const foundEnd =
                dates.indexOf(endDate);

            if (foundEnd !== -1) {
                endIndex = foundEnd;
            }

        }


        /*
           If the selected trip starts beyond the
           available forecast, show the available
           forecast instead.
        */

        if (startIndex > endIndex) {

            startIndex = 0;
            endIndex = Math.min(
                dates.length - 1,
                6
            );

        }


        /* =================================================
           STEP 4 — BUILD WEATHER CARDS
        ================================================= */

        weatherDays.innerHTML = "";


        let rainyDays = 0;
        let totalDays = 0;


        for (
            let i = startIndex;
            i <= endIndex;
            i++
        ) {

            const date =
                daily.time[i];

            const code =
                daily.weather_code[i];

            const max =
                Math.round(
                    daily.temperature_2m_max[i]
                );

            const min =
                Math.round(
                    daily.temperature_2m_min[i]
                );

            const rain =
                daily.precipitation_probability_max[i] || 0;


            const weatherInfo =
                getWeatherInfo(code);


            if (rain >= 50) {
                rainyDays++;
            }

            totalDays++;


            const formattedDate =
                formatWeatherDate(date);


            const card =
                document.createElement("div");

            card.className =
                "weather-card";


            card.innerHTML = `

                <div class="weather-date">
                    ${formattedDate}
                </div>

                <div class="weather-card-icon">
                    ${weatherInfo.icon}
                </div>

                <div class="weather-condition">
                    ${weatherInfo.text}
                </div>

                <div class="weather-temp">

                    <span class="weather-max">
                        ${max}°
                    </span>

                    <span class="weather-min">
                        ${min}°
                    </span>

                </div>

                <div class="weather-rain">
                    ☔ ${rain}% rain
                </div>

            `;


            weatherDays.appendChild(card);

        }


        /* =================================================
           STEP 5 — MAIN WEATHER
        ================================================= */

        const firstIndex =
            startIndex;


        const firstCode =
            daily.weather_code[firstIndex];


        const firstMax =
            Math.round(
                daily.temperature_2m_max[firstIndex]
            );


        const firstInfo =
            getWeatherInfo(firstCode);


        if (mainTemp) {
            mainTemp.textContent =
                firstMax + "°";
        }


        if (mainCondition) {
            mainCondition.textContent =
                firstInfo.text;
        }


        if (mainIcon) {
            mainIcon.textContent =
                firstInfo.icon;
        }


        /* =================================================
           STEP 6 — TRAVEL RECOMMENDATION
        ================================================= */

        if (recommendation) {

            if (rainyDays === 0) {

                recommendation.textContent =
                    "The forecast looks mostly dry. " +
                    "It is a good time to explore outdoor attractions.";

            }

            else if (rainyDays <= Math.ceil(totalDays / 2)) {

                recommendation.textContent =
                    "Some rain is expected during your trip. " +
                    "Keep a light rain jacket or umbrella handy " +
                    "and use indoor activities as backups.";

            }

            else {

                recommendation.textContent =
                    "Several rainy days are expected. " +
                    "Consider prioritizing museums, cafés, " +
                    "shopping and other indoor experiences.";

            }

        }


    } catch (error) {

        console.error(
            "Weather error:",
            error
        );


        weatherDays.innerHTML = `
            <div class="weather-loading">
                Weather information could not be loaded.
            </div>
        `;


        if (weatherLocation) {

            weatherLocation.textContent =
                "Weather unavailable for this destination.";

        }

    }

}
/* =====================================================
   WEATHER CODE DESCRIPTION
===================================================== */

function getWeatherInfo(code) {

    if (code === 0) {

        return {
            icon: "☀️",
            text: "Clear sky"
        };

    }


    if (code === 1 || code === 2) {

        return {
            icon: "🌤️",
            text: "Partly cloudy"
        };

    }


    if (code === 3) {

        return {
            icon: "☁️",
            text: "Cloudy"
        };

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return {
            icon: "🌫️",
            text: "Foggy"
        };

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return {
            icon: "🌧️",
            text: "Rain"
        };

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            icon: "❄️",
            text: "Snow"
        };

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            icon: "🌦️",
            text: "Rain showers"
        };

    }


    if (
        code >= 95
    ) {

        return {
            icon: "⛈️",
            text: "Thunderstorm"
        };

    }


    return {
        icon: "🌤️",
        text: "Variable weather"
    };

}
/* =====================================================
   WEATHER DATE FORMAT
===================================================== */

function formatWeatherDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    );

}
/* =====================================================
   GENERATE TRIP
===================================================== */

function generateTrip() {

    const destinationElement =
        document.getElementById(
            "destination"
        );


    const budgetElement =
        document.getElementById(
            "budget"
        );


    const startElement =
        document.getElementById(
            "startDate"
        );


    const endElement =
        document.getElementById(
            "endDate"
        );


    if (
        !destinationElement ||
        !budgetElement
    ) {

        return;

    }


    const destination =
        destinationElement.value.trim();


    const budget =
        Number(
            budgetElement.value
        );


    const startDate =
        startElement
            ? startElement.value
            : "";


    const endDate =
        endElement
            ? endElement.value
            : "";


    /* VALIDATION */

    if (destination === "") {

        alert(
            "Please choose a destination."
        );

        return;

    }


    if (
        budget < 1000 ||
        isNaN(budget)
    ) {

        alert(
            "Please enter a valid budget."
        );

        return;

    }


    if (
        startDate !== "" &&
        endDate !== ""
    ) {

        const start =
            new Date(startDate);

        const end =
            new Date(endDate);


        if (end < start) {

            alert(
                "Return date cannot be before departure date."
            );

            return;

        }

    }


    const days =
        calculateDays(
            startDate,
            endDate
        );


    /* BUDGET */

   const hotel =
    budget * 0.35;

const transport =
    budget * 0.25;

const food =
    budget * 0.15;

const activities =
    budget * 0.15;

const emergency =
    budget * 0.10;

    /* CURRENT TRIP */

    currentTrip = {

        destination:
            destination,

        budget:
            budget,

        travellers:
            travellerCount,

        days:
            days,

        startDate:
            startDate,

        endDate:
            endDate,

        interests:
            selectedInterests.slice(),

        travelStyle:
            selectedTravelStyle

    };

loadWeather(
    destination,
    startDate,
    endDate
);
    /* RESULT */

    setText(
        "resultDestination",
        destination
    );


    setText(
        "resultDetails",
        days +
        " days - " +
        travellerCount +
        " travellers"
    );


    setText(
        "resultBudget",
        formatCurrency(budget)
    );


    setText(
        "resultHotel",
        formatCurrency(hotel)
    );


    setText(
        "resultTransport",
        formatCurrency(transport)
    );


    setText(
        "resultFood",
        formatCurrency(food)
    );


    setText(
        "resultActivities",
        formatCurrency(activities)
    );

setText(
    "resultEmergency",
    formatCurrency(emergency)
);
    setBar(
        "hotelBar",
        35
    );


    setBar(
        "transportBar",
        25
    );


    setBar(
        "foodBar",
        15
    );


    setBar(
        "activitiesBar",
        15
    );
setBar("emergencyBar", 10);
setText(
    "plannerTotal",
    formatCurrency(budget)
);

setText(
    "plannerHotel",
    formatCurrency(hotel)
);

setText(
    "plannerTransport",
    formatCurrency(transport)
);

setText(
    "plannerFood",
    formatCurrency(food)
);

setText(
    "plannerActivities",
    formatCurrency(activities)
);

setText(
    "plannerEmergency",
    formatCurrency(emergency)
);
    /* MAP */

    updateMap(destination);


    showPage("results");

}


/* =====================================================
   SAVE TRIP TO SUPABASE
===================================================== */

async function saveTrip() {

    if (!currentTrip) {
        alert("Please create a journey first.");
        return;
    }

    // Get currently signed-in user
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Please sign in before saving your journey.");
        openLogin();
        return;
    }

    // Create trip name
    const tripName =
        currentTrip.destination + " Journey";

    // Save trip to Supabase
    const { data, error } = await supabaseClient
        .from("trips")
        .insert([
            {
                user_id: user.id,

                trip_name: tripName,

                destination: currentTrip.destination,

                start_date:
                    currentTrip.startDate || null,

                end_date:
                    currentTrip.endDate || null,

                travelers:
                    currentTrip.travellers,

                budget:
                    currentTrip.budget,

                currency: "INR",

                status: "planned"
            }
        ])
        .select();

    if (error) {

        console.error("Save trip error:", error);

        alert(
            "Could not save journey:\n\n" +
            error.message
        );

        return;
    }

    console.log(
        "Trip saved successfully:",
        data
    );

    alert("Journey saved ✦");

    // Reload My Trips
    loadSavedTrips();
}
/* =====================================================
   LOAD SAVED TRIPS FROM SUPABASE
===================================================== */

async function loadSavedTrips() {

    const container =
        document.getElementById(
            "savedTripsContainer"
        );


    if (!container) {
        return;
    }


    /* GET USER */

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    if (!user) {

        container.innerHTML = `

            <div class="empty-trips">

                <div class="section-tag">
                    SIGN IN REQUIRED
                </div>

                <h2>
                    Your journeys are
                    <br>
                    <em>waiting for you.</em>
                </h2>

                <p>
                    Sign in to save and view
                    your journeys.
                </p>

                <button
                    class="create-trip-button"
                    onclick="openLogin()"
                >
                    <span>
                        Sign in
                    </span>

                    <strong>
                        →
                    </strong>

                </button>

            </div>

        `;

        return;

    }


    currentUser = user;


    /* GET TRIPS */

    const {
        data: trips,
        error
    } =
        await supabaseClient
            .from("trips")
            .select("*")
            .eq(
                "user_id",
                user.id
            )
            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Load trips error:",
            error
        );


        container.innerHTML = `

            <div class="empty-trips">

                <h2>
                    Something went wrong.
                </h2>

                <p>
                    We could not load your journeys.
                </p>

            </div>

        `;

        return;

    }


    /* EMPTY */

    if (
        !trips ||
        trips.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-trips">

                <div class="section-tag">
                    NOTHING HERE YET
                </div>

                <h2>
                    Your next adventure
                    <br>
                    <em>starts here.</em>
                </h2>

                <p>
                    Create your first journey
                    and we'll keep it here.
                </p>

                <button
                    class="create-trip-button"
                    onclick="showPage('planner')"
                >

                    <span>
                        Plan a journey
                    </span>

                    <strong>
                        ↗
                    </strong>

                </button>

            </div>

        `;

        return;

    }


    /* CLEAR */

    container.innerHTML = "";


    /* CREATE CARDS */

    trips.forEach(
        function(trip) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "saved-trip-card";


            const content =
                document.createElement(
                    "div"
                );


            const tag =
                document.createElement(
                    "div"
                );


            tag.className =
                "section-tag";


            tag.textContent =
                "SAVED JOURNEY";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                trip.destination;


            const info =
                document.createElement(
                    "p"
                );


            let dateText = "";


            if (
                trip.start_date &&
                trip.end_date
            ) {

                dateText =
                    trip.start_date +
                    " → " +
                    trip.end_date;

            }


            info.textContent =
                dateText;


            content.appendChild(tag);

            content.appendChild(title);

            content.appendChild(info);


           const actions =
    document.createElement("div");

actions.className =
    "saved-trip-actions";


const viewButton =
    document.createElement("button");

viewButton.textContent =
    "View journey →";


viewButton.addEventListener(
    "click",
    function() {

        openSavedTrip(trip.id);

    }
);


const deleteButton =
    document.createElement("button");

deleteButton.textContent =
    "Delete";


deleteButton.className =
    "delete-trip-button";


deleteButton.addEventListener(
    "click",
    function() {

        deleteTrip(trip.id);

    }
);


actions.appendChild(viewButton);
actions.appendChild(deleteButton);


            button.addEventListener(
                "click",
                function() {

                    openSavedTrip(
                        trip
                    );

                }
            );

card.appendChild(content);
card.appendChild(actions);

container.appendChild(card);
        }
    );

}

/* =====================================================
   DELETE SAVED TRIP
===================================================== */

function deleteTrip(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this journey?"
        );


    if (!confirmed) {
        return;
    }


    let trips = [];

    try {

        trips =
            JSON.parse(
                localStorage.getItem(
                    "wanderlystTrips"
                )
            ) || [];

    } catch (error) {

        trips = [];

    }


    trips =
        trips.filter(function(trip) {

            return trip.id !== id;

        });


    localStorage.setItem(
        "wanderlystTrips",
        JSON.stringify(trips)
    );


    loadSavedTrips();


    alert("Journey deleted.");
}
/* =====================================================
   OPEN SAVED TRIP
===================================================== */

function openSavedTrip(trip) {

    if (!trip) {
        return;
    }


    currentTrip = {

        id:
            trip.id,

        destination:
            trip.destination,

        startDate:
            trip.start_date || "",

        endDate:
            trip.end_date || "",

        travellers:
            2,

        days:
            calculateDays(
                trip.start_date,
                trip.end_date
            ),

        budget:
            0,

        interests:
            [],

        travelStyle:
            "Budget"

    };


    const destination =
        document.getElementById(
            "destination"
        );


    if (destination) {

        destination.value =
            trip.destination;

    }


    const startDate =
        document.getElementById(
            "startDate"
        );


    if (startDate) {

        startDate.value =
            trip.start_date || "";

    }


    const endDate =
        document.getElementById(
            "endDate"
        );


    if (endDate) {

        endDate.value =
            trip.end_date || "";

    }


currentTrip = trip;

updateResultsFromTrip(trip);

loadWeather(
    trip.destination,
    trip.startDate,
    trip.endDate
);

showPage("results");
}

/* =====================================================
   UPDATE RESULTS
===================================================== */

function updateResultsFromTrip(trip) {

    setText(
        "resultDestination",
        trip.destination
    );


    setText(
        "resultDetails",

        trip.days +
        " days - " +
        trip.travellers +
        " travellers"

    );


    if (trip.budget) {

        const budget =
            Number(trip.budget);


        setText(
            "resultBudget",
            formatCurrency(budget)
        );


        setText(
            "resultHotel",
            formatCurrency(
                budget * 0.35
            )
        );


        setText(
            "resultTransport",
            formatCurrency(
                budget * 0.25
            )
        );


        setText(
            "resultFood",
            formatCurrency(
                budget * 0.15
            )
        );


        setText(
            "resultActivities",
            formatCurrency(
                budget * 0.15
            )
        );

    }

}


/* =====================================================
   LOGIN MODAL
===================================================== */

function openLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   SIGN IN
===================================================== */

async function signIn() {

    const email =
        document.getElementById(
            "loginEmail"
        );


    const password =
        document.getElementById(
            "loginPassword"
        );


    const message =
        document.getElementById(
            "loginMessage"
        );


    if (
        !email ||
        !password
    ) {

        return;

    }


    const emailValue =
        email.value.trim();


    const passwordValue =
        password.value;


    if (
        !emailValue ||
        !passwordValue
    ) {

        if (message) {

            message.textContent =
                "Please enter your email and password.";

        }

        return;

    }


    if (message) {

        message.textContent =
            "Signing in...";

    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({

            email:
                emailValue,

            password:
                passwordValue

        });


    if (error) {

        console.error(
            "Sign in error:",
            error
        );


        if (message) {

            message.textContent =
                error.message;

        }

        return;

    }


    currentUser =
        data.user;


    if (message) {

        message.textContent =
            "Signed in successfully!";

    }


    await updateUserWelcome();


    setTimeout(
        function() {

            closeLogin();

        },
        700
    );

}


/* =====================================================
   SIGN UP
===================================================== */

async function signUp() {

    const email =
        document.getElementById(
            "loginEmail"
        );


    const password =
        document.getElementById(
            "loginPassword"
        );


    const message =
        document.getElementById(
            "loginMessage"
        );


    if (
        !email ||
        !password
    ) {

        return;

    }


    const emailValue =
        email.value.trim();


    const passwordValue =
        password.value;


    if (
        emailValue === "" ||
        passwordValue === ""
    ) {

        if (message) {

            message.textContent =
                "Enter an email and password first.";

        }

        return;

    }


    if (message) {

        message.textContent =
            "Creating account...";

    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.signUp({

            email:
                emailValue,

            password:
                passwordValue

        });


    if (error) {

        console.error(
            "Sign up error:",
            error
        );


        if (message) {

            message.textContent =
                error.message;

        }

        return;

    }


    console.log(
        "Account created:",
        data
    );


    if (message) {

        message.textContent =
            "Account created! Check your email.";

    }

}


/* =====================================================
   USER PROFILE / WELCOME
===================================================== */

async function updateUserWelcome() {

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    if (!user) {
        return;
    }


    currentUser = user;


    const {
        data: profile,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "full_name, email"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

    }


    let userName =
        "Traveller";


    if (
        profile &&
        profile.full_name
    ) {

        userName =
            profile.full_name;

    } else if (
        user.email
    ) {

        userName =
            user.email.split("@")[0];

    }


    /* FIND WELCOME ELEMENT */

    const welcomeElements =
        document.querySelectorAll(
            ".welcome-user"
        );


    welcomeElements.forEach(
        function(element) {

            element.textContent =
                "Welcome, " +
                userName;

        }
    );


    /* NAV LOGIN BUTTON */

    const loginButton =
        document.querySelector(
            ".nav-login"
        );


    if (loginButton) {

        loginButton.textContent =
            "Welcome, " +
            userName;

    }

}


/* =====================================================
   SIGN OUT
===================================================== */

async function signOut() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Sign out error:",
            error
        );

        return;

    }


    currentUser = null;


    alert(
        "Signed out successfully."
    );


    location.reload();

}


/* =====================================================
   MAP
===================================================== */

function updateMap(destination) {

    if (!destination) {
        return;
    }


    const mapCity =
        document.querySelector(
            ".map-city"
        );


    if (mapCity) {

        mapCity.textContent =
            destination;

    }


    const mapLink =
        document.getElementById(
            "mapLink"
        );


    if (mapLink) {

        mapLink.href =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
                destination
            );

    }

}


/* =====================================================
   OPEN MAP
===================================================== */

function openMap() {

    const destination =
        currentTrip
            ? currentTrip.destination
            : "";


    if (!destination) {

        alert(
            "Create a trip first."
        );

        return;

    }


    const query =
        encodeURIComponent(
            destination
        );


    window.open(

        "https://www.google.com/maps/search/?api=1&query=" +
        query,

        "_blank"

    );

}


/* =====================================================
   HOTEL
===================================================== */

function openHotel() {

    alert(
        "Hotel booking will be connected next."
    );

}


/* =====================================================
   CLOSE MODAL OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "loginModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeLogin();

        }

    }
);


/* =====================================================
   CHECK LOGIN ON PAGE LOAD
===================================================== */

async function checkLoggedInUser() {

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    if (user) {

        currentUser = user;

        await updateUserWelcome();

    }

}


/* =====================================================
   AUTH STATE LISTENER
===================================================== */

supabaseClient.auth.onAuthStateChange(
    async function(event, session) {

        console.log(
            "Auth event:",
            event
        );


        if (session) {

            currentUser =
                session.user;

            await updateUserWelcome();

        } else {

            currentUser = null;

        }

    }
);


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        showPage("home");

        await checkLoggedInUser();

        await loadSavedTrips();


        const counter =
            document.getElementById(
                "travellerCount"
            );


        if (counter) {

            counter.textContent =
                travellerCount;

        }

    }
);