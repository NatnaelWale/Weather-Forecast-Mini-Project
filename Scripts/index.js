"use strict";

let cities = [
    { name: "New York", latitude: 40.7128, longitude: -74.0060 },
    { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
    { name: "Houston", latitude: 29.7604, longitude: -95.3698 },
    { name: "Phoenix", latitude: 33.4484, longitude: -112.0740 },
    { name: "Philadelphia", latitude: 39.9526, longitude: -75.1652 },
    { name: "San Antonio", latitude: 29.4241, longitude: -98.4936 },
    { name: "San Diego", latitude: 32.7157, longitude: -117.1611 },
    { name: "Dallas", latitude: 32.7767, longitude: -96.7970 },
    { name: "San Jose", latitude: 37.3382, longitude: -121.8863 }
];

const selectCity = document.getElementById("selectCity");
const selectedCityForecastData = document.getElementById("selectedCityForecastData");

//https://api.weather.gov/points/{latitude},{longitude}


window.onload = () => {
    populateSelectname();
}

function populateSelectname(){
    let citySelect = document.createElement("select");
    citySelect.className = "col-lg-5 form-control"
    citySelect.addEventListener('change', () => populateCitiesData(citySelect.value))
    for(let city of cities){
        let cityOption = document.createElement("option");
        cityOption.textContent = city.name;
        cityOption.value = city.name;
        citySelect.appendChild(cityOption)
        selectCity.appendChild(citySelect);
    }
}

function populateCitiesData(selectedCity){
    const cityForecastListings = document.getElementById('cityForecastListings');
    if (cityForecastListings) {
        cityForecastListings.remove();
    }
    //    console.log(selectedCity);
    const selectedCityData = cities.filter(city => city.name === selectedCity)
    const selectedCityLatitude = selectedCityData[0].latitude;
    //    console.log(selectedCityLatitude)
    const selectedCityLongitude = selectedCityData[0].longitude;
    //    console.log(selectedCityLongitude)
    let apiUrl = `https://api.weather.gov/points/${selectedCityLatitude},${selectedCityLongitude}`
    fetch(apiUrl)
     .then(response => response.json())
     .then(data => {
        console.log(data)
        const newApiUrl = data.properties.forecast;
        // console.log(newApiUrl);
        fetch(newApiUrl)
          .then(response => response.json())
          .then(data => {
        //    console.log(data)
        selectedCityForecastData.innerHTML = "";
        const table = document.createElement("table");
        table.id = "cityForecastListings";
        table.className = "table table-striped table-hover border mt-5";
        const thead = document.createElement("thead");
        thead.className = "table-dark";
        const tbody = document.createElement("tbody");
        tbody.className = "table-group-divider";

        const headerRow = document.createElement("tr");
        ["Time/Date", "Temprature", "Wind", "Forecast"].forEach(text => {
            const header = document.createElement("th");
            header.textContent = text;
            headerRow.appendChild(header);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);
           for(let forecast of data.properties.periods){
            // console.log(forecast);
            const row = document.createElement("tr");
            row.appendChild(createCell(forecast.name));
            row.appendChild(createCell(`Temprature ${forecast.temperature} ${forecast.temperatureUnit}`));
            row.appendChild(createCell(`Winds ${forecast.windDirection} ${forecast.windSpeed}`));
            row.appendChild(createCell(forecast.shortForecast))
            tbody.appendChild(row);
        };
        table.appendChild(tbody);
        selectedCityForecastData.appendChild(table);
           })
          })
     };

function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    cell.className = "w-25"
    return cell;
}