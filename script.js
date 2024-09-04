const body = document.body;
const header = document.querySelector('header');
const heading = document.querySelector('h1');
const switcher = document.querySelector('.switcher');
const lightModeImage = document.querySelector('.light-mode');
const darkModeImage = document.querySelector('.dark-mode');

// let isDarkTheme = false;

let isDarkTheme = localStorage.getItem('theme') === 'dark';

if (isDarkTheme) {
    body.classList.add('dark-theme');
    switcher.textContent = 'Light Theme';
    lightModeImage.style.display = 'none';
    darkModeImage.style.display = 'block';
} else {
    switcher.textContent = 'Dark Theme';
    lightModeImage.style.display = 'block';
    darkModeImage.style.display = 'none';
}

switcher.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;

    if (isDarkTheme) {
        body.classList.add('dark-theme');
        switcher.textContent = 'Light Theme';
        lightModeImage.style.display = 'none';
        darkModeImage.style.display = 'block';

        // Зберегти тему в localStorage
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        switcher.textContent = 'Dark Theme';
        lightModeImage.style.display = 'block';
        darkModeImage.style.display = 'none';

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
