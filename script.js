var APIKey = "585fabd2eaf4ceecc5f856d80625607b";
var queryURL = ""
var city = ""
var cityArray = []

// import the array of searched cities
var citiesInLocalStorage = localStorage.getItem("cities")
// if there is an array it will automatically return as true, and we will make the city array equal to the array in local storage, take whats in local storage and parse into an array
if (citiesInLocalStorage) {
    cityArray = JSON.parse(citiesInLocalStorage)
}
// display cities recently searched from local storage
displayCityName = 1
for (var i = 0; i < 8; i++) {
    $("#city" + displayCityName).text(cityArray[i])
    displayCityName++
}

// search for a city
$("#searchBtn").on("click", function () {
    city = $(".searchInput")
        .val()
        .trim();

    cityArray.push(city)

    localStorage.setItem("cities", JSON.stringify(cityArray))

    queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {
            console.log(response);
            displayCurrentWeather(response)
        });
})

// display last city searched on page load
var lastCitySearch = cityArray[cityArray.length - 1]
$.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${lastCitySearch}&appid=${APIKey}`,
        method: "GET"
    })
    .then(function (response) {
        console.log(response);
        displayCurrentWeather(response)
    });

// pull weather stats and show on the site
function displayCurrentWeather(response) {
    // $("#cityNameAndDate").empty()
    console.log(city);
    $("#cityNameAndDate").text(`${response.city.name} ${moment().format("MMM Do, YYYY, HH:mm")}`);

    // identify the weather icon code, put it in the url to source the image icon and display on page
    var imgIcon = response.list[0].weather[0].icon
    var imgUrl = `http://openweathermap.org/img/wn/${imgIcon}@2x.png`
    var weatherImage = $("<img>")
    weatherImage.attr("src", imgUrl)
    weatherImage.attr("alt", "weather icon")
    $("#image").empty()
    $("#image").append(weatherImage)

    // Current stats and temperature calculation
    var tempF = Math.floor((response.list[0].main.temp - 273.15) * 1.80 + 32);
    $("#temperature").text("Temperature: " + tempF + " F");
    $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
    $("#windSpeed").text("Wind Speed: " + response.list[0].wind.speed + " kmp");
    $("#description").text("Description: " + response.list[0].weather[0].description);

    // Forecasted stats and temperature calculation
    var card = 0
    var day = 1
    for (var i = 1; i < 6; i++) {
        var forecastDate = (moment().add(day, 'days').calendar()).split(" ")
        $("#" + card).text(forecastDate[0]);
        var tempF = Math.floor((response.list[i].main.temp - 273.15) * 1.80 + 32);
        $("#temperature" + card).text("Temperature: " + tempF + " F");
        $("#humidity" + card).text("Humidity: " + response.list[i].main.humidity + "%");

        // identify the weather icon code, put it in the url to source the image icon and display on page
        var imgIcon = response.list[i].weather[0].icon
        var imgUrl = `http://openweathermap.org/img/wn/${imgIcon}@2x.png`
        var weatherImage = $("<img>")
        weatherImage.attr("src", imgUrl)
        weatherImage.attr("alt", "weather icon")
        $("#image" + card).empty()
        $("#image" + card).append(weatherImage)

        card++
        day++
    }
}