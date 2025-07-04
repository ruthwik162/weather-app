import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  WiHumidity,
  WiBarometer,
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiStrongWind,
  WiRain,
  WiSnow,
  WiFog,
  WiThunderstorm,
  WiNightClear,
  WiNightCloudy,
  WiSunrise,
  WiSunset,
  WiDayHaze,
  WiSleet,
  WiRainMix,
  WiSnowWind,
  WiWindy
} from "react-icons/wi";
import {
  FiDroplet,
  FiEye,
  FiMapPin,
  FiWind,
  FiCompass,
  FiSun,
  FiClock,
  FiNavigation,
  FiCloud,
  FiThermometer,
  FiLoader
} from 'react-icons/fi';
import {
  FaTachometerAlt,
  FaTemperatureHigh,
  FaSearch,
  FaLocationArrow,
  FaCloudSun,
  FaCloudMoon,
  FaCloudRain,
  FaSnowflake,
  FaBolt,
  FaCloudShowersHeavy
} from 'react-icons/fa';
import { IoMdThermometer } from 'react-icons/io';
import { BsDropletHalf, BsClouds, BsWind } from 'react-icons/bs';
import { RiLoader4Line, RiTempColdLine, RiTempHotLine } from 'react-icons/ri';
import { BiCurrentLocation } from 'react-icons/bi';



const customStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.4, 1); }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
  .animation-delay-6000 { animation-delay: 6s; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .animate-spin-fast { animation: spin 0.7s linear infinite; }
`;

const API_KEY = "0aa8410334794471be252906252906";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("c");
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [locationError, setLocationError] = useState(false);
  const [forecastDays, setForecastDays] = useState(3);
  const [showEarth, setShowEarth] = useState(false);

  const getWeather = async (query) => {
    if (!query.trim()) {
      setError("Please enter a city name or allow location access.");
      setWeather(null);
      setForecast(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(query)}`),
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=${forecastDays}`)
      ]);

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      if (currentRes.ok && forecastRes.ok) {
        setWeather(currentData);
        setForecast(forecastData.forecast);
        setError("");
        const hour = new Date(currentData.location.localtime).getHours();
        setTimeOfDay(hour >= 6 && hour < 18 ? "day" : "night");
      } else {
        setError(currentData.error?.message || "City not found. Please try again.");
        setWeather(null);
        setForecast(null);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError("");
      setWeather(null);
      setForecast(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCity(`${latitude},${longitude}`);
          setLocationError(false);
        },
        (geoError) => {
          setLoading(false);
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              setError("Location access denied. Please enable location services.");
              setLocationError(true);
              setCity("London");
              break;
            case geoError.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              setLocationError(true);
              setCity("London");
              break;
            case geoError.TIMEOUT:
              setError("The request to get user location timed out.");
              setLocationError(true);
              setCity("London");
              break;
            default:
              setError("An unknown error occurred while getting your location.");
              setLocationError(true);
              setCity("London");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLocationError(true);
      setCity("London");
    }
  };

  const getWeatherIcon = (code, isDay) => {
    const weatherIcons = {
      1000: isDay ? <WiDaySunny className="text-amber-500" size={48} /> : <WiNightClear className="text-blue-100" size={48} />,
      1003: isDay ? <WiDayCloudy className="text-gray-400" size={48} /> : <WiNightCloudy className="text-gray-400" size={48} />,
      1006: <WiCloudy className="text-gray-500" size={48} />,
      1009: <WiCloudy className="text-gray-600" size={48} />,
      1030: <WiDayHaze className="text-gray-500" size={48} />,
      1063: <WiRainMix className="text-blue-400" size={48} />,
      1066: <WiSnow className="text-blue-200" size={48} />,
      1069: <WiSleet className="text-blue-400" size={48} />,
      1087: <WiThunderstorm className="text-purple-500" size={48} />,
      1114: <WiSnowWind className="text-blue-300" size={48} />,
      1117: <WiSnowWind className="text-blue-400" size={48} />,
      1135: <WiFog className="text-gray-600" size={48} />,
      1147: <WiFog className="text-gray-700" size={48} />,
      1150: <WiRain className="text-blue-400" size={48} />,
      1153: <WiRain className="text-blue-500" size={48} />,
      1168: <WiRain className="text-blue-600" size={48} />,
      1180: <WiRain className="text-blue-400" size={48} />,
      1183: <WiRain className="text-blue-500" size={48} />,
      1186: <WiRain className="text-blue-600" size={48} />,
      1189: <WiRain className="text-blue-600" size={48} />,
      1192: <WiRain className="text-blue-700" size={48} />,
      1195: <WiRain className="text-blue-800" size={48} />,
      1210: <WiSnow className="text-blue-200" size={48} />,
      1213: <WiSnow className="text-blue-300" size={48} />,
      1216: <WiSnow className="text-blue-400" size={48} />,
      1219: <WiSnow className="text-blue-500" size={48} />,
      1222: <WiSnow className="text-blue-500" size={48} />,
      1225: <WiSnow className="text-blue-600" size={48} />,
      1237: <WiSnow className="text-blue-300" size={48} />,
      1240: <WiRain className="text-blue-500" size={48} />,
      1243: <WiRain className="text-blue-600" size={48} />,
      1246: <WiRain className="text-blue-800" size={48} />,
      1255: <WiSnow className="text-blue-400" size={48} />,
      1258: <WiSnow className="text-blue-600" size={48} />,
      1273: <WiThunderstorm className="text-purple-600" size={48} />,
      1276: <WiThunderstorm className="text-purple-800" size={48} />,
      1279: <WiThunderstorm className="text-blue-600" size={48} />,
      1282: <WiThunderstorm className="text-blue-800" size={48} />,
    };

    return weatherIcons[code] || (isDay ? <WiDaySunny className="text-amber-500" size={48} /> : <WiNightClear className="text-blue-100" size={48} />);
  };

  const toggleUnit = () => {
    setUnit(unit === "c" ? "f" : "c");
  };

  const toggleForecastDays = (days) => {
    setForecastDays(days);
  };

  const getTemperature = (tempC, tempF) => {
    return unit === "c" ? `${Math.round(tempC)}°C` : `${Math.round(tempF)}°F`;
  };

  const getFeelsLike = () => {
    if (!weather) return "";
    return getTemperature(weather.current.feelslike_c, weather.current.feelslike_f);
  };

  const getTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    if (city) {
      getWeather(city);
    }
  }, [city, forecastDays]);

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <style>{customStyles}</style>
      <div
        className={`min-h-screen p-4 flex flex-col items-center justify-start transition-colors duration-1000 font-sans ${timeOfDay === 'day'
          ? 'bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 text-indigo-900'
          : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 text-white'
          }`}
      >
        <div className="fixed inset-0 overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${timeOfDay === 'day'
                ? 'bg-amber-200/60'
                : 'bg-blue-200/40'
                }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold drop-shadow-lg mb-4 sm:mb-0 flex items-center gap-2">
              {timeOfDay === 'day' ? (
                <WiDaySunny className="text-amber-500" size={32} />
              ) : (
                <WiNightClear className="text-blue-100" size={32} />
              )}
              Weather Dashboard
            </h1>
            <div className="flex gap-2">
              <button
                onClick={toggleUnit}
                className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <IoMdThermometer />
                Switch to °{unit === "c" ? "F" : "C"}
              </button>
              <button
                onClick={() => setShowEarth(!showEarth)}
                className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                {showEarth ? (
                  <>
                    <FiMapPin />
                    Hide Earth
                  </>
                ) : (
                  <>
                    <FiNavigation />
                    View Earth
                  </>
                )}
              </button>
            </div>
          </div>

          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-md bg-yellow-500/20 border border-yellow-400/30 text-yellow-800 px-4 py-3 rounded-2xl mb-6 text-center"
            >
              Could not get your location. Showing weather for default location (London).
            </motion.div>
          )}

          {showEarth ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden h-[500px] mb-6"
            >
              <Earth />
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-6 relative">
                <div className="relative w-full">
                  <input
                    className={`backdrop-blur-md border px-4 py-3 rounded-2xl text-lg w-full focus:outline-none focus:ring-2 transition-all duration-300 pl-12 ${timeOfDay === 'day'
                      ? 'bg-white/30 border-amber-200/50 text-indigo-900 focus:ring-amber-400 placeholder-indigo-700/70'
                      : 'bg-white/10 border-blue-200/20 text-white focus:ring-blue-400 placeholder-blue-100'
                      }`}
                    type="text"
                    placeholder="Enter city or location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const isText = isNaN(Number(city)) || /[a-zA-Z]/.test(city); // check if city contains letters
                        if (isText && city.trim().length > 0) {
                          getWeather(city.trim());
                        } else {
                          alert("Please enter a valid city name.");
                        }
                      }
                    }}

                  />
                  <FiMapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ${timeOfDay === 'day' ? 'text-indigo-700' : 'text-blue-200'
                    }`} />
                </div>
                <motion.button
                  className={`backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105 gap-2 ${timeOfDay === 'day'
                    ? 'bg-amber-500/80 hover:bg-amber-600/80 text-white'
                    : 'bg-blue-500/30 hover:bg-blue-600/40 text-white'
                    }`}
                  onClick={() => getWeather(city)}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <FiLoader className="animate-spin text-xl" />
                  ) : (
                    <>
                      <FaSearch />
                      Search
                    </>
                  )}
                </motion.button>
                <motion.button
                  className={`backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105 gap-2 ${timeOfDay === 'day'
                    ? 'bg-indigo-500/80 hover:bg-indigo-600/80 text-white'
                    : 'bg-purple-500/30 hover:bg-purple-600/40 text-white'
                    }`}
                  onClick={getCurrentLocationWeather}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <FiLoader className="animate-spin text-xl" />
                  ) : (
                    <>
                      <BiCurrentLocation />
                      Current
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`backdrop-blur-md border flex justify-center items-center py-16 rounded-2xl text-xl font-medium ${timeOfDay === 'day'
                      ? 'bg-white/30 border-amber-200/50 text-indigo-900'
                      : 'bg-white/10 border-blue-200/20 text-white'
                      }`}
                  >
                    <RiLoader4Line className="animate-spin-fast mr-3 text-2xl" />
                    Fetching weather data...
                  </motion.div>
                )}

                {error && !loading && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-800 px-4 py-3 rounded-2xl mb-6 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {weather && !loading && !error && (
                  <motion.div
                    key="weather-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >

                    <div className='flex flex-col gap-1'>

                      <motion.div
                        className={`backdrop-blur-xl border rounded-2xl w-5/5 md:px-22 shadow-2xl p-6 mb-6 hover:bg-white/15 transition-colors ${timeOfDay === 'day'
                          ? 'bg-white/30 border-amber-200/50'
                          : 'bg-white/10 border-blue-200/20'
                          }`}
                        variants={itemVariants}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                              <FiMapPin className={timeOfDay === 'day' ? 'text-indigo-700' : 'text-blue-200'} />
                              {weather.location.name}, {weather.location.country}
                            </h2>
                            <p className={`mb-4 flex items-center gap-2 ${timeOfDay === 'day' ? 'text-indigo-700' : 'text-blue-100'
                              }`}>
                              <FiClock />
                              {getDate(weather.location.localtime)} • {getTime(weather.location.localtime)}
                            </p>
                          </div>
                          <div className="text-3xl font-bold flex items-center gap-2">
                            <FaTemperatureHigh />
                            {getTemperature(weather.current.temp_c, weather.current.temp_f)}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
                          <div className="flex items-center ">
                            <div className="text-7xl">
                              {getWeatherIcon(weather.current.condition.code, weather.current.is_day)}
                            </div>
                            <div className="ml-4">
                              <p className={`text-xl ${timeOfDay === 'day' ? 'text-indigo-700' : 'text-blue-100'
                                }`}>
                                {weather.current.condition.text}
                              </p>
                              <div className="flex items-baseline gap-2">
                                <RiTempColdLine className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} />
                                <span className={`text-xl ${timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'
                                  }`}>
                                  Feels like {getFeelsLike()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2  gap-4">
                            <div className="flex items-center gap-2">
                              <FiWind className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} />
                              {weather.current.wind_kph} km/h {weather.current.wind_dir}
                            </div>
                            <div className="flex items-center gap-2">
                              <FiDroplet className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} />
                              {weather.current.humidity}%
                            </div>
                            <div className="flex items-center gap-2">
                              <FaTachometerAlt className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} />
                              {weather.current.pressure_mb} mb
                            </div>
                            <div className="flex items-center gap-2">
                              <FiEye className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} />
                              {weather.current.vis_km} km
                            </div>
                          </div>
                        </div>


                      </motion.div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {weather?.current && [
                          {
                            icon: <BsDropletHalf className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} size={20} />,
                            title: "Humidity",
                            value: `${weather.current.humidity}%`,
                            extra: (
                              <div className={`w-full rounded-full h-2 mt-2 ${timeOfDay === 'day' ? 'bg-indigo-200/50' : 'bg-blue-200/20'
                                }`}>
                                <div
                                  className="bg-blue-400 h-2 rounded-full"
                                  style={{ width: `${Math.min(weather.current.humidity, 100)}%` }}
                                />
                              </div>
                            )
                          },
                          {
                            icon: <BsClouds className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} size={20} />,
                            title: "Cloud Cover",
                            value: `${weather.current.cloud}%`,
                            extra: (
                              <div className={`w-full rounded-full h-2 mt-2 ${timeOfDay === 'day' ? 'bg-indigo-200/50' : 'bg-blue-200/20'
                                }`}>
                                <div
                                  className="bg-white/70 h-2 rounded-full"
                                  style={{ width: `${Math.min(weather.current.cloud, 100)}%` }}
                                />
                              </div>
                            )
                          },
                          {
                            icon: <BsWind className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} size={20} />,
                            title: "Wind",
                            value: `${weather.current.wind_kph} km/h`,
                            extra: (
                              <div className={`flex items-center text-sm mt-1 ${timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'
                                }`}>
                                <span className="mr-1">Direction:</span>
                                <span className="font-medium">{weather.current.wind_dir}</span>
                                <FiCompass
                                  className="ml-2 transform"
                                  style={{ transform: `rotate(${weather.current.wind_degree}deg)` }}
                                />
                              </div>
                            )
                          },
                          {
                            icon: <FiSun className="text-amber-500" size={20} />,
                            title: "UV Index",
                            value: weather.current.uv,
                            extra: (
                              <div className={`text-sm mt-1 ${timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'
                                }`}>
                                {weather.current.uv <= 2 ? "Low" :
                                  weather.current.uv <= 5 ? "Moderate" :
                                    weather.current.uv <= 7 ? "High" :
                                      "Very High"}
                              </div>
                            )
                          },
                          {
                            icon: <RiTempHotLine className="text-red-400" size={20} />,
                            title: "Feels Like",
                            value: getFeelsLike(),
                            extra: (
                              <div className={`text-sm mt-1 ${timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'
                                }`}>
                                {weather.current.feelslike_c < weather.current.temp_c ? "Colder than actual" :
                                  weather.current.feelslike_c > weather.current.temp_c ? "Warmer than actual" :
                                    "Same as actual"}
                              </div>
                            )
                          },
                          {
                            icon: <WiStrongWind className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'} size={24} />,
                            title: "Wind Gust",
                            value: `${weather.current.gust_kph} km/h`,
                            extra: (
                              <div className={`text-sm mt-1 ${timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'
                                }`}>
                                {weather.current.gust_kph > weather.current.wind_kph ? "Strong gusts" : "Normal"}
                              </div>
                            )
                          },
                          {
                            icon: <FaCloudRain className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-300'} size={20} />,
                            title: "Precipitation",
                            value: `${weather.current.precip_mm} mm`,
                            extra: (
                              <div className={`text-sm mt-1 ${timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'
                                }`}>
                                Last hour
                              </div>
                            )
                          },
                          {
                            icon: <WiSunrise className="text-amber-400" size={24} />,
                            title: "Sunrise/Sunset",
                            value: forecast ? `${forecast.forecastday[0].astro.sunrise} / ${forecast.forecastday[0].astro.sunset}` : "Loading...",
                            extra: (
                              <div className={`text-sm mt-1 ${timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'
                                }`}>
                                Day length: {forecast ? forecast.forecastday[0].astro.day_length : "Loading..."}
                              </div>
                            )
                          }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className={`backdrop-blur-md border rounded-2xl shadow-lg p-2 hover:scale-[1.02] transition-all ${timeOfDay === 'day'
                              ? 'bg-white/30 border-amber-200/50 hover:bg-white/40'
                              : 'bg-white/10 border-blue-200/20 hover:bg-white/15'
                              }`}
                            variants={itemVariants}
                          >
                            <div className="flex items-center mb-2 gap-2">
                              {item.icon}
                              <h3 className="font-semibold">{item.title}</h3>
                            </div>
                            <div className="text-2xl font-bold">{item.value}</div>
                            {item.extra}
                          </motion.div>
                        ))}
                      </div>

                    </div>
                    {forecast && (
                      <motion.div
                        className={`backdrop-blur-xl overflow-x-hidden border rounded-2xl shadow-xl p-6 mb-6 ${timeOfDay === 'day'
                          ? 'bg-white/30 border-amber-200/50'
                          : 'bg-white/10 border-blue-200/20'
                          }`}
                        variants={itemVariants}
                      >
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <FiClock />
                          24-Hour Forecast
                        </h3>
                        <div className="flex overflow-x-auto pb-4 space-x-3">
                          {forecast.forecastday[0].hour
                            .filter((_, index) => index % 2 === 0)
                            .map((hour, index) => (
                              <div
                                key={index}
                                className={`flex flex-col items-center min-w-[80px] p-3 rounded-lg transition-all ${timeOfDay === 'day'
                                  ? 'bg-white/40 hover:bg-white/50 border-amber-200/50'
                                  : 'bg-indigo-800/30 hover:bg-indigo-800/40 border-blue-200/20'
                                  } border`}
                              >
                                <div className={`${timeOfDay === 'day' ? 'text-indigo-700' : 'text-blue-200'
                                  }`}>
                                  {getTime(hour.time)}
                                </div>
                                <div className="text-3xl my-2">
                                  {getWeatherIcon(hour.condition.code, hour.is_day)}
                                </div>
                                <div className="font-bold">
                                  {getTemperature(hour.temp_c, hour.temp_f)}
                                </div>
                                <div className={`text-sm mt-1 flex items-center gap-1 ${timeOfDay === 'day' ? 'text-indigo-700/80' : 'text-blue-200/80'
                                  }`}>
                                  <FaCloudRain /> {hour.chance_of_rain}%
                                </div>
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    )}


                    {forecast && (
                      <motion.div
                        className={`backdrop-blur-xl border rounded-2xl shadow-xl p-6 mb-6 ${timeOfDay === 'day'
                          ? 'bg-white/30 border-amber-200/50'
                          : 'bg-white/10 border-blue-200/20'
                          }`}
                        variants={itemVariants}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiClock />
                            {forecastDays}-Day Forecast
                          </h3>
                          <div className="flex flex-col md:flex-row gap-2">
                            <button
                              onClick={() => toggleForecastDays(3)}
                              className={`backdrop-blur-md md:px-3 py-1 rounded-full text-sm font-medium transition-colors ${forecastDays === 3
                                ? timeOfDay === 'day'
                                  ? 'bg-amber-500/80 text-white'
                                  : 'bg-blue-500/80 text-white'
                                : timeOfDay === 'day'
                                  ? 'bg-white/30 hover:bg-white/40'
                                  : 'bg-white/10 hover:bg-white/15'
                                }`}
                            >
                              3 Days
                            </button>
                            <button
                              onClick={() => toggleForecastDays(7)}
                              className={`backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium transition-colors ${forecastDays === 7
                                ? timeOfDay === 'day'
                                  ? 'bg-amber-500/80 text-white'
                                  : 'bg-blue-500/80 text-white'
                                : timeOfDay === 'day'
                                  ? 'bg-white/30 hover:bg-white/40'
                                  : 'bg-white/10 hover:bg-white/15'
                                }`}
                            >
                              7 Days
                            </button>
                            <button
                              onClick={() => toggleForecastDays(10)}
                              className={`backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium transition-colors ${forecastDays === 10
                                ? timeOfDay === 'day'
                                  ? 'bg-amber-500/80 text-white'
                                  : 'bg-blue-500/80 text-white'
                                : timeOfDay === 'day'
                                  ? 'bg-white/30 hover:bg-white/40'
                                  : 'bg-white/10 hover:bg-white/15'
                                }`}
                            >
                              10 Days
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                          {forecast.forecastday.map((day, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-xl transition-all ${timeOfDay === 'day'
                                ? 'bg-white/40 hover:bg-white/50 border-amber-200/50'
                                : 'bg-indigo-800/30 hover:bg-indigo-800/40 border-blue-200/20'
                                } border`}
                            >
                              <h4 className="font-medium mb-2 flex items-center justify-between">
                                <span>{getDate(day.date)}</span>
                                <span className={`text-sm ${timeOfDay === 'day' ? 'text-indigo-700/80' : 'text-blue-200/80'
                                  }`}>
                                  {day.day.condition.text}
                                </span>
                              </h4>

                              <div className="flex items-center justify-between mb-3">
                                <div className="text-4xl">
                                  {getWeatherIcon(day.day.condition.code, true)}
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold">
                                    {getTemperature(day.day.maxtemp_c, day.day.maxtemp_f)}
                                  </div>
                                  <div className={`text-sm ${timeOfDay === 'day' ? 'text-indigo-700/80' : 'text-blue-200/80'
                                    }`}>
                                    {getTemperature(day.day.mintemp_c, day.day.mintemp_f)}
                                  </div>
                                </div>
                              </div>

                              <div className={`grid grid-cols-2 gap-2 text-sm ${timeOfDay === 'day' ? 'text-indigo-700/80' : 'text-blue-200/80'
                                }`}>
                                <div className="flex items-center gap-1">
                                  <FiDroplet /> {day.day.avghumidity}%
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiWind /> {day.day.maxwind_kph} km/h
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaCloudRain /> {day.day.totalprecip_mm} mm
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiSun /> UV: {day.day.uv}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}



                    <motion.div
                      className={`backdrop-blur-xl border rounded-2xl shadow-xl p-6 ${timeOfDay === 'day'
                        ? 'bg-white/30 border-amber-200/50'
                        : 'bg-white/10 border-blue-200/20'
                        }`}
                      variants={itemVariants}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiNavigation />
                        Location Details
                      </h3>
                      <div className={`grid grid-cols-1 items-center justify-center text-sm md:text-md md:grid-cols-2 gap-4 ${timeOfDay === 'day' ? 'text-indigo-700' : 'text-blue-100'
                        }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Region:</span>
                          <span>{weather.location.region || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Timezone:</span>
                          <span>{weather.location.tz_id || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Latitude:</span>
                          <span>{weather.location.lat || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Longitude:</span>
                          <span>{weather.location.lon || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Local Time:</span>
                          <span>{weather.location.localtime || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Last Updated:</span>
                          <span>{getTime(weather.current.last_updated) || "N/A"}</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {!weather && !loading && !error && (
                  <motion.div
                    key="initial-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className={`backdrop-blur-xl border rounded-2xl shadow-xl p-12 text-center ${timeOfDay === 'day'
                      ? 'bg-white/30 border-amber-200/50 text-indigo-900'
                      : 'bg-white/10 border-blue-200/20 text-white'
                      }`}
                  >
                    <WiDaySunny className={`text-8xl mx-auto mb-6 ${timeOfDay === 'day' ? 'text-amber-500' : 'text-blue-100'
                      }`} />
                    <h2 className="text-2xl font-semibold mb-2">Weather Dashboard</h2>
                    <p className={`text-xl mb-6 ${timeOfDay === 'day' ? 'text-indigo-700' : 'text-blue-100'
                      }`}>
                      Enter a city name to get current weather information
                    </p>
                    <p className={timeOfDay === 'day' ? 'text-indigo-600' : 'text-blue-200'}>
                      {locationError ?
                        "Using default location (London) as we couldn't access your location." :
                        "Attempting to detect your current location..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <footer className={`mt-8 text-center text-sm z-10 ${timeOfDay === 'day' ? 'text-indigo-700/80' : 'text-blue-100/80'
          }`}>
          <p>Powered by WeatherAPI.com • Data updates every 15 minutes</p>
        </footer>
      </div>
    </>
  );
};

export default WeatherApp;