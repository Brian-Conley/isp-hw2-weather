import React, { useState } from "react";

export default function App() {
    const [days, setDays] = useState(5);
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [unit, setUnit] = useState("imperial");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    const submitQuery = async (e) => {
        e.preventDefault();

        try {
            // Check if the api key is even defined
            const apikey = process.env.REACT_APP_API_KEY;
            if (apikey === undefined) {
                throw new Error("API key is not defined. Check your .env file.");
            }

            // Build the url and make a request to the API
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apikey}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // Get the forecast for the next X days
            const data = await res.json();
            const forecasts = data.list;
            let f = [];
            for (let i = 0; i < days; i++) {
                const idx = i*8 + 3;
                if (idx < forecasts.length) {
                    f.push(data.list[idx]);
                }
            }
            setWeather(f);

        } catch (err) {
            setError(err.message);
        }
    };

    // Moved the style up here since it was messy when inlined
    const coordStyle = {
        width: "120px",
        marginBottom: "0.5rem",
        marginLeft: "1rem",
        textAlign: "center",
    };

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>ISP Homework 2</h1>
        <p><strong>Github:</strong> <a href="https://www.github.com/Brian-Conley/isp-hw2-weather">Brian-Conley/isp-hw2-weather</a></p>
        {/*<p>{apikey}</p>*/}

        <form onSubmit={submitQuery} style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            {/* lat and lon */}
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
                <p>
                    Number input boxes don't work how I'd expect.
                    You can't directly type a (-) sign into it,<br/>
                    but you can use the arrow keys on the keyboard/in the box to make it negative,
                    and you can type your<br/> number from there, albeit it still has strange behavior.<br/><br/>
                    Also, to save you the trouble of Googling it, here's the coordinates for Akron:<br/>
                    41.081757 Lat, -81.511452 Lon
                </p>
                <label>
                    Latitude:
                    <input
                        type="number" value={lat} onChange={(e) => setLat(Number(e.target.value))}
                        min={-90} max={90} step={0.000001} style={coordStyle}/>
                </label>
                <label>
                    Longitude:
                    <input
                        type="number" value={lon} onChange={(e) => setLon(Number(e.target.value))}
                        min={-180} max={180} step={0.000001} style={coordStyle}/>
                </label>
            </div>

            {/* Unit type */}
            <div style={{ marginTop: "1rem" }}>
                <label>
                    <input 
                        type="radio" value="metric" checked={unit === "metric"}
                        onChange={(e) => setUnit(e.target.value)}/>
                    Metric
                </label>
                <label>
                    <input
                        type="radio" value="imperial" checked={unit === "imperial"}
                        onChange={(e) => setUnit(e.target.value)}/>
                    Imperial
                </label>
            </div>

            {/* Number of days */}
            <label>Number of days: {days}
                <input type="range" min="1" max="5"
                    value={days} onChange={(e) => setDays(e.target.value)}
                    style={{ width: "80px", marginTop: "1rem" }}
                />
            </label>
            <br /><br />
            <button type="submit">Get Forecast</button>
        </form>

        {/* Render the weather or an error */}
        {/* Disclosure: I didn't know how to properly do weather.map */}
        {/* So this implementation right here is similar to something ChatGPT showed me */}
        {/* The only major difference in my implementation compared to ChatGPT's is that */}
        {/* I use less divs (it used a lot), and some of the text and styling it had was flat out nonsense */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {weather && weather.map((f, i) => (
            <div key={i}>
                <strong>{f.dt_txt}: </strong>
                Temperature: {f.main.temp}°,
                Precipitation: {(f.pop*100).toFixed(0)}%
                <br />
            </div>
        ))}

        </div>
    );
}
