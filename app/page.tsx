
"use client";
import { useEffect, useState } from "react";
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];


export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const filteredCities = cities.filter(city => city.toLowerCase().includes(query.toLowerCase()));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);


  useEffect(() => {
  if (!selectedCity) return;
  setLoading(true);
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(selectedCity)}&appid=e19493ee2276be408cfed4b0cdcb3ca3
&units=metric`)
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, [selectedCity]);


  return (
    <div className="flex flex-col items-center pt-20 pb-20 pl-5 pr-5 min-h-screen gap-5">
      <input
        className="border-solid outline outline-white pt-2 pb-2 pl-4 pr-4 rounded-sm w-100"
        type="text"
        placeholder="Enter city name"
        value={query}
        onChange={e => setQuery(e.target.value)} />

      {filteredCities.length > 0 && query.length > 0 && (
        <ul className="flex flex-col gap-3 w-100">

          {filteredCities.map(city => (
            <li key={city} className="bg-[#0A0A0A] border-solid outline outline-white pt-2 pb-2 pl-4 pr-4 rounded-sm"
              onClick={() => setSelectedCity(city)}>
              {city}
            </li>
          ))}
        </ul>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>

    </div>
  );
}
