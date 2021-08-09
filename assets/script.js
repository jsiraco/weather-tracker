//API Key: 003e0821a54b9cbdfca00f36469eb0a5

const searchEl = $("#location");
const recentSearch = $(".recent-searches");
const searchList = $(".search-list");
const todayResults = $(".todays-results");
const forecastResl = $(".forecast");
const APIKey = "c1141616fb1714998cc67977ee400134";
const searchBtn = $("#search-button");

let recentCities = [];

// recentCities.push("Ogunquit");
// console.log(recentCities);

const testWeather = [
    { "coord": { "lon": 139.6917, "lat": 35.6895 }, "weather": [{ "id": 802, "main": "Clouds", "description": "scattered clouds", "icon": "03d" }], "base": "stations", "main": { "temp": 87.26, "feels_like": 97.25, "temp_min": 83.75, "temp_max": 90.79, "pressure": 1007, "humidity": 68 }, "visibility": 10000, "wind": { "speed": 1.99, "deg": 131, "gust": 5.01 }, "clouds": { "all": 40 }, "dt": 1627862701, "sys": { "type": 2, "id": 2001249, "country": "JP", "sunrise": 1627847380, "sunset": 1627897515 }, "timezone": 32400, "id": 1850144, "name": "Tokyo", "cod": 200 }
]

function init() {
    let storedCities = JSON.parse(localStorage.getItem("recents"));

    if (storedCities !== null) {
        recentCities = storedCities;
    }
    buildList(recentCities);
}

function clearText() {
    searchEl.val("");
}

function buildToday(response) {
    let cityH = $("<h2>").addClass("subtitle").text(JSON.stringify(response.name));
    let today = "Temp: " + JSON.stringify(response.main.temp) + ", Feels Like: " + JSON.stringify(response.main.feels_like) + ", Humidity: " + JSON.stringify(response.main.humidity) + ", Conditions: " + JSON.stringify(response.weather[0].main);
    let tempContent = $("<p>").text(today);
    let todayDiv = $("<div>").addClass("content").append(cityH, tempContent);
    todayResults.html(todayDiv);
}

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


function buildLastSearch(response) {
    let prevSearchBtn = $("<button>").addClass("button is-link is-outlined is-fullwidth").html(response);
    recentSearch.append(prevSearchBtn);

    $(prevSearchBtn).on("click", function () {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${response}&units=imperial&appid=${APIKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                buildToday(response);
            })
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

//builds list
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


init();