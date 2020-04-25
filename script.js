const temp = {
  KtF: degK => parseFloat((degK - 273.15) * 1.8 + 32).toFixed(1),
  KtC: degK => parseFloat(degK - 273.15).toFixed(1)
};

const background = document.querySelector("body");
const locationInput = document.getElementById("weather-location");
const forecastDiv = document.getElementById("forecast");

locationInput.addEventListener("input", async e => {
  try {
    const data = await getWeatherData(e.target.value);
    forecastDiv.innerHTML = renderForecast(data);

    const bodyGif = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=4sX4m2eGg2jKOiZKriF4ewbZAgLPqj2F&s=${data.main}`,
      { mode: "cors" }
    );

    bodyBkgJson = await bodyGif.json();

    console.log(bodyBkgJson.data.images.original.url);

    background.style.backgroundImage = `url(
      ${bodyBkgJson.data.images.original.url}
    )`;
  } catch (error) {
    console.log(error);
  }
});

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=626033032e6d5a65c7e6929666f6cde5`,
      { mode: "cors" }
    );

    const data = await response.json();

    console.log(data);

    forecastDiv.innerHTML = "";

    return {
      currentTemp: data.main.temp,
      highTemp: data.main.temp_max,
      lowTemp: data.main.temp_min,
      feelsLike: data.main.feels_like,
      windSpeed: data.wind.speed,
      locationName: `${data.name}, ${data.sys.country}`,
      iconCode: data.weather[0].icon,
      main: data.weather[0].main,
      description: data.weather[0].description
    };
  } catch (error) {
    console.log(error);

    const enteredLocation = locationInput.value;

    forecastDiv.innerHTML = "";

    if (enteredLocation.trim() === "") {
      return;
    }

    const errorP = document.createElement("p");
    errorP.textContent = `No forecast found for: ${locationInput.value}`;

    forecastDiv.appendChild(errorP);
  }
}

function renderForecast(data) {
  console.log(data);
  const {
    currentTemp,
    feelsLike,
    highTemp,
    lowTemp,
    locationName,
    windSpeed,
    iconCode,
    description,
    main
  } = data;
  console.log(iconCode);
  const template = `
    <h2>${locationName}</h2>
    <div class="condition">
      <div class="icon-container">
        <img
          src="http://openweathermap.org/img/wn/${iconCode}@2x.png"
          alt="${description}"
          id="contions__icon"
        />
      </div>

      <h2>${main}</h2>
      </div>
        <div class="temperatures">
          <div class="temperatures__current">
            <p><strong>Current Temperature:</strong>
            ${temp.KtF(currentTemp)}&#176;F/
            ${temp.KtC(currentTemp)}&#176;C</p>
            </p>
            <p><strong>Feels like:</strong>
            ${temp.KtF(feelsLike)}&#176;F/
            ${temp.KtC(feelsLike)}&#176;C</p>
            </p>
          </div>
          <div class="temperatures__today">
            <p><strong>High:</strong> 
            ${temp.KtF(highTemp)}&#176;F/
            ${temp.KtC(highTemp)}&#176;C</p>
            <p><strong>Low:</strong> 
            ${temp.KtF(lowTemp)}&#176;F/
            ${temp.KtC(lowTemp)}&#176;C</p>
          </div>
        </div>
        <div class="wind">
          <p><strong>Wind speed:</strong> ${windSpeed} MPH</p>
        </div>
      </div>`;
  return template;
}
