fetchWeatherData("London");

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
    })
    .catch(error =>{
        console.log("Error: " +error);
    })

}





