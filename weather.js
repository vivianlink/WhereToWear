let api_keys  = require('./api_keys.json');
let request = require('request');

let api_key = api_keys.open_weather;
let city = 'vancouver,ca';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

request(url, function (err, response, body) {
    if(err){
        console.log('error:', error);
    } else {

        let weather = JSON.parse(body);

        let weather_in_celcius = ((weather.main.temp) -273.15).toFixed(2);
        let weather_in_city = weather.name;
        let weather_description = weather.weather[0].description;

        let weatherMsg = `It's ${weather_in_celcius} degrees celcius and ${weather_description} in ${weather_in_city}!`;

        console.log(weatherMsg);
    }
});