
let city = document.querySelector('input');
let cityName = document.querySelector('#city-name');
let icon = document.querySelector('#icon');
let temp = document.querySelector('#temp');
let desc = document.querySelector('#description');
let time = document.querySelector('#time');
let humidity = document.querySelector('#humidity');
let feeling = document.querySelector('#feeling');
let nextDays= document.getElementsByClassName('date-next')
let nextTemps= document.getElementsByClassName('temp-next')
let nextConditions= document.getElementsByClassName('condition-next')
let nextIcons= document.getElementsByClassName('icon-next')


const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const d = new Date();
let day = weekday[d.getDay()];



city.addEventListener('keydown',(e) =>{
    if(e.key === "Enter"){
        getWeather();
        show();
       
    }
})

function show(){
    document.getElementById("container").style.display = "block";
}

async function getWeather(){
    let url = `http://api.weatherapi.com/v1/forecast.json?key=3e9ae1c84ce94107943101453221502&q=${city.value.toLocaleUpperCase()}&aqi=no&days=4`;
    let res = await fetch(url);
    let data = await res.json()
    console.log(data);
    city.value= ""
    weatherInfo(data);

}




function weatherInfo(para){
cityName.innerHTML= `${para.location.name}, ${para.location.country}`;
temp.innerHTML= `${para.current.temp_c} &#8451;`;
icon.innerHTML= `<img src=${para.current.condition.icon}>`;
desc.innerHTML= para.current.condition.text;
humidity.innerHTML= `Humidity: ${para.current.humidity}%`;
feeling.innerHTML= `Feels Like: ${para.current.feelslike_c}`;
time.innerHTML= `${day} ${para.location.localtime.substr(11)}`
nextDays[0].innerHTML=`${weekday[new Date(para.forecast.forecastday[1].date).getDay()]}`
nextDays[1].innerHTML=`${weekday[new Date(para.forecast.forecastday[2].date).getDay()]}`
nextIcons[0].innerHTML= `<img src=${para.forecast.forecastday[1].day.condition.icon}>`;
nextIcons[1].innerHTML= `<img src=${para.forecast.forecastday[2].day.condition.icon}>`;
nextConditions[0].innerHTML= para.forecast.forecastday[1].day.condition.text;
nextConditions[1].innerHTML= para.forecast.forecastday[2].day.condition.text;
nextTemps[0].innerHTML= para.forecast.forecastday[1].day.avgtemp_c+'\xB0';
nextTemps[1].innerHTML= para.forecast.forecastday[2].day.avgtemp_c+'\xB0';



}




