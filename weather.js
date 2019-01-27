let api_keys  = require('./api_keys.json');
let request = require('request');

let open_weather_api_key = api_keys.open_weather;
let dark_sky_api_key = api_keys.dark_sky;

function getCurrentWeather(lat, lon, callback) {
    let open_weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${open_weather_api_key}`;

    request(open_weather_url, function (err, response, body) {
        if(err){
            console.log('error:', error);
            callback(error);
        } else {
            let weather = JSON.parse(body);
            let weather_in_city = weather.name;
            let weather_in_celcius = ((weather.main.temp) -273.15).toFixed(2);
            callback(null, weather_in_celcius);
        }
    });
}

function getWeatherOf(lat, lon, timeInUnix, callback) {
    let dark_sky_url = `https://api.darksky.net/forecast/${dark_sky_api_key}/${lat},${lon},${timeInUnix}?exclude=currently,flags`;

    request(dark_sky_url, function (err, response, body) {
        if(err){
            console.log('error:', error);
            callback(error);
        } else {
            let weather = JSON.parse(body);
            let tempHigh = ((weather.daily.data[0].temperatureHigh - 32) /1.8).toFixed(2);
            let tempLow = ((weather.daily.data[0].temperatureLow - 32) / 1.8).toFixed(2);
            let weather_in_city = weather.timezone;
            let weather_description = weather.daily.data[0].summary;
            let weatherMsg = `It's low of ${tempLow} and high of ${tempHigh} degrees celcius and ${weather_description} in ${weather_in_city} timezone!`;
            callback(null, weatherMsg);
        }
    });
}

getWeatherOf(49.255752, -123, 255657600, function(error, weatherMsg) {
    console.log(weatherMsg)
});