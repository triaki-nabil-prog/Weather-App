import { pubsub } from './pubsub.js';
import clouds from  './img/clouds.jpeg';
import clear from  './img/Clear.jpeg';
import thunder from  './img/thunderstorm.jpeg';
import drizzle from  './img/drizzle.jpeg';
import rain from  './img/Rain.jpeg';
import snow from  './img/snow.jpeg';

let weatherDisplay = (function () {
    pubsub.subscribe("weatherData", updateDisplay);
    pubsub.subscribe("error", displayErr);
    //cash DOM
    let location = document.querySelector("#location");
    let button = document.querySelector("#submit");
    let LocationName = document.querySelector(".name");
    let icon = document.querySelector("#weather-icon");
    let main = document.querySelector(".main");
    let description = document.querySelector(".description");
    let temperature = document.querySelector(".temperature");
    let feelsLike = document.querySelector(".feels-like");
    let errDiv = document.querySelector(".err");
    let humidity =document.querySelector(".humidity");
    // add event listeners 
    button.addEventListener('click', locationSubmit);
    // submit the location chosen by  use to  api 
    function locationSubmit() {
        pubsub.publish("inputLocation", location.value);
    }
    function updateDisplay(location) {
        clearErr();
        LocationName.textContent = location.name;
        let iconUrl = "http://openweathermap.org/img/wn/" + location.icon + "@2x.png";
        icon.setAttribute("src", iconUrl);
        main.textContent = location.main;
        description.textContent = location.description;
        temperature.textContent = location.temp;
        feelsLike.textContent = location.feelsLike;
        humidity.textContent = location.humidity;
    }
    function displayErr(err) {
        errDiv.textContent = err;
    }
    function clearErr() {
        errDiv.textContent = '';
    }
})();


let BackgroundSwitcher = (function () {

    pubsub.subscribe("weatherMain", switchBackground);

    let container = document.querySelector(".container");

    function switchBackground(main) {

        switch (main) {
            case "Thunderstorm":
                container.style.backgroundImage = `url(${thunder})`;
                break;
            case "Drizzle":
                container.style.backgroundImage = `url(${drizzle})`;
                break;
            case "Rain":
                container.style.backgroundImage = `url(${rain})`;
                break;
            case "Snow":
                container.style.backgroundImage = `url(${snow})`;
                break;
            case "Clear":
                container.style.backgroundImage = `url(${clear})`;
                break;
            case "Clouds":
                container.style.backgroundImage = `url(${clouds})`;
                break;
        }
    }



})();
export { weatherDisplay }

