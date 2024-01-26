var city = "London";
var todaySection = $("#today");

fetchWeatherData(city);

function fetchWeatherData(city){
    // query url for open weather geocoding api
    var queryUrlGeo = "http://api.openweathermap.org/geo/1.0/direct?q=London&appid=12cf5cf50a250d57c0c862681cdce34e";

    fetch(queryUrlGeo)
    .then(response => response.json())
    .then(data => {
        var lattitude = data[0].lat;
        var longitude = data[0].lon;
        //query url for 5 day forecast
        var queryUrl5Day = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lattitude + "&lon=" + longitude + "&appid=12cf5cf50a250d57c0c862681cdce34e";
        return fetch(queryUrl5Day);
    })
    .catch(error =>{
        console.log("Error: " +error);
    })
    .then( response => response.json())
    .then(data => {
        console.log(data);
        displayCurrentData(data.list[0]);
        displayForecast(data.list);
    })
    .catch(error =>{
        console.log("Error: " +error);
    })

}

function displayCurrentData(currentWeatherData){
    //city and today's date
    var date = currentWeatherData.dt_txt;
    var today = dayjs(date).format("DD/MM/YYYY");
    var todayH2 = $('<h2>');
    todayH2.text(city + " ( " + today + " )");
    todaySection.append(todayH2);
    
    //Temperature, Wind speed, humidity
    var currentWeather = [
        {
            name: "Temp",
            value: currentWeatherData.main.temp,
            unit: "°C"
        },
        {
            name: "Wind",
            value: currentWeatherData.wind.speed,
            unit: "KPH"
        },
        {
            name: "Humidity",
            value: currentWeatherData.main.humidity,
            unit: "%"
        }
    ]

    currentWeather.forEach((weatherObject) => {
        var newP = $('<p>');
        newP.text(weatherObject.name + ": " + weatherObject.value + " " + weatherObject.unit);
        todaySection.append(newP);
    })

}

function displayForecast(forecastArray){
    console.log(forecastArray);
}