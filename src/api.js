import { pubsub } from './pubsub.js';


//retrieve searched area weather data from the API  openWeather
let weatherApi = (function () {

    pubsub.subscribe("inputLocation", getLocationData);

    async function getLocationData(location) {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=a2ed8be0701763602c0aa430d5ea7c2a`);
        let WeatherData = await response.json();
        console.log(WeatherData);
        let  LocationData = new newLocation(WeatherData.name);
        console.log(LocationData);
        pubsub.publish("weatherData",LocationData);
    }

    const newLocation = function (name ){
        this.name = name;
        return { name};
    }

})();

export { weatherApi }


