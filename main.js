
const city = document.querySelector('input'),   
    cityName = document.querySelector('#city-name'),
    icon = document.querySelector('#icon'),
    temp = document.querySelector('#temp'),
    desc = document.querySelector('#description'),
    time = document.querySelector('#time'),
    humidity = document.querySelector('#humidity'),
    feeling = document.querySelector('#feeling'),
    nextDays= document.getElementsByClassName('date-next'),
    nextTemps= document.getElementsByClassName('temp-next'),
    nextConditions= document.getElementsByClassName('condition-next'),
    nextIcons= document.getElementsByClassName('icon-next')
    
 let sortDirection = false
 

let mainData;


const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// create new date 
const d = new Date();
let day = weekday[d.getDay()];



// add event listener with press Enter 
city.addEventListener('keydown',(e) =>{ 
    if(e.key === "Enter"){
        getWeather();
        show();
       
    }
})


// get data from fetch weather API
async function getWeather(){
    let url = `http://api.weatherapi.com/v1/forecast.json?key=3e9ae1c84ce94107943101453221502&q=${city.value.toLocaleUpperCase()}&aqi=no&days=4`;
    let res = await fetch(url);
    let data = await res.json()
    console.log(data);
    weatherInfo(data);
    mainData= data.forecast.forecastday;
    buildTable(mainData)
    createFilter(mainData)
    weatherPerHour(mainData)
    city.value= ""
}


// show the hidden divs
function show(){
    document.getElementById("container").style.visibility = "visible";
    document.getElementById("filter").style.visibility = "visible";
    document.getElementById("table").style.visibility = "visible";
    
}



//present data from API
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



// event listener that change celsius to fahrenheit or vice versa
temp.addEventListener('click',()=>{
   if(temp.classList.contains('celsius')){
       temp.classList.remove('celsius');
       temp.innerHTML= `${para.current.temp_f} &#8457;`;
}else{
    temp.classList.add('celsius')
    temp.innerHTML= `${para.current.temp_c} &#8451;`;
}
})

}


// create a table of days with weather info 
const buildTable= para => {
    let table= document.getElementById('myTable');
           let row = '' 
    for (let i=0;i<para.length;i++){
         row += `<tr> 
        <td class= "date">${para[i].date}</td>
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
   weatherPerHour(mainData)
   
}


const sortColumn = (direction,col) =>{
   
    mainData = mainData.sort((a,b)=>{
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
   if(filtered.length){
    buildTable(filtered)
    weatherPerHour(filtered)
   }else{
   // buildTable(filtered)
    alert('there is no day as your filter')
   }
   
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
    const tempRadios = Array.from(document.querySelectorAll("input[type='radio']:checked")).map(
        checked => checked.value)
    return day.avgtemp_c>10 && tempRadios[0] === 'greaterThanTen' || 
    day.avgtemp_c>0 && tempRadios[0] === 'greaterThanZero' || 
    day.avgtemp_c<=0 && tempRadios[0] === 'lessThanZero'||
    !tempRadios.length
}



const weatherPerHour = (mainData)=>{
    document.getElementById("sub-table").style.visibility='visible'
    const arrayOfDays = Array.from(document.querySelectorAll('.date'))
    arrayOfDays.forEach(day=>{
        day.addEventListener('click',()=>{
           const indexOfDay=  arrayOfDays.indexOf(day);
           const subData = mainData[indexOfDay].hour;
           console.log('subData', subData)
           let subTable= document.getElementById('sub-myTable');
           let row = ''
           for (let i=0;i<subData.length;i++){
            row += `<tr> 
           <td>${subData[i].time.substr(11)}</td>
           <td>${subData[i].temp_c} &#8451; </td>
           <td>${subData[i].condition.text}</td>
           <td>${subData[i].humidity}%</td>
           <td>${subData[i].feelslike_c}</td>
           <td>${subData[i].is_day?'Yes':'No'}</td>
           </tr>`
           
       }
       document.getElementById("sub-table").style.visibility='visible';
           subTable.innerHTML = row

        })
    })
    


}