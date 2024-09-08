const body = document.body;
const header = document.querySelector('header');
const heading = document.querySelector('h1');
const switcher = document.querySelector('.switcher');
const lightModeImages = document.querySelectorAll('.light-mode');  // Всі світлі зображення
const darkModeImages = document.querySelectorAll('.dark-mode'); 
const smallLightModeImages = document.querySelectorAll('.small-image .light-mode');
const smallDarkModeImages = document.querySelectorAll('.small-image .dark-mode');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submit-btn');
let lat = '';
let lon = '';
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const container = document.querySelector('.container');
const currentWeather = document.createElement('section');
currentWeather.className = 'current-weather';
console.log(currentWeather);

const weatherCodes = {
    0: 'sun',            // Чисте небо
    1: 'sunny',            // Переважно чисте небо
    2: 'cloudy',          // Частково хмарно
    3: 'overcast',          // Хмарно
    45: 'fog',           // Туман
    48: 'frosty', 
    51: 'drizzle',       // Легкий мряка
    61: 'rain',          // Легкий дощ
    71: 'snow',          // Легкий снігопад
    95: 'thunderstorm',  // Гроза
};

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (!city) {
        container.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }
    getCityCoordinates(city)
        .then(geoData => {
            if (geoData) {
                const { lat, lon, country, name } = geoData;
                loadWeather(lat, lon, name, country);
            } else {
                container.innerHTML = "<p>City not found. Please try again.</p>";
            }
        })
        .catch(error => {
            container.innerHTML = "<p>Error fetching data. Please try again later.</p>";
            console.error('Error:', error);
        });
});

async function getCityCoordinates(city) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
    try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const { latitude, longitude, country, name } = data.results[0];
            return { lat: latitude, lon: longitude, country, name };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        return null;
    }
}

async function loadWeather(lat, lon, city, country) {
    const apiData = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,rain,showers,snowfall,weather_code,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,showers_sum,snowfall_sum&timezone=auto`;

    try {
        const response = await fetch(apiData);
        const data = await response.json();
        if (data) {
            getWeather(data, city, country);
        } else {
            container.innerHTML = "Error fetching data";
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


function formatISOTime(isoTime) {
    const date = new Date(isoTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getWeather(data, city, country) {
    const weatherDescription = data.current_weather.weather_code;
    const temp = Math.round(data.current_weather.temperature);
    const tempMin = Math.round(data.daily.temperature_2m_min[0]);
    const tempMax = Math.round(data.daily.temperature_2m_max[0]);
    const wind = data.current_weather.windspeed;
    const sunrise = formatISOTime(data.daily.sunrise[0]);
    const sunset = formatISOTime(data.daily.sunset[0]);

    console.log(data);

    // Визначаємо шлях до зображення відповідно до опису погоди
    let weatherImage;
    switch (weatherDescription) {
        case 'clear':
        case 'sun':
            weatherImage = 'weather/sun.png';
            break;
        case 'sunny':
            weatherImage = 'weather/sunny.png';
            break;
        case 'cloudy':
            weatherImage = 'weather/cloudy.png';
            break;
        case 'drizzle':
            weatherImage = 'weather/drizzle.png';
            break;
        case 'rain':
            weatherImage = 'weather/rain.png';
            break;
        case 'thunderstorm':
            weatherImage = 'weather/thunderstorm.png';
            break;
        case 'snow':
            weatherImage = 'weather/snowing.png';
            break;
        case 'overcast':
            weatherImage = 'weather/overcast.png';
            break;
        case 'fog':
            weatherImage = 'weather/fog.png';
            break;
        case 'frosty':
            weatherImage = 'weather/frosty.png';
            break;
        default:
            weatherImage = 'weather/kOnzy.gif'; // fallback зображення
    }

    currentWeather.innerHTML = `<div class="weather-img">
                    <img src="${weatherImage}" class="light-mode" alt="${weatherDescription}">
                    <img src="${weatherImage.replace('.png', '-dark.png')}" hidden class="dark-mode" alt="${weatherDescription}">
                </div>
                <div class="weather-info">
                    <div class="city-and-degrees">
                        <p id="country">${country}</p>  <!-- Використовуємо передану назву країни -->
                        <p id="city">${city}</p>  <!-- Використовуємо передану назву міста -->
                        <p class="temperature">${temp}°C</p>
                    </div>
                    <div class="additional-info">
                        <p id="min-temp">Min: ${tempMin}°C</p>
                        <p id="max-temp">Max: ${tempMax}°C</p>
                        <p id="wind">Wind: ${wind} kmph</p>
                        <p id="sunrise">Sunrise: ${sunrise}</p>
                        <p id="sunset">Sunset: ${sunset}</p>
                    </div>
                </div>`;
}

console.log(currentWeather);
container.prepend(currentWeather);

function applyTheme(isDarkTheme) {
    if (isDarkTheme) {
        body.classList.add('dark-theme');
        switcher.textContent = 'Light Theme';

        // Переключаємо зображення на темну тему
        lightModeImages.forEach(img => img.hidden = true);
        darkModeImages.forEach(img => img.hidden = false);

        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        switcher.textContent = 'Dark Theme';

        // Переключаємо зображення на світлу тему
        lightModeImages.forEach(img => img.hidden = false);
        darkModeImages.forEach(img => img.hidden = true);

        localStorage.setItem('theme', 'light');
    }
}

let isDarkTheme = localStorage.getItem('theme') === 'dark';
applyTheme(isDarkTheme);

// Обробник кліку для перемикання теми
switcher.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    applyTheme(isDarkTheme);
});