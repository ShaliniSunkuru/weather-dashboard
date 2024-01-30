var currentCity = "";
var todaySection = $("#today");
var forecastSection = $("#forecast");
var inputGroupDiv = $('.input-group')
var searchHistoryGrid = $("#search-history");
var weatherDetailDiv = $('#weather-detail');
var cityArray = []

pageLoad();

function pageLoad() {
    if (localStorage.getItem("cities") !== null) {
        cityArray = JSON.parse(localStorage.getItem("cities"));
        updateSearchGrid();
        currentCity = cityArray[(cityArray.length) - 1];
        fetchWeatherData(currentCity);
    } else {
        weatherDetailDiv.removeClass('visible');
        weatherDetailDiv.addClass('invisible');
    }
}

function fetchWeatherData(city) {

    //set city 
    currentCity = city;
    // query url for open weather geocoding api
    weatherDetailDiv.removeClass('invisible');
    weatherDetailDiv.addClass('visible');
    var apiKey = "12cf5cf50a250d57c0c862681cdce34e"
    var queryUrlGeo = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    fetch(queryUrlGeo)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                pageLoad();
                throw new Error('Location not found!')

            } else {
                var lattitude = data[0].lat;
                var longitude = data[0].lon;

                //query url for current weather
                var queryUrlToday = "https://api.openweathermap.org/data/2.5/weather?lat=" + lattitude + "&lon=" + longitude + "&units=metric&appid=" + apiKey;
                fetch(queryUrlToday)
                    .then(response => response.json())
                    .then(data => {
                        displayCurrentData(data);
                    })
                    .catch(error => {
                        console.log("Error: " + error);
                    })

                //query url for 5 day forecast
                var queryUrl5Day = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lattitude + "&lon=" + longitude + "&units=metric&appid=12cf5cf50a250d57c0c862681cdce34e";
                fetch(queryUrl5Day)
                    .then(response => response.json())
                    .then(data => {
                        displayForecast(data.list);
                    })
                    .catch(error => {
                        console.log("Error: " + error);
                    })

                //add input city to the top of search grid and local storage
                if (cityArray.includes(currentCity)) {
                    cityArray = cityArray.filter(item => item != currentCity)
                }
                cityArray.push(currentCity);
                updateSearchGrid();
                updateLocalStorage();
            }
        })
        .catch(error => {
            alert("Error: Location not found!");
        })

}

function displayCurrentData(currentWeatherData) {
    //city and today's date
    var today = dayjs().format("DD/MM/YYYY");
    var todayH2 = $('<h2>');
    todayH2.text(currentCity + " ( " + today + " )");
    todaySection.append(todayH2);

    // weather icon
    var icon = currentWeatherData.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
    var newImg = $('<img>');
    newImg.attr('src', iconUrl);
    todayH2.append(newImg);

    //Temperature, Wind speed, humidity
    var currentWeather = [
        {
            name: "Temp",
            value: Math.round(currentWeatherData.main.temp),
            unit: "°C"
        },
        {
            name: "Wind",
            //multiply by 2.24 to convert meter/sec to miles/hr
            value: Math.round((currentWeatherData.wind.speed) * 2.24),
            unit: " MPH"
        },
        {
            name: "Humidity",
            value: currentWeatherData.main.humidity,
            unit: "%"
        }
    ]
    //assign text to p element on section
    currentWeather.forEach((weatherObject) => {
        var newP = $('<p>');
        newP.text(weatherObject.name + ": " + weatherObject.value + weatherObject.unit);
        todaySection.append(newP);
    })


}

function displayForecast(forecastArray) {
    var forecastWeather = [];

    for (j = 1; j < 6; j++) {
        var tempArr = [];
        var windArr = [];
        var humidityArr = [];
        for (var i = 0; i < forecastArray.length; i++) {
            var thisDate = dayjs(forecastArray[i].dt_txt).format('DD/MM/YYYY');
            var thisIcon = forecastArray[j].weather[0].icon;

            if (thisDate === dayjs().add(j, 'day').format('DD/MM/YYYY')) {

                var dailyWeather = {};
                dailyWeather.date = thisDate;
                dailyWeather.icon = thisIcon;
                dailyWeather.Temp = tempArr;
                dailyWeather.Wind = windArr;
                dailyWeather.Humidity = humidityArr;
                tempArr.push(forecastArray[i].main.temp);
                windArr.push((forecastArray[i].wind.speed) * 2.24);
                humidityArr.push(forecastArray[i].main.humidity);
            }

        }
        forecastWeather.push(dailyWeather);

    }

    for (var i = 0; i < forecastWeather.length; i++) {
        var average = arr => arr.reduce((prev, curr) => prev + curr) / arr.length;
        var newCardEl = $('<div>');
        newCardEl.addClass('card col-sm-6 col-md-4 col-lg-2 mx-3 forecast-card');
        var dateDiv = $('<div>');
        dateDiv.addClass('card-header');
        dateDiv.text(forecastWeather[i].date);
        var iconImg = $('<img>');
        var iconUrl = "https://openweathermap.org/img/wn/" + forecastWeather[i].icon + ".png";
        iconImg.attr('src', iconUrl);
        dateDiv.append(iconImg);
        var tempP = $('<p>');
        tempP.text("Temp: " + Math.round(Math.max(...forecastWeather[i].Temp)) + "°C ");
        var tempSpan = $('<span>')
        tempSpan.text(Math.round(Math.min(...forecastWeather[i].Temp)) + "°C");
        tempSpan.addClass('min-temp');
        tempP.append(tempSpan);
        var windP = $('<p>');
        windP.text("Wind: " + Math.round(average(forecastWeather[i].Wind)) + " MPH");
        var humidityP = $('<p>');
        humidityP.text("Humidity: " + Math.round(average(forecastWeather[i].Humidity)) + "%");
        newCardEl.append(dateDiv, tempP, windP, humidityP);
        forecastSection.append(newCardEl);
    }
}

inputGroupDiv.on("click", ".search-btn", function (event) {
    event.preventDefault();

    //clear weather data from main page
    todaySection.empty();
    forecastSection.empty();

    //user input
    var searchInput = $('#search-input');
    if (searchInput.val()) {
        currentCity = searchInput.val().trim();

        fetchWeatherData(currentCity);
        searchInput.val('');

    }

})

function updateSearchGrid() {
    searchHistoryGrid.empty();
    for (var i = 0; i < cityArray.length; i++) {
        createCityButton(cityArray[i]);
    }
}
function updateLocalStorage() {
    localStorage.removeItem("cities");
    localStorage.setItem("cities", JSON.stringify(cityArray));
}

function createCityButton(city) {
    //add buttons for city 
    var cityButton = $('<button>');
    cityButton.addClass('btn btn-secondary');
    cityButton.attr('type', 'button');
    cityButton.text(city);
    searchHistoryGrid.prepend(cityButton);
}

$('#buttons').on("click", function (event) {
    var btnText = $(event.target).text();
    if (btnText === "Clear History") {
        localStorage.removeItem("cities");
        cityArray = [];
        searchHistoryGrid.empty();
    } else {
        //clear weather data from main page
        todaySection.empty();
        forecastSection.empty();
        //Display weather data of city clicked
        currentCity = btnText;
        fetchWeatherData(currentCity);
        //update search grid to show clicked city on top
        cityArray = cityArray.filter(item => item != currentCity)
        cityArray.push(currentCity);
        updateLocalStorage();
        updateSearchGrid();
    }

})
