
let city = document.querySelector('input');
let cityName = document.querySelector('#city-name');
let icon = document.querySelector('#icon');
let temp = document.querySelector('#temp');
let desc = document.querySelector('#description');
let time = document.querySelector('#time');
let humidity = document.querySelector('#humidity');
let feeling = document.querySelector('#feeling');


city.addEventListener('keydown',(e) =>{
    if(e.key === "Enter"){
        console.log(e.target.value);
        getWeather();
    }
})


async function getWeather(){
    let url = `http://api.weatherapi.com/v1/forecast.json?key=3e9ae1c84ce94107943101453221502&q=${city.value.toLocaleUpperCase()}&aqi=no&days=4`;
    let res = await fetch(url);
    let data = await res.json()
    console.log(data)
    city.value= ""
    weatherInfo(data)

}


function weatherInfo(para){
cityName.innerHTML= `${para.location.name}, ${para.location.country}`
temp.innerHTML= para.current.temp_c;
icon.innerHTML= `<img src=${para.current.condition.icon}>`
desc.innerHTML= para.current.condition.text




}