const userTab =document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//-----------------------------------------------------------

//initially varibale need??

let currentTab=userTab;//sbse phle default user ka khud ka weather condition dikhayega
const API_KEY="b8bc84908b45ee49eb1df47cf844ee29";
currentTab.classList.add("current-tab");//this will set the by deafult colour fade gray of your weather tab



// ab user tab se search tab me jana h toh kuch na kuch function use ho rha h jo tabs ko swicth kr rha h 
//and dono tabs pr event listener bhi lag jayega click jo switch tab ko call krdega



// -----------------------------------------


function switchTab(clickedTab){
    if(clickedTab!=currentTab){//jab dono tabs diff h jaha hum h or jaha click kiya h toh hi logic use hoga
currentTab.classList.remove("current-tab");//jo default your weather pr grey bg tha usko remove krke jis tab pr click kiya uspe le ao
currentTab=clickedTab;
currentTab.classList.add("current-tab");

if(!searchForm.classList.contains("active")){
    // agr searchform wali tab active nhi h toh this means ki hme whi switch hona h toh hum user info jisme weather info h uski hata denge ya fir agr grant access wala tab khula h toh usko bhi class list se remove kr denge
 userInfoContainer.classList.remove("active");
 grantAccessContainer.classList.remove("active");
 searchForm.classList.add("active");
}

else{//main phle search wale tab pr tha ,ab user weather ko visible krna h or serach ko invisible
    searchForm.classList.remove("active");

    userInfoContainer.classList.remove("active");
    //ab main your weather tab me aa gya hu ,toh weather bhi display krne pdega ,so lets chcek local storage first 
    //for coordinates ,if we have save them there
    getfromSessionStorage();

}
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});


//--------------------------------------


  //chcek if coordinates is already present in the storage or not
function getfromSessionStorage(){

    const localCoordinates=sessionStorage.getItem("user-coordinates");
if(!localCoordinates){
    //agr local coordinates present nhi h toh grant access wali window dikhani h
    grantAccessContainer.classList.add("active");

}
else{
    //agr locationa access de rhkha h toh api call krdo 

    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);//coordinates pas krne ke bad ye funct call ho gya jo weather ki info dega
}

}

// --------------------------

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}= coordinates;

    //make grant access location window invisible
    grantAccessContainer.classList.remove("active");

    //make loader visible-
    loadingScreen.classList.add("active");

//Api call-

try{
    const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
//info ko json me convert-
    const data=  await response.json();

    //data aa chuka h toh loader ko invisivle
    loadingScreen.classList.remove("active");

    userInfoContainer.classList.add("active");

    //abhi ui pr data show nhi hua h sirf value hi fetch hui h so 
    //we will now render the data 
    renderWeatherInfo(data);//data me se value nikalega and put krdega ui me
}
catch(err){
    console.log("error found"+" "+err);
}
  }


  //render info-----------------------

  function renderWeatherInfo(weatherInfo){


    //firstlu,fetch the elements of ui
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[ data-cloudiness]");

//see from website the json format of the api
cityName.innerText=weatherInfo?.name;
//country ka icon ui pr lane ke liye
countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText=weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`
   temp.innerText=`${weatherInfo?.main?.temp} °C`;
   windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText=`${weatherInfo?.main?.humidity} %`;
   cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
    
  }


  //-------------------------------------------------------


  function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
    // alert("no geoloaction support avialable"); //hw- show an alert for no geoloaction support available  
    }
    }
  

    function showPosition(position){
const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude
}

sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
fetchUserWeatherInfo(userCoordinates);//showing on ui
    }


  const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName=== "")
           return;
   else
        fetchSearchWeatherInfo(cityName);
    })
        
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");
    try{
         
            const response=await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data=  await response.json();
        
            loadingScreen.classList.remove("active");
        
            userInfoContainer.classList.add("active");
        
            renderWeatherInfo(data);//data me se value nikalega and put krdega ui me
        }
    
    catch(err){
        console.log("error found"+err);
    }
}
















// function renderWeatherInfo(data){
//      let new_para=document.createElement('p');
//     new_para.textContent=`${data?.main?.temp.toFixed(2)}°C`
//     document.body.appendChild(new_para);

// }



// async function showWeather(){

//     // let latitude=15.3333;
//     // let longitude=74.0833;

// try{
//     let city="jaipur";
//     const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
   
//     const data=await response.json();//json me convert krdo
//     console.log("weather data-> ", data);

//     // let ney_para=document.createElement('p');
//     // new_para.textContent=`${data?.main?.temp.toFixed(2)}°C`
//     // document.body.appendChild(new_para);

//     //or

//     //function responsible for updating ui-
// renderWeatherInfo(data);
// }

// catch(err){
// //handle error here
// console.log("error found"+err);
// }
// }


// //getting your own location-

// function getLocation(){
//     try{
//     if(navigator.geolocation){//agr ye feature browser me available h toh
//      navigator.geolocation.getCurrentPosition(showPosition);

//     }
//     else{
//         console.log("geolocation not supported");
//     }
// }
// catch(err){
//     console.log("error found"+err);
// }
// }



// function showPosition(position){
//     try{
//     let lat=position.coords.latitude;
//     let long=position.coords.longitude;

//     console.log(lat);

// console.log(long);
//     }
//     catch(err){
//         console.log("error found "+err);
//     }
// }