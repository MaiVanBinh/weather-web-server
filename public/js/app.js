console.log('Client side javascript file is loaded!');

// fetch('http://puzzle.mead.io/puzzle').then((response) => {
//     response.json().then((data) =>{
//         console.log(data)
//     });
// });
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const Location = document.querySelector('#location');
const address = document.querySelector('#address');
const forecast = document.querySelector('#forecast');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    Location.textContent = 'Loading...';
    const location = search.value;
    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                Location.textContent = data.error;
            } else {
                Location.textContent = data.address;
                address.textContent = data.location;
                forecast.textContent = data.forecastData;
            }
        })
    })
})
