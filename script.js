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


const container = document.querySelector('.container');
// let isDarkTheme = false;


submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();  // Отримати введене місто
    if (!city) return;
    try {
        // Отримую координати через OpenWeather Geocoding API
        const geoData = await getCityCoordinates(city);
        if (geoData) {
            const { lat, lon } = geoData;
            console.log(`Координати для ${city}: Latitude: ${lat}, Longitude: ${lon}`);
            loadWeather(lat, lon); // Викликати функцію завантаження погоди з новими координатами
        } else {
            console.log('Місто не знайдено');
        }
    } catch (error) {
        console.error('Помилка під час отримання координат:', error);
    }
});

// Функція для отримання координат міста через Geocoding API
async function getCityCoordinates(city) {
    const apiKey = '443c903fbc096e439e5db06f9d35ad05';
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodingUrl);
    const data = await response.json();

    if (data.length > 0) {
        return {
            lat: data[0].lat,
            lon: data[0].lon
        };
    } else {
        return null;
    }
}

async function loadWeather(lat, lon) {
    const container = document.querySelector('.container');
    container.innerHTML = `
    <div class="container">
        <img src="weather/kOnzy.gif" alt="loading">
    </div>`;

    const apiKey = '443c903fbc096e439e5db06f9d35ad05';
    const apiData = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiData);
    const data = await response.json();

    if (response.ok) {
        getWeather(data);
    } else {
        container.innerHTML = data.message;
    }
}

function formatUnixTime(unixTime) {
    const date = new Date(unixTime * 1000);

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getWeather(data) {
    console.log(data);

    const location = data.name;
    const temp = Math.round(data.main.temp);
    const tempMin = Math.round(data.main.temp_min);
    const tempMax = Math.round(data.main.temp_max);
    const weatherStatus = data.weather[0].main;
    const weatherIcon = data.weather[0].icon;
    const country = data.sys.country;
    const wind = data.wind.speed;
    const sunrise = formatUnixTime(data.sys.sunrise);
    const sunset = formatUnixTime(data.sys.sunset);
    const feelsLike = Math.round(data.main.feels_like);

    const template = ``
}

// if (container) {
//     loadWeather();
// }

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
