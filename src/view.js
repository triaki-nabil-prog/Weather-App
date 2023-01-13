import { pubsub } from './pubsub.js';

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

    // add event listeners 
    button.addEventListener('click', locationSubmit);
    // submit the location chosen by  use to  api 
    function locationSubmit() {
        pubsub.publish("inputLocation", location.value);
    }
    function updateDisplay(location) {
        clearErr();
        LocationName.textContent = location.name;
        let iconUrl = "http://openweathermap.org/img/w/" + location.icon + ".png";
        icon.setAttribute("src", iconUrl);
        main.textContent = location.main;
        description.textContent = location.description;
        temperature.textContent = location.temp;
        feelsLike.textContent = location.feelsLike;
    }
    function displayErr(err){
        errDiv.textContent = err;
    }
    function clearErr(){
        errDiv.textContent = '';
    } 
})();


let BackgroundSwitcher = (function(){





})();
export { view }

