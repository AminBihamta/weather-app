
"use client";
import { useEffect, useState } from "react";
import allCities from "./cities.json" assert { type: "json" };



// const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

function getLocalTime(timezoneOffsetSeconds?: number) {
  const utc = new Date();
  // Convert offset from seconds to milliseconds and add to UTC time
  const offsetMs = (timezoneOffsetSeconds ?? 0) * 1000;
  const localTime = new Date(utc.getTime() + offsetMs);
  return localTime.toLocaleTimeString();
}

export default function Home() {
  const cityNames: { name: string, country: string }[] = allCities as { name: string, country: string }[];
  const cities = cityNames.map(city => city.name);
  const [selectedCity, setSelectedCity] = useState<string | null>("New York");

  const [query, setQuery] = useState("");
  const filteredCities = cities.filter(city => city.toLowerCase().includes(query.toLowerCase())).slice(0, 15);
  const [loading, setLoading] = useState(false);
  interface WeatherData {
    main?: {
      temp?: number;
      feels_like?: number;
    };
    wind?: {
      speed?: number;
      deg?: number;
    };
    sys?: {
      country?: string;
    };
    timezone?: number;
    [key: string]: unknown;
  }
  const [data, setData] = useState<WeatherData | null>(null);
  const [utcNow, setUtcNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="flex flex-col items-start md:items-center pt-5 md:pt-20 pb-20 pl-5 pr-5 min-h-screen gap-5">
      <input
        className="border-solid outline outline-white pt-2 pb-2 pl-4 pr-4 rounded-sm md:w-100 w-full"
        type="text"
        placeholder="Enter city name"
        value={query}
        onChange={e => setQuery(e.target.value)} />

      {filteredCities.length > 0 && query.length > 0 && (
        <ul className="flex flex-col gap-3 w-full md:w-110 pr-5 pl-5 absolute mt-13 ml-[-20px] md:ml-0">

          {filteredCities.map((city, country) => (
            <li key={`${city}-${country}`} className="bg-[#0A0A0A] border-solid outline outline-white pt-2 pb-2 pl-4 pr-4 rounded-sm hover:cursor-pointer hover:bg-neutral-900"
              onClick={() => {
                setSelectedCity(city);
                setQuery("");
              }
              }>
              {city}
            </li>
          ))}
        </ul>
      )}

      <div>

      </div>

      {selectedCity && data && !loading && (

        <div className="flex flex-row w-full max-w-320 md:justify-around md:mt-[10vh] md:grow-0 grow">
          <div className="flex flex-col gap-10 md:flex-row align-middle md:align-top md:mt-20 md:justify-between justify-center w-full items-center">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="text-l text-neutral-400">{data?.sys?.country}</p>
                <p className="md:text-2xl text-xl  font-bold">{selectedCity}</p>
              </div>

              <h1 className="md:text-9xl text-7xl font-black">{data?.main?.temp}°C</h1>
              <h2>Feels like {data?.main?.feels_like}°C</h2>
              <div className="flex flex-row gap-1">
                <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 11C15.7614 11 18 8.76142 18 6C18 3.23858 15.7614 1 13 1C10.2386 1 8 3.23858 8 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 11H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 19H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 22C15 23.6569 16.3431 25 18 25C19.6569 25 21 23.6569 21 22C21 20.3431 19.6569 19 18 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M22.0001 15C24.7615 15 27.0001 12.7614 27.0001 10C27.0001 7.23858 24.7615 5 22.0001 5C21.7038 5 21.4135 5.02577 21.1313 5.0752" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M1 15H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {data?.wind?.speed} km/h, {data?.wind?.deg}°
              </div>
            </div>
            <div className="bg-neutral-100 md:p-10 p-5 rounded-2xl flex h-min">
              <p className="text-neutral-900 md:text-8xl text-5xl font-black shrink max-h-min flex">{getLocalTime(data.timezone)}</p>
            </div>
          </div>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
}
