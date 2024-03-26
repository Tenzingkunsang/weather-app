const box = document.querySelector('.container');
const search = document.querySelector('.search-bar button');
const weatherBox = document.querySelector('.weather_box');
const details = document.querySelector('.weather_info');
const weatherIcon = document.querySelector('.icon');
const pastWeatherData = document.querySelector('.past_weather');

function localStorageDataFetcher(city) {
    const localData = JSON.parse(localStorage.getItem(city));
    if (localData) {
        console.log('Displaying data from local storage:', localData);
        displayWeatherData(localData);
    } else {
        console.log('No local data found for', city);
    }
}

async function getWeather(city) {
    try {
        const response = await fetch(`http://localhost/weatherapp/weather/tests.php?q=${city}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
                localStorage.setItem(city, JSON.stringify(data));

        displayWeatherData(data);
    } catch (error) {
      alert('Invalid city ', error);
        if (error.message.includes('error')) {
            console.log( 'Using local data.');
            localStorageDataFetcher(city);
        } else {
            console.log('No interent connection')
            console.log('Other error. Using local data.');
            localStorageDataFetcher(city);
        }
    }
}

function displayWeatherData(data) {
    const dateElement = document.getElementById("date");
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date().toLocaleDateString(undefined, options);
    dateElement.textContent = date;

    const reqday = data.length - 1;
    document.querySelector('.city').innerHTML = `${data[reqday].city}`;
    document.querySelector('.temperature').innerHTML = `${data[reqday].temperature}`;
    document.querySelector('.status').innerHTML = `${data[reqday].status}`;
    document.querySelector('.humidity_info').innerHTML = `${data[reqday].humidity}%`;
    document.querySelector('.wind-speed').innerHTML = `${data[reqday].windspeed} km/h`;
    document.querySelector('.pressure').innerHTML = `${data[reqday].pressure} Pa`;
}
function queryFunction() {
    const userCity = document.getElementById('searchBox').value;
    if (userCity === '') {
        alert('Please enter a city');
    } else {
        getWeather(userCity);
    }
}


function displayInvalidCityError() {
    const errorBox = document.querySelector('.error-box');
    errorBox.style.display = 'block';
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000);
}

getWeather("Haridwar");

document.getElementById('searchButton').addEventListener('click', queryFunction);
document.getElementById('searchBox').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        queryFunction();
    }
});


async function getpastWeather(city) {
    try {
        const fetchCityName = city || "Haridwar";
        const localData = JSON.parse(localStorage.getItem(fetchCityName));

        if (localData) {
            console.log('Displaying past weather from local storage:', localData);
            displayPastWeather(localData);
        } else {
            const response = await fetch(`http://localhost/weatherapp/weather/tests.php?q=${fetchCityName}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem(fetchCityName, JSON.stringify(data));

            displayPastWeather(data);
        }
    } catch (error) {
        console.log('Error fetching past weather data:', error);
        if (error.message.includes('HTTP error')) {
            console.log('HTTP error. Displaying no past data.');
            displayPastWeather([]);
        } else {
            console.log('Other error. Displaying no past data.');
            displayPastWeather([]);
        }
    }
}

function displayPastWeather(data) {
    const weatherList = document.querySelector('.weather-list');
    weatherList.innerHTML = '';

    if (data.length === 0) {
        const noDataItem = document.createElement('li');
        noDataItem.textContent = 'No past weather data available';
        weatherList.appendChild(noDataItem);
    } else {
        data.forEach(item => {
            const weatherItem = document.createElement('li');
            weatherItem.classList.add('weather-item');

            const weatherDate = document.createElement('div');
            weatherDate.classList.add('weather-date');
            weatherDate.textContent = item.weatherDate;

            const weatherCondition = document.createElement('div');
            weatherCondition.classList.add('status');
            weatherCondition.textContent = item.status;

            const weatherTemperature = document.createElement('div');
            weatherTemperature.classList.add('weather-temperature');
            weatherTemperature.innerHTML = `Temp: ${item.temperature}°C`;

            const weatherhumidity = document.createElement('div');
            weatherhumidity.classList.add('weather-humidity');
            weatherhumidity.innerHTML = `Humidity: ${item.humidity}%`;

            const weatherPressure = document.createElement('div');
            weatherPressure.classList.add('weather-pressure');
            weatherPressure.innerHTML = `Pressure: ${item.pressure} Pa`;

            const weatherIconUrl = getWeatherIconUrl(data[reqday].icon);
            
            weatherIcon.src = weatherIconUrl;
            weatherItem.appendChild(weatherDate);
            weatherItem.appendChild(weatherCondition);
            weatherItem.appendChild(weatherTemperature);
            weatherItem.appendChild(weatherhumidity);
            weatherItem.appendChild(weatherPressure);
            weatherList.appendChild(weatherItem);
        });
    }
}

let pastbutton = document.querySelector(".past-button");
let container = document.querySelector('.container');
let searchbox = document.querySelector('#searchBox');

pastbutton.addEventListener('click', () => {
    const userCity = searchbox.value;
    if (userCity === '') {
        displayInvalidCityError();
    } else {
        getpastWeather(userCity);
        container.style.display = "none";
    }
});
