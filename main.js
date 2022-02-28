
let city = document.querySelector('input');
let cityName = document.querySelector('#city-name');
let icon = document.querySelector('#icon');
let temp = document.querySelector('#temp');
let desc = document.querySelector('#description');
let time = document.querySelector('#time');
let humidity = document.querySelector('#humidity');
let feeling = document.querySelector('#feeling');
let nextDays= document.getElementsByClassName('date-next');
let nextTemps= document.getElementsByClassName('temp-next');
let nextConditions= document.getElementsByClassName('condition-next');
let nextIcons= document.getElementsByClassName('icon-next');
let sortDirection = false;


const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const d = new Date();
let day = weekday[d.getDay()];



city.addEventListener('keydown',(e) =>{
    if(e.key === "Enter"){
        getWeather();
        show();
       
    }
})



async function getWeather(){
    let url = `http://api.weatherapi.com/v1/forecast.json?key=3e9ae1c84ce94107943101453221502&q=${city.value.toLocaleUpperCase()}&aqi=no&days=4`;
    let res = await fetch(url);
    let data = await res.json()
    console.log(data);
    weatherInfo(data);
    mainData= data.forecast.forecastday;
    buildTable(mainData)
    createFilter(mainData)
    city.value= ""
}


function show(){
    document.getElementById("container").style.display = "block";
    
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



const buildTable= para => {
    let table= document.getElementById('myTable');
           let row = '' 
    for (let i=0;i<para.length;i++){
         row += `<tr> 
        <td>${para[i].date}</td>
        <td>${para[i].day.avgtemp_c} &#8451; </td>
        <td>${para[i].day.condition.text}</td>
        <td>${para[i].day.avghumidity}%</td>
        <td>${para[i].day.daily_chance_of_rain}%</td>
        <td>${para[i].day.daily_will_it_snow?'Yes':'No'}</td>
        </tr>`
        
    }
    table.innerHTML = row
}


const sortTable = colName=>{
    
    sortDirection = !sortDirection;
    
   sortColumn(sortDirection,colName);
   buildTable(mainData)
}


const sortColumn = (direction,col) =>{
   
    mainData= mainData.sort((a,b)=>{
       return direction?a.day[col] - b.day[col]:b.day[col] - a.day[col]
        
    })
}


const createFilter = mainData =>{
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach( checkbox =>{
        checkbox.addEventListener('click',()=>{
            filterTable(mainData)
        })
    })
    const dropdown = document.getElementById('dropdown');
    dropdown.addEventListener('change',()=>{
        filterTable(mainData)
    })

    const tempRadios = document.querySelectorAll('input[type="radio"]');
    tempRadios.forEach(radio=>{
        radio.addEventListener('click',()=>{
            filterTable(mainData)
        })
    })
    


    
}

const filterTable= daysData =>{
    
  const filtered = daysData.filter(dayData=>{
      return (isPassHumidityDropdown(dayData.day) && chanceOfRainCheckbox(dayData.day))&& isTemperatureRadioChecked(dayData.day)
           }
    )
   buildTable(filtered)
}

const isPassHumidityDropdown= day=>{
    const select = document.getElementById('dropdown').value;
   return day.avghumidity>90 && select === 'greaterThanNinety' || 
          day.avghumidity>70 && select === 'greaterThanSeventy' || 
          day.avghumidity<50 && select === 'lessThanFifty' ||
          select==='all'

}

const chanceOfRainCheckbox = day=>{
    const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(
        checked => checked.value
    )
    return  checkboxes.includes('mostly') && day.daily_chance_of_rain>90||
    (checkboxes.includes('probably') && day.daily_chance_of_rain<90) &&
    (checkboxes.includes('probably') && day.daily_chance_of_rain>60)||
    !checkboxes.length

}

const isTemperatureRadioChecked = day =>{
    const tempRadios = Array.from(document.querySelectorAll("input[type='radio']:checked"))[0].value
    return day.avgtemp_c>10 && tempRadios === 'greaterThanTen' || 
    day.avgtemp_c>0 && tempRadios === 'greaterThanZero' || 
    day.avgtemp_c<=0 && tempRadios === 'lessThanZero' 
}

