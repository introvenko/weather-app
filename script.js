const body = document.body;
const switcher = document.querySelector('.switcher');
const lightModeImages = document.querySelectorAll('.light-mode');
const darkModeImages = document.querySelectorAll('.dark-mode'); 
const smallLightModeImages = document.querySelectorAll('.small-image .light-mode');
const smallDarkModeImages = document.querySelectorAll('.small-image .dark-mode');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submit-btn');
let lat = '';
let lon = '';
const helloImage = document.getElementById('hello-image'); 
const container = document.querySelector('.container');
const currentWeather = document.createElement('section');
currentWeather.className = 'current-weather';
currentWeather.prepend(helloImage);

const weatherDescriptions = {
    0: 'clear',
    1: 'mostly_clear',
    2: 'partly_cloudy',
    3: 'cloudy',
    45: 'fog',
    48: 'frost',
    51: 'drizzle',
    53: 'light_drizzle',
    55: 'heavy_drizzle',
    61: 'rain',
    63: 'shower',
    71: 'snow',
    80: 'rain_shower',
    81: 'rain_showers_moderate',
    95: 'thunderstorm',
    96: 'hail',
    default: 'unknown'
};

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (!city) {
        container.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }
    
    if (helloImage) {
        helloImage.style.display = 'none';
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
            getFutureWeather(data);
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
    const weatherCode = data.daily.weather_code[0];
    const description = weatherDescriptions[weatherCode] || 'oops';
    const temp = Math.round(data.current_weather.temperature);
    const tempMin = Math.round(data.daily.temperature_2m_min[0]);
    const tempMax = Math.round(data.daily.temperature_2m_max[0]);
    const wind = data.current_weather.windspeed;
    const sunrise = formatISOTime(data.daily.sunrise[0]);
    const sunset = formatISOTime(data.daily.sunset[0]);

    console.log('Weather Code:', weatherCode);
    console.log('Description:', description);

    let weatherImage = `weather/${description}.png`;
    let darkWeatherImage = `weather/${description}-dark.png`;

    let defaultImage = 'weather/oops.png';
    let defaultDarkImage = 'weather/oops-dark.png';

    currentWeather.innerHTML = `
        <div class="weather-img">
            <img src="${weatherImage}" onerror="this.src='${defaultImage}'" class="light-mode" alt="${description}">
            <img src="${darkWeatherImage}" onerror="this.src='${defaultDarkImage}'" hidden class="dark-mode" alt="${description}">
        </div>
        <div class="weather-info">
            <div class="city-and-degrees">
                <p id="country">${country}</p>
                <p id="city">${city}</p>
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

    updateWeatherImages();
}

function getFutureWeather(data) {
    const futureWeatherSection = document.querySelector('.future-weather');
    futureWeatherSection.classList.remove('hidden');

    futureWeatherSection.innerHTML = '';

    const forecast = data.daily.weather_code.slice(1, 6);
    const tempsMin = data.daily.temperature_2m_min.slice(1, 6);
    const tempsMax = data.daily.temperature_2m_max.slice(1, 6);
    const dates = data.daily.time.slice(1, 6).map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));

    forecast.forEach((code, index) => {
        const description = weatherDescriptions[code] || 'unknown';
        const lightImage = `weather/${description}.png`;
        const darkImage = `weather/${description}-dark.png`;

        const defaultLightImage = 'weather/default.png';
        const defaultDarkImage = 'weather/default-dark.png';

        const container = document.createElement('div');
        container.className = 'small-container';

        container.innerHTML = `
            <div class="small-image">
                <img src="${lightImage}" class="light-mode" alt="${description}" onerror="this.src='${defaultLightImage}'">
                <img src="${darkImage}" class="dark-mode" hidden alt="${description}" onerror="this.src='${defaultDarkImage}'">
            </div>
            <div class="date-temp">
                <p class="small-degree">${Math.round((tempsMin[index] + tempsMax[index]) / 2)}°C</p>
                <p class="small-date">${dates[index]}</p>
            </div>
        `;

        futureWeatherSection.appendChild(container);
    });

    updateWeatherImages();
}

container.prepend(currentWeather);

function updateWeatherImages() {
    const weatherImages = document.querySelectorAll('.weather-img img, .small-image img');

    weatherImages.forEach(img => {
        const isDarkTheme = body.classList.contains('dark-theme');
        let imageSrc = img.src.replace('-dark.png', '.png');
        imageSrc = isDarkTheme ? imageSrc.replace('.png', '-dark.png') : imageSrc;

        img.onerror = function() {
            img.src = isDarkTheme ? 'weather/default-dark.png' : 'weather/default.png';
        };

        img.src = imageSrc;
    });
}

function applyTheme(isDarkTheme) {
    if (isDarkTheme) {
        body.classList.add('dark-theme');
        switcher.textContent = 'Light Theme';

        lightModeImages.forEach(img => img.hidden = true);
        darkModeImages.forEach(img => img.hidden = false);

        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        switcher.textContent = 'Dark Theme';

        lightModeImages.forEach(img => img.hidden = false);
        darkModeImages.forEach(img => img.hidden = true);

        localStorage.setItem('theme', 'light');
    }

    updateWeatherImages();
}

let isDarkTheme = localStorage.getItem('theme') === 'dark';
applyTheme(isDarkTheme);

switcher.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    applyTheme(isDarkTheme);
});