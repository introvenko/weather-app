const body = document.body;
const header = document.querySelector('header');
const heading = document.querySelector('h1');
const switcher = document.querySelector('.switcher');
const lightModeImage = document.querySelector('.light-mode');
const darkModeImage = document.querySelector('.dark-mode');
const smallLightModeImages = document.querySelectorAll('.small-image .light-mode');
const smallDarkModeImages = document.querySelectorAll('.small-image .dark-mode');

const container = document.querySelector('.container');
// let isDarkTheme = false;

async function loadWeather(e) {
    container.innerHTML = `
    <div class="container">
        <img src="weather/kOnzy.gif" alt="loading">
    </div>`;

    const apiData = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid={443c903fbc096e439e5db06f9d35ad05}`;

    const server = 'https://api.openweathermap.org/data/2.5/weather?lat=50.26487&lon=28.67669&appid=443c903fbc096e439e5db06f9d35ad05';
    const response = await fetch(server, {
        method: 'GET',
    });
    const responseResult = await response.json();

    if (response.ok) {
        getWeather(responseResult);
    } else {
        container.innerHTML = responseResult.message;
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

        // Зберегти тему в localStorage
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        switcher.textContent = 'Dark Theme';
        lightModeImage.style.display = 'block';
        darkModeImage.style.display = 'none';
        smallLightModeImages.forEach(img => img.style.display = 'block');
        smallDarkModeImages.forEach(img => img.style.display = 'none');

        // Зберегти тему в localStorage
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
