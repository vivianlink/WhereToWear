module.exports = {
    getCurrentWeather: getCurrentWeather,
    getWeatherOf: getWeatherOf,
};

function getApiKeys() {
    return require('./api_keys.json');
}

function getCurrentWeather(lat, lon, callback) {
    let open_weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${getApiKeys().open_weather}`;

    require('request')(open_weather_url, function (err, response, body) {
        if(err){
            console.log('error:', error);
            callback(error);
        } else {
            let weather = JSON.parse(body);
            console.log(weather);
            let weather_in_city = weather.name;
            let weather_description = weather.weather[0].description;
            let weather_in_celcius = ((weather.main.temp) -273.15).toFixed(0);
            callback(null, {
                avg: weather_in_celcius,
                description: weather_description,
            });
        }
    });
}

function getWeatherOf(lat, lon, timeInUnix, callback) {
    let dark_sky_url = `https://api.darksky.net/forecast/${getApiKeys().dark_sky}/${lat},${lon},${timeInUnix}?exclude=currently,flags`;

    require('request')(dark_sky_url, function (err, response, body) {
        if(err){
            console.log('error:', error);
            callback(error);
        } else {
            let weather = JSON.parse(body);
            let tempHigh = ((weather.daily.data[0].temperatureHigh - 32) /1.8);
            let tempLow = ((weather.daily.data[0].temperatureLow - 32) / 1.8);
            let weather_in_city = weather.timezone;
            let weather_description = weather.daily.data[0].summary;
            let weatherMsg = `It's low of ${tempLow} and high of ${tempHigh} degrees celcius and ${weather_description} in ${weather_in_city} timezone!`;
            callback(null, {
                avg: ((tempHigh + tempLow)/2).toFixed(0),
                description: weather_description
            });
        }
    });
}