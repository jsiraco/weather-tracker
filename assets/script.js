//API Key: 003e0821a54b9cbdfca00f36469eb0a5
//Globals
const searchEl = $("#location");
const recentSearch = $(".recent-searches");
const searchList = $(".search-list");
const todayResults = $(".todays-results");
const forecastResl = $(".forecast");
const APIKey = "c1141616fb1714998cc67977ee400134";
const searchBtn = $("#search-button");

let recentCities = [];

//gets items from local storage
function init() {
    let storedCities = JSON.parse(localStorage.getItem("recents"));

    if (storedCities !== null) {
        recentCities = storedCities;
    }
    buildList(recentCities);
}
//Clears text fields
function clearText() {
    searchEl.val("");
}
//Builds the daily forecast
function buildToday(response) {
    let cityH = $("<h2>").addClass("subtitle").text(JSON.stringify(response.name));
    let today = "Temp: " + JSON.stringify(response.main.temp) + ", Feels Like: " + JSON.stringify(response.main.feels_like) + ", Humidity: " + JSON.stringify(response.main.humidity) + ", Conditions: " + JSON.stringify(response.weather[0].main);
    let tempContent = $("<p>").text(today);
    let todayDiv = $("<div>").addClass("content").append(cityH, tempContent);
    todayResults.html(todayDiv);
}

//Builds a weekly forecast
function buildWeekly(response) {
    forecastResl.html("")
    //every 8 hours
    //40 total hours 
    //Open weather charges to do a daily forecast, so an hourly forecast was used then incremented by 8 hours to avoid get data from each day and avoid the pay wall
    for (let i = 0; i <= 40; i += 8) {
        let forecast = JSON.stringify(response.list[i].dt_txt) + " " + JSON.stringify(response.list[i].main.temp) + ", Conditions: " + JSON.stringify(response.list[i].weather[0].main);
        let forecastContent = $("<p>").html(forecast);
        let forecastDiv = $("<div>").addClass("content").append(forecastContent);
        forecastResl.append(forecastDiv);

    }
}

//Builds last search and appends buttons
function buildLastSearch(response) {
    let prevSearchBtn = $("<button>").addClass("button is-link is-outlined is-fullwidth").html(response);
    recentSearch.append(prevSearchBtn);
    //Adds event listener
    $(prevSearchBtn).on("click", function () {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${response}&units=imperial&appid=${APIKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                buildToday(response);
            })
            //This .catch prevents an error realted to the OpenWeather API paywall limitations
            .catch(function() {
                console.log("");
            })
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${response}&units=imperial&appid=${APIKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                buildWeekly(response);
            })
            .catch(function() {
                console.log("");
            })
    })
}

//builds list of locations
function buildList() {
    for (let i = 0; i < recentCities.length; i++) {
        let prevSearchBtn = $("<button>").addClass("button is-link is-outlined is-fullwidth").html(recentCities[i]);
        recentSearch.append(prevSearchBtn);

        $(prevSearchBtn).on("click", function () {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${recentCities[i]}&units=imperial&appid=${APIKey}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    buildToday(response);
                })
                .catch(function() {
                    console.log("");
                })
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${recentCities[i]}&units=imperial&appid=${APIKey}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    buildWeekly(response);
                })
                .catch(function() {
                    console.log("");
                })
        })
    }
}

///Builds forecast
$(searchBtn).on("click", function () {
    if (searchEl.val() === "") {
        alert("enter a city");
        window.location.reload();
        return;
    }
    let city = searchEl.val();

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            recentCities.push(city);
            console.log(recentCities);
            localStorage.setItem("recents", JSON.stringify(recentCities));
            buildWeekly(response);
            clearText();
        })
        .catch(function() {
            console.log("");
        })
})


//Builds daily
$(searchBtn).on("click", function () {
    if (searchEl === "") {
        return;
    }
    let city = searchEl.val();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            buildToday(response);
            buildLastSearch(response.name);
            clearText();
        })
        .catch(function() {
            console.log("");
        })
})

//Initialized getItems
init();