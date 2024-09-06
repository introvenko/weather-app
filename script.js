const body = document.body;
const header = document.querySelector('header');
const heading = document.querySelector('h1');
const switcher = document.querySelector('.switcher');
const lightModeImage = document.querySelector('.light-mode');
const darkModeImage = document.querySelector('.dark-mode');
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

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (!city) return;
    getCityCoordinates(city)
        .then(geoData => {
            if (geoData) {
                const { lat, lon, country, name } = geoData;
                console.log(`Координати для ${name}: Latitude: ${lat}, Longitude: ${lon}, Країна: ${country}`);
                loadWeather(lat, lon, name, country);  // Передаємо місто і країну
            } else {
                console.log('Місто не знайдено');
            }
        })
        .catch(error => console.error('Помилка під час отримання координат:', error));
});

function getCityCoordinates(city) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
    return fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const { latitude, longitude, country, name } = data.results[0];
                return { lat: latitude, lon: longitude, country, name };
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error('Помилка під час отримання геокодування:', error);
            return null;
        });
}

function loadWeather(lat, lon, city, country) {  // Додаємо параметр country
    const apiData = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,rain,showers,snowfall,weather_code,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum&timezone=auto`;

    fetch(apiData)
        .then(response => response.json())
        .then(data => {
            console.log(apiData);
            if (data) {
                getWeather(data, city, country);  // Передаємо місто і країну у функцію getWeather
            } else {
                container.innerHTML = "Помилка отримання даних";
            }
        })
        .catch(error => console.error('Помилка під час отримання даних погоди:', error));
}

function formatISOTime(isoTime) {
    const date = new Date(isoTime); // Прямо створюємо об'єкт Date з ISO-строки
    const hours = date.getHours(); // Використовуємо метод getHours для місцевого часу
    const minutes = date.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getWeather(data, city, country) {  // Приймаємо параметр country
    console.log(data);

    const temp = Math.round(data.current_weather.temperature);
    const tempMin = Math.round(data.daily.temperature_2m_min[0]);
    const tempMax = Math.round(data.daily.temperature_2m_max[0]);
    const wind = data.current_weather.windspeed;
    const sunrise = formatISOTime(data.daily.sunrise[0]);
    const sunset = formatISOTime(data.daily.sunset[0]);

    currentWeather.innerHTML = `<div class="weather-img">
                    <img src="weather/cloudy.png" class="light-mode" alt="sun">
                    <img src="weather/cloudy-dark.png" hidden class="dark-mode" alt="sun">
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

let isDarkTheme = localStorage.getItem('theme') === 'dark';

if (isDarkTheme) {
    body.classList.add('dark-theme');
    switcher.textContent = 'Light Theme';
    lightModeImage.style.display = 'none';
    darkModeImage.style.display = 'block';
    smallLightModeImages.forEach(img => img.style.display = 'none');
    smallDarkModeImages.forEach(img => img.style.display = 'block');
} else {
    switcher.textContent = 'Dark Theme';
    lightModeImage.style.display = 'block';
    darkModeImage.style.display = 'none';
    smallLightModeImages.forEach(img => img.style.display = 'block');
    smallDarkModeImages.forEach(img => img.style.display = 'none');
}

switcher.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;

    if (isDarkTheme) {
        body.classList.add('dark-theme');
        switcher.textContent = 'Light Theme';
        lightModeImage.style.display = 'none';
        darkModeImage.style.display = 'block';
        smallLightModeImages.forEach(img => img.style.display = 'none');
        smallDarkModeImages.forEach(img => img.style.display = 'block');

        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        switcher.textContent = 'Dark Theme';
        lightModeImage.style.display = 'block';
        darkModeImage.style.display = 'none';
        smallLightModeImages.forEach(img => img.style.display = 'block');
        smallDarkModeImages.forEach(img => img.style.display = 'none');

        localStorage.setItem('theme', 'light');
    }
});















// switcher.addEventListener('click', () => {
//     if (isDarkTheme) {
//         body.style.backgroundColor = 'white';
//         header.style.borderBottom = '1px solid rgb(183, 183, 183)';
//         heading.style.color = 'black';
//         switcher.style.color = 'black';
//         switcher.textContent = 'Dark Theme';
//         isDarkTheme = false;
//     } else {
//         body.style.backgroundColor = 'black';
//         header.style.borderBottom = '1px solid white';
//         heading.style.color = 'white';
//         switcher.style.color = 'white';
//         switcher.textContent = 'Light Theme';
//         isDarkTheme = true;
//     }
// });
