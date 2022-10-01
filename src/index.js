const domManipulation = (() => {
  const weatherDetailsContainer = document.querySelector('.weather-details-container');
  const secondappContainer = document.querySelector('.appcontainer');
  const displayWeatherDetailsBtn = document.querySelector('.display-weather-details');
  const inputBox = document.querySelector('.input');
  const location = document.querySelector('.location');
  const temperature = document.querySelector('.temperature');
  const weatherStatus = document.querySelector('.weather-status');
  const sunTime = document.querySelector('.suntime');
  const weatherStatusImage = document.querySelector('.weather-status-image');
  const togggleFarenheit = document.querySelector('.checkbox');
  return {
    location,
    temperature,
    weatherStatus,
    sunTime,
    inputBox,
    displayWeatherDetailsBtn,
    weatherStatusImage,
    secondappContainer,
    weatherDetailsContainer,
    togggleFarenheit,
  };
})();

function toggleTemp(temp1, temp2, moreData) {
  domManipulation.togggleFarenheit.addEventListener('change', (event) => {
    if (event.target.checked) {
      var firstTemp = Math.round((temp1 - 273.1) * (9 / 5) + 32);
      var secondTemp = Math.round((temp2 - 273.1) * (9 / 5) + 32);
      domManipulation.temperature.innerHTML = `${firstTemp}°F`;
      domManipulation.weatherStatus.innerHTML = `Feels like ${secondTemp}°F ${moreData}`;
    } else {
      firstTemp = Math.round(temp1 - 273.15);
      secondTemp = Math.round(temp2 - 273.15);
      domManipulation.temperature.innerHTML = `${firstTemp}°C`;
      domManipulation.weatherStatus.innerHTML = `Feels like ${secondTemp}°C ${moreData}`;
    }
  });
}

function formatTime(suntime) {
  return new Date(suntime * 1000).toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
}
async function getWeatherDetails(location) {
  domManipulation.secondappContainer.innerHTML = 'Loading....';
  const inputValue = domManipulation.inputBox.value;
  if (location) {
    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=0cdd23bc9251bc7da62c183bfc86ffde`, { mode: 'cors' });
  } else {
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&APPID=0cdd23bc9251bc7da62c183bfc86ffde`, { mode: 'cors' });
  }
  const weatherObject = await response.json();
  // displaying details
  const remWeatherData = ` | ${weatherObject.weather[0].description} | Humidity ${weatherObject.main.humidity}%`;
  toggleTemp(weatherObject.main.temp, weatherObject.main.feels_like, remWeatherData);
  domManipulation.location.innerHTML = `${weatherObject.name}, ${weatherObject.sys.country}`;
  domManipulation.temperature.innerHTML = `${Math.round(`${weatherObject.main.temp}` - 273.15)}°C`;
  domManipulation.weatherStatus.innerHTML = `Feels like ${Math.round(`${weatherObject.main.feels_like
  }` - 273.15)}°C${remWeatherData}`;
  domManipulation.weatherStatusImage.src = `https://openweathermap.org/img/wn/${weatherObject.weather[0].icon}@2x.png`;
  const sunrise = formatTime(weatherObject.sys.sunrise);
  const sunset = formatTime(weatherObject.sys.sunset);
  domManipulation.sunTime.innerHTML = `sunrise: ${sunrise} | sunset: ${sunset}`;
  domManipulation.secondappContainer.innerHTML = '';
  domManipulation.weatherDetailsContainer.classList.add('active');
  domManipulation.secondappContainer.append(domManipulation.weatherDetailsContainer);
}
domManipulation.displayWeatherDetailsBtn.addEventListener('click', () => {
  getWeatherDetails().catch(() => {
    domManipulation.secondappContainer.innerHTML = 'Error, location not found';
  });
});
getWeatherDetails('magboro')
  .catch(() => {
    domManipulation.secondappContainer.innerHTML = 'Error, location not found';
  });
