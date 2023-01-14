/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "weatherApi": () => (/* binding */ weatherApi)
/* harmony export */ });
/* harmony import */ var _pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub.js */ "./src/pubsub.js");

//retrieve searched area weather data from the API  openWeather
let weatherApi = function () {
  _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.subscribe("inputLocation", getLocationData);
  async function getLocationData(location) {
    // error handling in case area not found
    async function asyncWrap(promise) {
      try {
        const data = await promise;
        if (!data.ok) {
          throw new Error(data.statusText);
        }
        return [data, undefined];
      } catch (err) {
        return [undefined, err];
      }
    }
    const [response, err] = await asyncWrap(fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=a2ed8be0701763602c0aa430d5ea7c2a&units=metric`));
    if (err) {
      _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.publish("error", err);
      return;
    }
    let WeatherData = await response.json();
    let description = WeatherData.weather[0].description;
    let main = WeatherData.weather[0].main;
    let icon = WeatherData.weather[0].icon;
    let temp = WeatherData.main.temp;
    let feelsLike = WeatherData.main.feels_like;
    let humidity = WeatherData.main.humidity;
    let LocationData = new newLocation(WeatherData.name, icon, description, main, temp, feelsLike, humidity);
    _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.publish("weatherData", LocationData);
    _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.publish("weatherMain", main);
  }
  const newLocation = function (name, icon, description, main, temp, feelsLike, humidity) {
    this.name = name;
    this.icon = icon;
    this.description = description;
    this.main = main;
    this.temp = temp;
    this.humidity = humidity;
    return {
      name,
      icon,
      description,
      main,
      temp,
      feelsLike,
      humidity
    };
  };
  getLocationData("tokyo");
}();


/***/ }),

/***/ "./src/pubsub.js":
/*!***********************!*\
  !*** ./src/pubsub.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pubsub": () => (/* binding */ pubsub)
/* harmony export */ });
let pubsub = {
  subscriptions: {
    weatherData: [],
    inputLocation: [],
    weatherMain: [],
    error: []
  },
  subscribe: function (subscriptionName, fn) {
    this.subscriptions[subscriptionName] = this.subscriptions[subscriptionName] || [];
    this.subscriptions[subscriptionName].push(fn);
  },
  unsubscribe: function (subscriptionName, fn) {
    if (this.subscriptions[subscriptionName]) {
      const index = this.subscriptions.indexOf(fn);
      if (index !== -1) this.subscriptions[subscriptionName].splice(index, 1);
    }
  },
  publish: function (subscriptionName, data) {
    if (this.subscriptions[subscriptionName]) {
      this.subscriptions[subscriptionName].forEach(fn => {
        fn(data);
      });
    }
  }
};


/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "weatherDisplay": () => (/* binding */ weatherDisplay)
/* harmony export */ });
/* harmony import */ var _pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub.js */ "./src/pubsub.js");
/* harmony import */ var _img_clouds_jpeg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./img/clouds.jpeg */ "./src/img/clouds.jpeg");
/* harmony import */ var _img_Clear_jpeg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./img/Clear.jpeg */ "./src/img/Clear.jpeg");
/* harmony import */ var _img_thunderstorm_jpeg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./img/thunderstorm.jpeg */ "./src/img/thunderstorm.jpeg");
/* harmony import */ var _img_drizzle_jpeg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./img/drizzle.jpeg */ "./src/img/drizzle.jpeg");
/* harmony import */ var _img_Rain_jpeg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./img/Rain.jpeg */ "./src/img/Rain.jpeg");
/* harmony import */ var _img_snow_jpeg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./img/snow.jpeg */ "./src/img/snow.jpeg");







let weatherDisplay = function () {
  _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.subscribe("weatherData", updateDisplay);
  _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.subscribe("error", displayErr);
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
  let humidity = document.querySelector(".humidity");
  // add event listeners 
  button.addEventListener('click', locationSubmit);
  // submit the location chosen by  use to  api 
  function locationSubmit() {
    _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.publish("inputLocation", location.value);
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
}();
let BackgroundSwitcher = function () {
  _pubsub_js__WEBPACK_IMPORTED_MODULE_0__.pubsub.subscribe("weatherMain", switchBackground);
  let container = document.querySelector(".container");
  function switchBackground(main) {
    switch (main) {
      case "Thunderstorm":
        container.style.backgroundImage = `url(${_img_thunderstorm_jpeg__WEBPACK_IMPORTED_MODULE_3__})`;
        break;
      case "Drizzle":
        container.style.backgroundImage = `url(${_img_drizzle_jpeg__WEBPACK_IMPORTED_MODULE_4__})`;
        break;
      case "Rain":
        container.style.backgroundImage = `url(${_img_Rain_jpeg__WEBPACK_IMPORTED_MODULE_5__})`;
        break;
      case "Snow":
        container.style.backgroundImage = `url(${_img_snow_jpeg__WEBPACK_IMPORTED_MODULE_6__})`;
        break;
      case "Clear":
        container.style.backgroundImage = `url(${_img_Clear_jpeg__WEBPACK_IMPORTED_MODULE_2__})`;
        break;
      case "Clouds":
        container.style.backgroundImage = `url(${_img_clouds_jpeg__WEBPACK_IMPORTED_MODULE_1__})`;
        break;
    }
  }
}();


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/reset.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/reset.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Box sizing rules */\n*,\n*::before,\n*::after {\n    box-sizing: border-box;\n}\n\n/* Remove default margin */\nbody,\nh1,\nh2,\nh3,\nh4,\np,\nfigure,\nblockquote,\ndl,\ndd {\n    margin: 0;\n}\n\n/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */\nul[role='list'],\nol[role='list'] {\n    list-style: none;\n}\n\nul,\nli {\n    margin: 0;\n    padding: 0;\n}\n\n/* Set core root defaults */\nhtml:focus-within {\n    scroll-behavior: smooth;\n}\n\n/* Set core body defaults */\nbody {\n    min-height: 100vh;\n    text-rendering: optimizeSpeed;\n    line-height: 1.5;\n}\n\n/* A elements that don't have a class get default styles */\na:not([class]) {\n    text-decoration-skip-ink: auto;\n}\n\n\n/* Make images easier to work with */\nimg,\npicture {\n    max-width: 100%;\n    display: block;\n}\n\n/* Inherit fonts for inputs and buttons */\ninput,\nbutton,\ntextarea,\nselect {\n    font: inherit;\n}\n\n/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */\n@media (prefers-reduced-motion: reduce) {\n    html:focus-within {\n        scroll-behavior: auto;\n    }\n\n    *,\n    *::before,\n    *::after {\n        animation-duration: 0.01ms !important;\n        animation-iteration-count: 1 !important;\n        transition-duration: 0.01ms !important;\n        scroll-behavior: auto !important;\n    }\n}", "",{"version":3,"sources":["webpack://./src/reset.css"],"names":[],"mappings":"AAAA,qBAAqB;AACrB;;;IAGI,sBAAsB;AAC1B;;AAEA,0BAA0B;AAC1B;;;;;;;;;;IAUI,SAAS;AACb;;AAEA,2GAA2G;AAC3G;;IAEI,gBAAgB;AACpB;;AAEA;;IAEI,SAAS;IACT,UAAU;AACd;;AAEA,2BAA2B;AAC3B;IACI,uBAAuB;AAC3B;;AAEA,2BAA2B;AAC3B;IACI,iBAAiB;IACjB,6BAA6B;IAC7B,gBAAgB;AACpB;;AAEA,0DAA0D;AAC1D;IACI,8BAA8B;AAClC;;;AAGA,oCAAoC;AACpC;;IAEI,eAAe;IACf,cAAc;AAClB;;AAEA,yCAAyC;AACzC;;;;IAII,aAAa;AACjB;;AAEA,gGAAgG;AAChG;IACI;QACI,qBAAqB;IACzB;;IAEA;;;QAGI,qCAAqC;QACrC,uCAAuC;QACvC,sCAAsC;QACtC,gCAAgC;IACpC;AACJ","sourcesContent":["/* Box sizing rules */\n*,\n*::before,\n*::after {\n    box-sizing: border-box;\n}\n\n/* Remove default margin */\nbody,\nh1,\nh2,\nh3,\nh4,\np,\nfigure,\nblockquote,\ndl,\ndd {\n    margin: 0;\n}\n\n/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */\nul[role='list'],\nol[role='list'] {\n    list-style: none;\n}\n\nul,\nli {\n    margin: 0;\n    padding: 0;\n}\n\n/* Set core root defaults */\nhtml:focus-within {\n    scroll-behavior: smooth;\n}\n\n/* Set core body defaults */\nbody {\n    min-height: 100vh;\n    text-rendering: optimizeSpeed;\n    line-height: 1.5;\n}\n\n/* A elements that don't have a class get default styles */\na:not([class]) {\n    text-decoration-skip-ink: auto;\n}\n\n\n/* Make images easier to work with */\nimg,\npicture {\n    max-width: 100%;\n    display: block;\n}\n\n/* Inherit fonts for inputs and buttons */\ninput,\nbutton,\ntextarea,\nselect {\n    font: inherit;\n}\n\n/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */\n@media (prefers-reduced-motion: reduce) {\n    html:focus-within {\n        scroll-behavior: auto;\n    }\n\n    *,\n    *::before,\n    *::after {\n        animation-duration: 0.01ms !important;\n        animation-iteration-count: 1 !important;\n        transition-duration: 0.01ms !important;\n        scroll-behavior: auto !important;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.container{\n    min-height: 100vh;\n    background-repeat: no-repeat;\n    background-size: cover;\n    background-position: center;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    color: black;\n    font-size: 1.3rem;\n}\n\n.weather{\n    background-color: rgba(255, 255, 255, 0.514);\n}\n.err{\n    text-align: center;\n    padding-top: 10px;\n}\n\n.name{\n    font-size: 1.8rem;\n}\n.section-one{\ndisplay: flex;\njustify-content: space-around;\nalign-items: center;\npadding: 20px;\n}\n.temperature{\n    text-align: center;\n    font-size: 2.8rem;\n}\n.unit{\n    text-align: center;\n}\n.feel-section{\n    display: flex;\n    justify-content: space-around;\n    padding-top: 20px;\n}\n.feel-section :nth-child(2):after{\n    content: \"C\";\n    padding-left: 5px;\n    }\n.humidity-section{\n    display: flex;\n    justify-content: space-around;\n}\n.humidity-section :nth-child(2):after{\ncontent: \"%\";\npadding-left: 5px;\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":";AACA;IACI,iBAAiB;IACjB,4BAA4B;IAC5B,sBAAsB;IACtB,2BAA2B;IAC3B,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,YAAY;IACZ,iBAAiB;AACrB;;AAEA;IACI,4CAA4C;AAChD;AACA;IACI,kBAAkB;IAClB,iBAAiB;AACrB;;AAEA;IACI,iBAAiB;AACrB;AACA;AACA,aAAa;AACb,6BAA6B;AAC7B,mBAAmB;AACnB,aAAa;AACb;AACA;IACI,kBAAkB;IAClB,iBAAiB;AACrB;AACA;IACI,kBAAkB;AACtB;AACA;IACI,aAAa;IACb,6BAA6B;IAC7B,iBAAiB;AACrB;AACA;IACI,YAAY;IACZ,iBAAiB;IACjB;AACJ;IACI,aAAa;IACb,6BAA6B;AACjC;AACA;AACA,YAAY;AACZ,iBAAiB;AACjB","sourcesContent":["\n.container{\n    min-height: 100vh;\n    background-repeat: no-repeat;\n    background-size: cover;\n    background-position: center;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    color: black;\n    font-size: 1.3rem;\n}\n\n.weather{\n    background-color: rgba(255, 255, 255, 0.514);\n}\n.err{\n    text-align: center;\n    padding-top: 10px;\n}\n\n.name{\n    font-size: 1.8rem;\n}\n.section-one{\ndisplay: flex;\njustify-content: space-around;\nalign-items: center;\npadding: 20px;\n}\n.temperature{\n    text-align: center;\n    font-size: 2.8rem;\n}\n.unit{\n    text-align: center;\n}\n.feel-section{\n    display: flex;\n    justify-content: space-around;\n    padding-top: 20px;\n}\n.feel-section :nth-child(2):after{\n    content: \"C\";\n    padding-left: 5px;\n    }\n.humidity-section{\n    display: flex;\n    justify-content: space-around;\n}\n.humidity-section :nth-child(2):after{\ncontent: \"%\";\npadding-left: 5px;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/reset.css":
/*!***********************!*\
  !*** ./src/reset.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./reset.css */ "./node_modules/css-loader/dist/cjs.js!./src/reset.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/img/Clear.jpeg":
/*!****************************!*\
  !*** ./src/img/Clear.jpeg ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "54fc462aae1a92457206.jpeg";

/***/ }),

/***/ "./src/img/Rain.jpeg":
/*!***************************!*\
  !*** ./src/img/Rain.jpeg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "fab09d5946c2c805dc7a.jpeg";

/***/ }),

/***/ "./src/img/clouds.jpeg":
/*!*****************************!*\
  !*** ./src/img/clouds.jpeg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "d2e98bdd9f1de7e8214a.jpeg";

/***/ }),

/***/ "./src/img/drizzle.jpeg":
/*!******************************!*\
  !*** ./src/img/drizzle.jpeg ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "0b9aade4724a5689a961.jpeg";

/***/ }),

/***/ "./src/img/snow.jpeg":
/*!***************************!*\
  !*** ./src/img/snow.jpeg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "2ae81d69e1c73847b43d.jpeg";

/***/ }),

/***/ "./src/img/thunderstorm.jpeg":
/*!***********************************!*\
  !*** ./src/img/thunderstorm.jpeg ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "b5c98afa96e8d1bf253b.jpeg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reset.css */ "./src/reset.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view.js */ "./src/view.js");
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api.js */ "./src/api.js");




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RDtBQUN6RCxJQUFJOztBQUVKOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNyRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDZkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDZkE7Ozs7Ozs7Ozs7Ozs7OztBQ0FxQjtBQUNBO0FBQ1UiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvcHVic3ViLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvcmVzZXQuY3NzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9yZXNldC5jc3M/ZWRlMCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHVic3ViIH0gZnJvbSAnLi9wdWJzdWIuanMnO1xuLy9yZXRyaWV2ZSBzZWFyY2hlZCBhcmVhIHdlYXRoZXIgZGF0YSBmcm9tIHRoZSBBUEkgIG9wZW5XZWF0aGVyXG5sZXQgd2VhdGhlckFwaSA9IChmdW5jdGlvbiAoKSB7XG4gICAgcHVic3ViLnN1YnNjcmliZShcImlucHV0TG9jYXRpb25cIiwgZ2V0TG9jYXRpb25EYXRhKTtcbiAgICBhc3luYyBmdW5jdGlvbiBnZXRMb2NhdGlvbkRhdGEobG9jYXRpb24pIHtcbiAgICAgICAgLy8gZXJyb3IgaGFuZGxpbmcgaW4gY2FzZSBhcmVhIG5vdCBmb3VuZFxuICAgICAgICBhc3luYyBmdW5jdGlvbiBhc3luY1dyYXAocHJvbWlzZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcHJvbWlzZTtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEub2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbZGF0YSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCBlcnJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFtyZXNwb25zZSwgZXJyXSA9IGF3YWl0IGFzeW5jV3JhcChmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT0ke2xvY2F0aW9ufSZBUFBJRD1hMmVkOGJlMDcwMTc2MzYwMmMwYWE0MzBkNWVhN2MyYSZ1bml0cz1tZXRyaWNgKSk7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwiZXJyb3JcIiwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgV2VhdGhlckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IFdlYXRoZXJEYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG4gICAgICAgIGxldCBtYWluID0gV2VhdGhlckRhdGEud2VhdGhlclswXS5tYWluO1xuICAgICAgICBsZXQgaWNvbiA9IFdlYXRoZXJEYXRhLndlYXRoZXJbMF0uaWNvbjtcbiAgICAgICAgbGV0IHRlbXAgPSBXZWF0aGVyRGF0YS5tYWluLnRlbXA7XG4gICAgICAgIGxldCBmZWVsc0xpa2UgPSBXZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2U7XG4gICAgICAgIGxldCBodW1pZGl0eSA9IFdlYXRoZXJEYXRhLm1haW4uaHVtaWRpdHk7XG4gICAgICAgIGxldCBMb2NhdGlvbkRhdGEgPSBuZXcgbmV3TG9jYXRpb24oV2VhdGhlckRhdGEubmFtZSwgaWNvbiwgZGVzY3JpcHRpb24sIG1haW4sIHRlbXAsIGZlZWxzTGlrZSxodW1pZGl0eSk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwid2VhdGhlckRhdGFcIiwgTG9jYXRpb25EYXRhKTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJ3ZWF0aGVyTWFpblwiLCBtYWluKTtcbiAgICB9XG4gICAgY29uc3QgbmV3TG9jYXRpb24gPSBmdW5jdGlvbiAobmFtZSwgaWNvbiwgZGVzY3JpcHRpb24sIG1haW4sIHRlbXAsIGZlZWxzTGlrZSxodW1pZGl0eSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmljb24gPSBpY29uO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMubWFpbiA9IG1haW47XG4gICAgICAgIHRoaXMudGVtcCA9IHRlbXA7XG4gICAgICAgIHRoaXMuaHVtaWRpdHk9aHVtaWRpdHk7XG4gICAgICAgIHJldHVybiB7IG5hbWUsIGljb24sIGRlc2NyaXB0aW9uLCBtYWluLCB0ZW1wLCBmZWVsc0xpa2UsaHVtaWRpdHkgfTtcbiAgICB9XG4gICAgZ2V0TG9jYXRpb25EYXRhKFwidG9reW9cIik7XG59KSgpO1xuXG5cblxuZXhwb3J0IHsgd2VhdGhlckFwaSB9XG5cblxuIiwibGV0IHB1YnN1YiA9IHtcblxuICAgIHN1YnNjcmlwdGlvbnM6IHtcbiAgICAgICAgd2VhdGhlckRhdGE6W10sXG4gICAgICAgIGlucHV0TG9jYXRpb246W10sXG4gICAgICAgIHdlYXRoZXJNYWluOltdLFxuICAgICAgICBlcnJvcjpbXSxcbiAgICB9LFxuXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uTmFtZSwgZm4pIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbk5hbWVdID0gdGhpcy5zdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbk5hbWVdIHx8IFtdO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uTmFtZV0ucHVzaChmbik7XG4gICAgfSxcblxuICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uTmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb25OYW1lXSkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnN1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB0aGlzLnN1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uTmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwdWJsaXNoOiBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uTmFtZSwgZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbk5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uTmFtZV0uZm9yRWFjaChmbiA9PiB7IGZuKGRhdGEpOyB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCB7IHB1YnN1YiB9IiwiaW1wb3J0IHsgcHVic3ViIH0gZnJvbSAnLi9wdWJzdWIuanMnO1xuaW1wb3J0IGNsb3VkcyBmcm9tICAnLi9pbWcvY2xvdWRzLmpwZWcnO1xuaW1wb3J0IGNsZWFyIGZyb20gICcuL2ltZy9DbGVhci5qcGVnJztcbmltcG9ydCB0aHVuZGVyIGZyb20gICcuL2ltZy90aHVuZGVyc3Rvcm0uanBlZyc7XG5pbXBvcnQgZHJpenpsZSBmcm9tICAnLi9pbWcvZHJpenpsZS5qcGVnJztcbmltcG9ydCByYWluIGZyb20gICcuL2ltZy9SYWluLmpwZWcnO1xuaW1wb3J0IHNub3cgZnJvbSAgJy4vaW1nL3Nub3cuanBlZyc7XG5cbmxldCB3ZWF0aGVyRGlzcGxheSA9IChmdW5jdGlvbiAoKSB7XG4gICAgcHVic3ViLnN1YnNjcmliZShcIndlYXRoZXJEYXRhXCIsIHVwZGF0ZURpc3BsYXkpO1xuICAgIHB1YnN1Yi5zdWJzY3JpYmUoXCJlcnJvclwiLCBkaXNwbGF5RXJyKTtcbiAgICAvL2Nhc2ggRE9NXG4gICAgbGV0IGxvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsb2NhdGlvblwiKTtcbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdWJtaXRcIik7XG4gICAgbGV0IExvY2F0aW9uTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcbiAgICBsZXQgaWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2VhdGhlci1pY29uXCIpO1xuICAgIGxldCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluXCIpO1xuICAgIGxldCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25cIik7XG4gICAgbGV0IHRlbXBlcmF0dXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZW1wZXJhdHVyZVwiKTtcbiAgICBsZXQgZmVlbHNMaWtlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mZWVscy1saWtlXCIpO1xuICAgIGxldCBlcnJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVyclwiKTtcbiAgICBsZXQgaHVtaWRpdHkgPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaHVtaWRpdHlcIik7XG4gICAgLy8gYWRkIGV2ZW50IGxpc3RlbmVycyBcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb2NhdGlvblN1Ym1pdCk7XG4gICAgLy8gc3VibWl0IHRoZSBsb2NhdGlvbiBjaG9zZW4gYnkgIHVzZSB0byAgYXBpIFxuICAgIGZ1bmN0aW9uIGxvY2F0aW9uU3VibWl0KCkge1xuICAgICAgICBwdWJzdWIucHVibGlzaChcImlucHV0TG9jYXRpb25cIiwgbG9jYXRpb24udmFsdWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KGxvY2F0aW9uKSB7XG4gICAgICAgIGNsZWFyRXJyKCk7XG4gICAgICAgIExvY2F0aW9uTmFtZS50ZXh0Q29udGVudCA9IGxvY2F0aW9uLm5hbWU7XG4gICAgICAgIGxldCBpY29uVXJsID0gXCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi9cIiArIGxvY2F0aW9uLmljb24gKyBcIkAyeC5wbmdcIjtcbiAgICAgICAgaWNvbi5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgaWNvblVybCk7XG4gICAgICAgIG1haW4udGV4dENvbnRlbnQgPSBsb2NhdGlvbi5tYWluO1xuICAgICAgICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IGxvY2F0aW9uLmRlc2NyaXB0aW9uO1xuICAgICAgICB0ZW1wZXJhdHVyZS50ZXh0Q29udGVudCA9IGxvY2F0aW9uLnRlbXA7XG4gICAgICAgIGZlZWxzTGlrZS50ZXh0Q29udGVudCA9IGxvY2F0aW9uLmZlZWxzTGlrZTtcbiAgICAgICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBsb2NhdGlvbi5odW1pZGl0eTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGlzcGxheUVycihlcnIpIHtcbiAgICAgICAgZXJyRGl2LnRleHRDb250ZW50ID0gZXJyO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhckVycigpIHtcbiAgICAgICAgZXJyRGl2LnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxufSkoKTtcblxuXG5sZXQgQmFja2dyb3VuZFN3aXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIHB1YnN1Yi5zdWJzY3JpYmUoXCJ3ZWF0aGVyTWFpblwiLCBzd2l0Y2hCYWNrZ3JvdW5kKTtcblxuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lclwiKTtcblxuICAgIGZ1bmN0aW9uIHN3aXRjaEJhY2tncm91bmQobWFpbikge1xuXG4gICAgICAgIHN3aXRjaCAobWFpbikge1xuICAgICAgICAgICAgY2FzZSBcIlRodW5kZXJzdG9ybVwiOlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7dGh1bmRlcn0pYDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJEcml6emxlXCI6XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtkcml6emxlfSlgO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlJhaW5cIjpcbiAgICAgICAgICAgICAgICBjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3JhaW59KWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiU25vd1wiOlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7c25vd30pYDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJDbGVhclwiOlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7Y2xlYXJ9KWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ2xvdWRzXCI6XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtjbG91ZHN9KWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59KSgpO1xuZXhwb3J0IHsgd2VhdGhlckRpc3BsYXkgfVxuXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qIEJveCBzaXppbmcgcnVsZXMgKi9cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbi8qIFJlbW92ZSBkZWZhdWx0IG1hcmdpbiAqL1xcbmJvZHksXFxuaDEsXFxuaDIsXFxuaDMsXFxuaDQsXFxucCxcXG5maWd1cmUsXFxuYmxvY2txdW90ZSxcXG5kbCxcXG5kZCB7XFxuICAgIG1hcmdpbjogMDtcXG59XFxuXFxuLyogUmVtb3ZlIGxpc3Qgc3R5bGVzIG9uIHVsLCBvbCBlbGVtZW50cyB3aXRoIGEgbGlzdCByb2xlLCB3aGljaCBzdWdnZXN0cyBkZWZhdWx0IHN0eWxpbmcgd2lsbCBiZSByZW1vdmVkICovXFxudWxbcm9sZT0nbGlzdCddLFxcbm9sW3JvbGU9J2xpc3QnXSB7XFxuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcblxcbnVsLFxcbmxpIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKiBTZXQgY29yZSByb290IGRlZmF1bHRzICovXFxuaHRtbDpmb2N1cy13aXRoaW4ge1xcbiAgICBzY3JvbGwtYmVoYXZpb3I6IHNtb290aDtcXG59XFxuXFxuLyogU2V0IGNvcmUgYm9keSBkZWZhdWx0cyAqL1xcbmJvZHkge1xcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplU3BlZWQ7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XFxufVxcblxcbi8qIEEgZWxlbWVudHMgdGhhdCBkb24ndCBoYXZlIGEgY2xhc3MgZ2V0IGRlZmF1bHQgc3R5bGVzICovXFxuYTpub3QoW2NsYXNzXSkge1xcbiAgICB0ZXh0LWRlY29yYXRpb24tc2tpcC1pbms6IGF1dG87XFxufVxcblxcblxcbi8qIE1ha2UgaW1hZ2VzIGVhc2llciB0byB3b3JrIHdpdGggKi9cXG5pbWcsXFxucGljdHVyZSB7XFxuICAgIG1heC13aWR0aDogMTAwJTtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qIEluaGVyaXQgZm9udHMgZm9yIGlucHV0cyBhbmQgYnV0dG9ucyAqL1xcbmlucHV0LFxcbmJ1dHRvbixcXG50ZXh0YXJlYSxcXG5zZWxlY3Qge1xcbiAgICBmb250OiBpbmhlcml0O1xcbn1cXG5cXG4vKiBSZW1vdmUgYWxsIGFuaW1hdGlvbnMsIHRyYW5zaXRpb25zIGFuZCBzbW9vdGggc2Nyb2xsIGZvciBwZW9wbGUgdGhhdCBwcmVmZXIgbm90IHRvIHNlZSB0aGVtICovXFxuQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIHtcXG4gICAgaHRtbDpmb2N1cy13aXRoaW4ge1xcbiAgICAgICAgc2Nyb2xsLWJlaGF2aW9yOiBhdXRvO1xcbiAgICB9XFxuXFxuICAgICosXFxuICAgICo6OmJlZm9yZSxcXG4gICAgKjo6YWZ0ZXIge1xcbiAgICAgICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjAxbXMgIWltcG9ydGFudDtcXG4gICAgICAgIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IDEgIWltcG9ydGFudDtcXG4gICAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDAuMDFtcyAhaW1wb3J0YW50O1xcbiAgICAgICAgc2Nyb2xsLWJlaGF2aW9yOiBhdXRvICFpbXBvcnRhbnQ7XFxuICAgIH1cXG59XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Jlc2V0LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxxQkFBcUI7QUFDckI7OztJQUdJLHNCQUFzQjtBQUMxQjs7QUFFQSwwQkFBMEI7QUFDMUI7Ozs7Ozs7Ozs7SUFVSSxTQUFTO0FBQ2I7O0FBRUEsMkdBQTJHO0FBQzNHOztJQUVJLGdCQUFnQjtBQUNwQjs7QUFFQTs7SUFFSSxTQUFTO0lBQ1QsVUFBVTtBQUNkOztBQUVBLDJCQUEyQjtBQUMzQjtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQSwyQkFBMkI7QUFDM0I7SUFDSSxpQkFBaUI7SUFDakIsNkJBQTZCO0lBQzdCLGdCQUFnQjtBQUNwQjs7QUFFQSwwREFBMEQ7QUFDMUQ7SUFDSSw4QkFBOEI7QUFDbEM7OztBQUdBLG9DQUFvQztBQUNwQzs7SUFFSSxlQUFlO0lBQ2YsY0FBYztBQUNsQjs7QUFFQSx5Q0FBeUM7QUFDekM7Ozs7SUFJSSxhQUFhO0FBQ2pCOztBQUVBLGdHQUFnRztBQUNoRztJQUNJO1FBQ0kscUJBQXFCO0lBQ3pCOztJQUVBOzs7UUFHSSxxQ0FBcUM7UUFDckMsdUNBQXVDO1FBQ3ZDLHNDQUFzQztRQUN0QyxnQ0FBZ0M7SUFDcEM7QUFDSlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBCb3ggc2l6aW5nIHJ1bGVzICovXFxuKixcXG4qOjpiZWZvcmUsXFxuKjo6YWZ0ZXIge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4vKiBSZW1vdmUgZGVmYXVsdCBtYXJnaW4gKi9cXG5ib2R5LFxcbmgxLFxcbmgyLFxcbmgzLFxcbmg0LFxcbnAsXFxuZmlndXJlLFxcbmJsb2NrcXVvdGUsXFxuZGwsXFxuZGQge1xcbiAgICBtYXJnaW46IDA7XFxufVxcblxcbi8qIFJlbW92ZSBsaXN0IHN0eWxlcyBvbiB1bCwgb2wgZWxlbWVudHMgd2l0aCBhIGxpc3Qgcm9sZSwgd2hpY2ggc3VnZ2VzdHMgZGVmYXVsdCBzdHlsaW5nIHdpbGwgYmUgcmVtb3ZlZCAqL1xcbnVsW3JvbGU9J2xpc3QnXSxcXG5vbFtyb2xlPSdsaXN0J10ge1xcbiAgICBsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5cXG51bCxcXG5saSB7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG59XFxuXFxuLyogU2V0IGNvcmUgcm9vdCBkZWZhdWx0cyAqL1xcbmh0bWw6Zm9jdXMtd2l0aGluIHtcXG4gICAgc2Nyb2xsLWJlaGF2aW9yOiBzbW9vdGg7XFxufVxcblxcbi8qIFNldCBjb3JlIGJvZHkgZGVmYXVsdHMgKi9cXG5ib2R5IHtcXG4gICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgIHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZVNwZWVkO1xcbiAgICBsaW5lLWhlaWdodDogMS41O1xcbn1cXG5cXG4vKiBBIGVsZW1lbnRzIHRoYXQgZG9uJ3QgaGF2ZSBhIGNsYXNzIGdldCBkZWZhdWx0IHN0eWxlcyAqL1xcbmE6bm90KFtjbGFzc10pIHtcXG4gICAgdGV4dC1kZWNvcmF0aW9uLXNraXAtaW5rOiBhdXRvO1xcbn1cXG5cXG5cXG4vKiBNYWtlIGltYWdlcyBlYXNpZXIgdG8gd29yayB3aXRoICovXFxuaW1nLFxcbnBpY3R1cmUge1xcbiAgICBtYXgtd2lkdGg6IDEwMCU7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKiBJbmhlcml0IGZvbnRzIGZvciBpbnB1dHMgYW5kIGJ1dHRvbnMgKi9cXG5pbnB1dCxcXG5idXR0b24sXFxudGV4dGFyZWEsXFxuc2VsZWN0IHtcXG4gICAgZm9udDogaW5oZXJpdDtcXG59XFxuXFxuLyogUmVtb3ZlIGFsbCBhbmltYXRpb25zLCB0cmFuc2l0aW9ucyBhbmQgc21vb3RoIHNjcm9sbCBmb3IgcGVvcGxlIHRoYXQgcHJlZmVyIG5vdCB0byBzZWUgdGhlbSAqL1xcbkBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKSB7XFxuICAgIGh0bWw6Zm9jdXMtd2l0aGluIHtcXG4gICAgICAgIHNjcm9sbC1iZWhhdmlvcjogYXV0bztcXG4gICAgfVxcblxcbiAgICAqLFxcbiAgICAqOjpiZWZvcmUsXFxuICAgICo6OmFmdGVyIHtcXG4gICAgICAgIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4wMW1zICFpbXBvcnRhbnQ7XFxuICAgICAgICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiAxICFpbXBvcnRhbnQ7XFxuICAgICAgICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAwLjAxbXMgIWltcG9ydGFudDtcXG4gICAgICAgIHNjcm9sbC1iZWhhdmlvcjogYXV0byAhaW1wb3J0YW50O1xcbiAgICB9XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIlxcbi5jb250YWluZXJ7XFxuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBjb2xvcjogYmxhY2s7XFxuICAgIGZvbnQtc2l6ZTogMS4zcmVtO1xcbn1cXG5cXG4ud2VhdGhlcntcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUxNCk7XFxufVxcbi5lcnJ7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgcGFkZGluZy10b3A6IDEwcHg7XFxufVxcblxcbi5uYW1le1xcbiAgICBmb250LXNpemU6IDEuOHJlbTtcXG59XFxuLnNlY3Rpb24tb25le1xcbmRpc3BsYXk6IGZsZXg7XFxuanVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuYWxpZ24taXRlbXM6IGNlbnRlcjtcXG5wYWRkaW5nOiAyMHB4O1xcbn1cXG4udGVtcGVyYXR1cmV7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgZm9udC1zaXplOiAyLjhyZW07XFxufVxcbi51bml0e1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5mZWVsLXNlY3Rpb257XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBwYWRkaW5nLXRvcDogMjBweDtcXG59XFxuLmZlZWwtc2VjdGlvbiA6bnRoLWNoaWxkKDIpOmFmdGVye1xcbiAgICBjb250ZW50OiBcXFwiQ1xcXCI7XFxuICAgIHBhZGRpbmctbGVmdDogNXB4O1xcbiAgICB9XFxuLmh1bWlkaXR5LXNlY3Rpb257XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG4uaHVtaWRpdHktc2VjdGlvbiA6bnRoLWNoaWxkKDIpOmFmdGVye1xcbmNvbnRlbnQ6IFxcXCIlXFxcIjtcXG5wYWRkaW5nLWxlZnQ6IDVweDtcXG59XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsNEJBQTRCO0lBQzVCLHNCQUFzQjtJQUN0QiwyQkFBMkI7SUFDM0IsYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIsWUFBWTtJQUNaLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLDRDQUE0QztBQUNoRDtBQUNBO0lBQ0ksa0JBQWtCO0lBQ2xCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjtBQUNBO0FBQ0EsYUFBYTtBQUNiLDZCQUE2QjtBQUM3QixtQkFBbUI7QUFDbkIsYUFBYTtBQUNiO0FBQ0E7SUFDSSxrQkFBa0I7SUFDbEIsaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSxrQkFBa0I7QUFDdEI7QUFDQTtJQUNJLGFBQWE7SUFDYiw2QkFBNkI7SUFDN0IsaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSxZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCO0FBQ0o7SUFDSSxhQUFhO0lBQ2IsNkJBQTZCO0FBQ2pDO0FBQ0E7QUFDQSxZQUFZO0FBQ1osaUJBQWlCO0FBQ2pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIlxcbi5jb250YWluZXJ7XFxuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBjb2xvcjogYmxhY2s7XFxuICAgIGZvbnQtc2l6ZTogMS4zcmVtO1xcbn1cXG5cXG4ud2VhdGhlcntcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUxNCk7XFxufVxcbi5lcnJ7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgcGFkZGluZy10b3A6IDEwcHg7XFxufVxcblxcbi5uYW1le1xcbiAgICBmb250LXNpemU6IDEuOHJlbTtcXG59XFxuLnNlY3Rpb24tb25le1xcbmRpc3BsYXk6IGZsZXg7XFxuanVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuYWxpZ24taXRlbXM6IGNlbnRlcjtcXG5wYWRkaW5nOiAyMHB4O1xcbn1cXG4udGVtcGVyYXR1cmV7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgZm9udC1zaXplOiAyLjhyZW07XFxufVxcbi51bml0e1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5mZWVsLXNlY3Rpb257XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgICBwYWRkaW5nLXRvcDogMjBweDtcXG59XFxuLmZlZWwtc2VjdGlvbiA6bnRoLWNoaWxkKDIpOmFmdGVye1xcbiAgICBjb250ZW50OiBcXFwiQ1xcXCI7XFxuICAgIHBhZGRpbmctbGVmdDogNXB4O1xcbiAgICB9XFxuLmh1bWlkaXR5LXNlY3Rpb257XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG4uaHVtaWRpdHktc2VjdGlvbiA6bnRoLWNoaWxkKDIpOmFmdGVye1xcbmNvbnRlbnQ6IFxcXCIlXFxcIjtcXG5wYWRkaW5nLWxlZnQ6IDVweDtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXNldC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4vcmVzZXQuY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuaW1wb3J0IHt2aWV3fSBmcm9tIFwiLi92aWV3LmpzXCI7XG5pbXBvcnQgeyB3ZWF0aGVyQXBpfSBmcm9tIFwiLi9hcGkuanNcIjsiXSwibmFtZXMiOlsicHVic3ViIiwid2VhdGhlckFwaSIsInN1YnNjcmliZSIsImdldExvY2F0aW9uRGF0YSIsImxvY2F0aW9uIiwiYXN5bmNXcmFwIiwicHJvbWlzZSIsImRhdGEiLCJvayIsIkVycm9yIiwic3RhdHVzVGV4dCIsInVuZGVmaW5lZCIsImVyciIsInJlc3BvbnNlIiwiZmV0Y2giLCJwdWJsaXNoIiwiV2VhdGhlckRhdGEiLCJqc29uIiwiZGVzY3JpcHRpb24iLCJ3ZWF0aGVyIiwibWFpbiIsImljb24iLCJ0ZW1wIiwiZmVlbHNMaWtlIiwiZmVlbHNfbGlrZSIsImh1bWlkaXR5IiwiTG9jYXRpb25EYXRhIiwibmV3TG9jYXRpb24iLCJuYW1lIiwic3Vic2NyaXB0aW9ucyIsIndlYXRoZXJEYXRhIiwiaW5wdXRMb2NhdGlvbiIsIndlYXRoZXJNYWluIiwiZXJyb3IiLCJzdWJzY3JpcHRpb25OYW1lIiwiZm4iLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJmb3JFYWNoIiwiY2xvdWRzIiwiY2xlYXIiLCJ0aHVuZGVyIiwiZHJpenpsZSIsInJhaW4iLCJzbm93Iiwid2VhdGhlckRpc3BsYXkiLCJ1cGRhdGVEaXNwbGF5IiwiZGlzcGxheUVyciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImJ1dHRvbiIsIkxvY2F0aW9uTmFtZSIsInRlbXBlcmF0dXJlIiwiZXJyRGl2IiwiYWRkRXZlbnRMaXN0ZW5lciIsImxvY2F0aW9uU3VibWl0IiwidmFsdWUiLCJjbGVhckVyciIsInRleHRDb250ZW50IiwiaWNvblVybCIsInNldEF0dHJpYnV0ZSIsIkJhY2tncm91bmRTd2l0Y2hlciIsInN3aXRjaEJhY2tncm91bmQiLCJjb250YWluZXIiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsInZpZXciXSwic291cmNlUm9vdCI6IiJ9