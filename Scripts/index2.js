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

function populateCitiesData(selectedCity) {
    clearPreviousListings();
    const selectedCityData = getSelectedCityData(selectedCity);
    // console.log(selectedCityData);
    if (selectedCityData) {
        fetchWeatherData(selectedCityData.latitude, selectedCityData.longitude)
            .then(data => displayForecastData(data));
    }
};

function clearPreviousListings() {
    const cityForecastListings = document.getElementById('cityForecastListings');
    if (cityForecastListings) {
        cityForecastListings.remove();
    }
};

function getSelectedCityData(selectedCity) {
    return cities.find(city => city.name === selectedCity);
};

function fetchWeatherData(latitude, longitude) {
    const apiUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => fetch(data.properties.forecast))
        .then(response => response.json());
};

function displayForecastData(data) {
    const selectedCityForecastData = document.getElementById('selectedCityForecastData');
    selectedCityForecastData.innerHTML = "";
    const table = createForecastTable();
    data.properties.periods.forEach(forecast => {
        const row = document.createElement("tr");
        row.appendChild(createCell(forecast.name));
        row.appendChild(createCell(`Temperature ${forecast.temperature} ${forecast.temperatureUnit}`));
        row.appendChild(createCell(`Winds ${forecast.windDirection} ${forecast.windSpeed}`));
        row.appendChild(createCell(forecast.shortForecast));
        row.appendChild(createIconData(forecast.icon));
        table.querySelector("tbody").appendChild(row);
    });

    selectedCityForecastData.appendChild(table);
}

function createForecastTable() {
    const table = document.createElement("table");
    table.id = "cityForecastListings";
    table.className = "table table-striped table-hover border mt-5";

    const thead = document.createElement("thead");
    thead.className = "table-dark";

    const headerRow = document.createElement("tr");
    ["Time/Date", "Temperature", "Wind", "Forecast", "Icon"].forEach(text => {
        const header = document.createElement("th");
        header.textContent = text;
        headerRow.appendChild(header);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.className = "table-group-divider";
    table.appendChild(tbody);

    return table;
}

function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    cell.className = "w-25";
    return cell;
}

function createIconData(iconUrl){
    const cell = document.createElement("td");
    const iconImage = document.createElement("img");
          iconImage.src = iconUrl;
        //   iconImage.className = "w-25";
          cell.appendChild(iconImage);
          return iconImage;
}