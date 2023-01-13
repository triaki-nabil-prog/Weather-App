import { pubsub } from './pubsub.js';
//retrieve searched area weather data from the API  openWeather
let weatherApi = (function () {
    pubsub.subscribe("inputLocation", getLocationData);
    async function getLocationData(location) {
        // error handling in case area not found
        async function asyncWrap(promise) {
            try {
                const data = await promise;
                if (!data.ok) {
                    throw Error("location not found");
                }
                return [data, undefined];
            } catch (err) {
                return [undefined, err];
            }
        }
        const [response, err] = await asyncWrap(fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=a2ed8be0701763602c0aa430d5ea7c2a`));
        if (err) {
            pubsub.publish("error", err);
            return;
        }
        let WeatherData = await response.json();
        let description = WeatherData.weather[0].description;
        let main = WeatherData.weather[0].main;
        let icon = WeatherData.weather[0].icon;
        let temp = WeatherData.main.temp;
        let feelsLike = WeatherData.main.feels_like;
        let LocationData = new newLocation(WeatherData.name, icon, description, main, temp, feelsLike);
        pubsub.publish("weatherData", LocationData);
    }
    const newLocation = function (name, icon, description, main, temp, feelsLike) {
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.main = main;
        this.temp = temp;
        return { name, icon, description, main, temp, feelsLike };
    }
    getLocationData("tokyo");
})();



export { weatherApi }


