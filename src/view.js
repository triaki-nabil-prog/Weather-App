import { pubsub } from './pubsub.js';

let view = (function(){
    pubsub.subscribe("weatherData",updateDisplay);
    //cash DOM
    let location = document.querySelector("#location");
    let button = document.querySelector("#submit");
    let LocationName = document.querySelector(".name");
    // add event listeners 
    button.addEventListener('click', locationSubmit);
    // submit the location chosen by  use to  api 
    function locationSubmit(){
        pubsub.publish("inputLocation", location.value);
    }
function updateDisplay(location) {
    LocationName.textContent = location.name;
}

})();

export {view}

