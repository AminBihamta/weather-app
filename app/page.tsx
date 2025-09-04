
"use client";
import { useEffect, useState } from "react";
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

export default function Home() {
  const [query, setQuery] = useState("");
  const filteredCities = cities.filter(city => city.toLowerCase().includes(query.toLowerCase()));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=10ae92008dd709619610ff5515265a95&units=metric')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <input
        className="border-solid outline outline-white pt-2 pb-2 pl-4 pr-4 rounded-sm w-100"
        type="text"
        placeholder="Enter city name"
        value={query}
        onChange={e => setQuery(e.target.value)} />

      {filteredCities.length > 0 && query.length > 0 && (
        <ul className="flex flex-col gap-3 w-100">
          
          {filteredCities.map(city => (
            <li key={city} className="bg-[#0A0A0A] border-solid outline outline-white pt-2 pb-2 pl-4 pr-4 rounded-sm">
              {city}
            </li>
          ))}
        </ul>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>

    </div>
  );
}
