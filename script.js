// Your OpenWeatherMap API key
const API_KEY = "c3a2a6fcf5c227d446d6369266b6d895"; // Replace with your key

// Convert UNIX timestamp to local time
function formatTime(unixTime) {
    return new Date(unixTime * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

// Open OpenStreetMap in a new tab
function openMapInNewTab(lat, lon) {
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12`;
    window.open(url, "_blank"); // Opens map in a new tab
}

// Get weather by city
async function getWeather() {
    const city = document.getElementById("city").value.trim();
    if (!city) { alert("Please enter a city name"); return; }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod != 200) {
            document.getElementById("result").innerHTML = "City not found ❌";
            return;
        }

        document.getElementById("result").innerHTML = `
            <h3>Weather in ${data.name}</h3>
            <p>🌡 Temperature: ${data.main.temp} °C</p>
            <p>☁ Condition: ${data.weather[0].description}</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>🌅 Sunrise: ${formatTime(data.sys.sunrise)}</p>
            <p>🌇 Sunset: ${formatTime(data.sys.sunset)}</p>
        `;

        // Open map in new tab
        openMapInNewTab(data.coord.lat, data.coord.lon);

    } catch (error) {
        console.error(error);
        document.getElementById("result").innerHTML = "Error fetching weather data";
    }
}

// Get weather using geolocation
function getLocationWeather() {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.cod != 200) {
                    document.getElementById("result").innerHTML = "City not found ❌";
                    return;
                }

                document.getElementById("result").innerHTML = `
                    <h3>Weather in ${data.name}</h3>
                    <p>🌡 Temperature: ${data.main.temp} °C</p>
                    <p>☁ Condition: ${data.weather[0].description}</p>
                    <p>💧 Humidity: ${data.main.humidity}%</p>
                    <p>🌅 Sunrise: ${formatTime(data.sys.sunrise)}</p>
                    <p>🌇 Sunset: ${formatTime(data.sys.sunset)}</p>
                `;

                // Open map in new tab
                openMapInNewTab(data.coord.lat, data.coord.lon);

            } catch (error) {
                console.error(error);
                document.getElementById("result").innerHTML = "Unable to fetch location weather";
            }
        },
        () => { alert("Location permission denied"); },
        { enableHighAccuracy: true }
    );
}
