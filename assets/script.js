//API Key: 003e0821a54b9cbdfca00f36469eb0a5

const searchEl = $("#location");
const recentSearch = $(".recent-searches");
const searchList = $(".search-list");
const todayResults = $(".todays-results");
const forecastResl = $(".forecast");
const APIKey = "c1141616fb1714998cc67977ee400134";
const searchBtn = $("#search-button");

let forecastResults = [];
let recentCities = [];

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

function buildToday(response) {
    let today = JSON.stringify(response.main);
    let tempContent = $("<p>").html(today);
    let todayDiv = $("<div>").addClass("content").append(tempContent);
    todayResults.append(todayDiv);
}

function buildWeekly(response) {
    for (let i = 0; i < 5; i++) {
        let forecast = JSON.stringify(response.list[i].main);
        let forecastContent = $("<p>").html(forecast);
        let forecastDiv = $("<div>").addClass("content").append(forecastContent);
        forecastResl.append(forecastDiv);

    }
}

function storeCity(e) {
    localStorage.setItem("recents", JSON.stringify(e));
    // recentCities.push(JSON.stringify(e));
}

//builds list
function buildList(e) {
    let prevSearchBtn = $("<button>").addClass("button is-link is-outlined is-fullwidth").html(e);
    recentSearch.append(prevSearchBtn);
    $(prevSearchBtn).on("click", function () {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e}&units=imperial&appid=${APIKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                console.log(response);
                buildToday(response);
            })
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${e}&units=imperial&appid=${APIKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                buildWeekly(response);
                console.log(response);
            })
    })

}

///Builds forecast
$(searchBtn).on("click", function () {
    let city = searchEl.val();
    console.log(recentCities);

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            buildWeekly(response);
            console.log(response);
        })
})


//Builds daily
$(searchBtn).on("click", function () {
    let city = searchEl.val();
    console.log(city);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            buildToday(response);
            storeCity(city);
            buildList(city);
            return;
        })
    // .catch(function () {
    //     console.log("Error");
    // })
})


init();