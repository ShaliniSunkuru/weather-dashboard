var city = "London";
var todaySection = $("#today");

fetchWeatherData(city);

function fetchWeatherData(city){
    // query url for open weather geocoding api
    var apiKey = "12cf5cf50a250d57c0c862681cdce34e"
    var queryUrlGeo = "http://api.openweathermap.org/geo/1.0/direct?q=London&appid=" + apiKey;

    fetch(queryUrlGeo)
    .then(response => response.json())
    .then(data => {
        var lattitude = data[0].lat;
        var longitude = data[0].lon;
        
        //query url for current weather
        var queryUrlToday = "https://api.openweathermap.org/data/2.5/weather?lat=" +lattitude + "&lon=" + longitude + "&appid=" + apiKey;
        fetch(queryUrlToday)
        .then(response => response.json())
        .then(data => {
            displayCurrentData(data);
        })
        .catch(error =>{
            console.log("Error: " +error);
        })

        //query url for 5 day forecast
        var queryUrl5Day = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lattitude + "&lon=" + longitude + "&appid=12cf5cf50a250d57c0c862681cdce34e";
        fetch(queryUrl5Day)
        .then(response => response.json())
        .then(data => {
            displayForecast(data.list);
        })
        .catch(error =>{
            console.log("Error: " +error);
        })
    })
    .catch(error =>{
        console.log("Error: " +error);
    })    

}

function displayCurrentData(currentWeatherData){
    //city and today's date
    var today = dayjs().format("DD/MM/YYYY");
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

// function displayForecast(forecastArray){
//     console.log(forecastArray);
//     var forecastWeather = [];
//     for(var i = 0; i < forecastArray.length; i++){
//         var thisDate = dayjs(forecastArray[i].dt_txt).get('date');
//         if(thisDate !== dayjs().get('date')){
//             console.log("Not-Today" + thisDate )
//         }else{
//             console.log("Today");
//         }
//     }
// }
function displayForecast(forecastArray){
    console.log(forecastArray);
    var forecastWeather = [];
    // var tempArr = [];
    // var windArr = [];
    // var humidityArr = [];
    
    for(j = 0; j < 6; j++){
        tempArr =[];
        windArr =[];
        humidityArr = []; 
        for(var i = 0; i < forecastArray.length; i++){
            var thisDate = dayjs(forecastArray[i].dt_txt).format('DD/MM/YYYY');
            // debugger;      
            if(thisDate === dayjs().add(j,'day').format('DD/MM/YYYY')){
                console.log(thisDate); 
                // debugger;
                var dailyWeather ={};
                dailyWeather.date = thisDate;
                tempArr.push(forecastArray[i].main.temp);
                windArr.push(forecastArray[i].wind.speed);
                humidityArr.push(forecastArray[i].main.humidity);    
                dailyWeather.Temp = tempArr;
                dailyWeather.Wind = windArr;
                dailyWeather.Humidity = humidityArr;
            }
        }
        forecastWeather.push(dailyWeather);
           
    }

    
    console.log(forecastWeather);

}

