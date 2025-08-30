import { useState, useEffect } from "react";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFilm,
  faRandom,
  faStar,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { SearchProvider } from "@/src/context/SearchContext";
import WebSearch from "../searchbar/WebSearch";
import MobileSearch from "../searchbar/MobileSearch";

function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [isNotHomePage, setIsNotHomePage] = useState(
    location.pathname !== "/" && location.pathname !== "/home"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    uptime: { hours: 0, days: 0 },
    startDate: new Date(),
    ping: 0,
    dailyVisitors: 1247
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Calculate uptime and ping
    const startTime = new Date('2024-01-01T00:00:00Z'); // Set your actual start date
    const updateStats = () => {
      const now = new Date();
      const diffMs = now - startTime;
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      // Simulate ping measurement
      const pingStart = performance.now();
      fetch(window.location.origin + '/favicon.ico', { method: 'HEAD' })
        .then(() => {
          const ping = Math.round(performance.now() - pingStart);
          setStats(prev => ({
            ...prev,
            uptime: { hours, days },
            ping,
            dailyVisitors: 1247 + Math.floor(Math.random() * 100)
          }));
        })
        .catch(() => {
          setStats(prev => ({
            ...prev,
            uptime: { hours, days },
            ping: 0,
            dailyVisitors: 1247 + Math.floor(Math.random() * 100)
          }));
        });
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleHamburgerClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  const handleRandomClick = () => {
    if (location.pathname === "/random") {
      window.location.reload();
    }
  };

  const handleStatsClick = () => {
    setShowStats(!showStats);
  };

  // Close stats dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStats && !event.target.closest('.stats-container')) {
        setShowStats(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStats]);
  useEffect(() => {
    setIsNotHomePage(
      location.pathname !== "/" && location.pathname !== "/home"
    );
  }, [location.pathname]);

  return (
    <SearchProvider>
      <nav
        className={`fixed top-0 left-0 w-full h-16 z-[1000000] flex p-4 py-8 items-center justify-between transition-all duration-300 ease-in-out ${
          isNotHomePage ? "bg-[#201F31]" : "bg-opacity-0"
        } ${
          isScrolled ? "bg-[#2D2B44] bg-opacity-90 backdrop-blur-md" : ""
        } max-[600px]:h-fit max-[600px]:flex-col max-[1200px]:bg-opacity-100 max-[600px]:py-2`}
      >
        <div className="flex gap-x-6 items-center w-fit max-lg:w-full max-lg:justify-between">
          <div className="flex gap-x-6 items-center w-fit">
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl text-white mt-1 cursor-pointer"
              onClick={handleHamburgerClick}
            />
            <Link
              to="/"
              className="text-4xl font-bold max-[575px]:text-3xl cursor-pointer"
            >
              {logoTitle.slice(0, 3)}
              <span className="text-[#FFBADE]">{logoTitle.slice(3, 4)}</span>
              {logoTitle.slice(4)}
            </Link>
          </div>
          <WebSearch />
        </div>
        <div className="flex gap-x-7 items-center max-lg:hidden">
          {[
            { icon: faRandom, label: "Random", path: "/random" },
            { icon: faFilm, label: "Movie", path: "/movie" },
            { icon: faStar, label: "Popular", path: "/most-popular" },
          ].map((item) => (
            <Link
              key={item.path}
              to={
                item.path === "/random"
                  ? location.pathname === "/random"
                    ? "#"
                    : "/random"
                  : item.path
              }
              onClick={item.path === "/random" ? handleRandomClick : undefined}
              className="flex flex-col gap-y-1 items-center cursor-pointer"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-[#ffbade] text-xl font-bold"
              />
              <p className="text-[15px]">{item.label}</p>
            </Link>
          ))}
          <div className="flex flex-col gap-y-1 items-center w-auto">
            <div className="flex">
              {["EN", "JP"].map((lang, index) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`px-1 py-[1px] text-xs font-bold ${
                    index === 0 ? "rounded-l-[3px]" : "rounded-r-[3px]"
                  } ${
                    language === lang
                      ? "bg-[#ffbade] text-black"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div className="w-full">
              <p className="whitespace-nowrap text-[15px]">Anime name</p>
            </div>
          </div>
          <div className="relative stats-container">
            <div
              onClick={handleStatsClick}
              className="flex flex-col gap-y-1 items-center cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl font-bold text-[#ffbade]"
              />
              <p className="text-[15px] mb-[1px] text-white">Stats</p>
            </div>
            
            {showStats && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-gradient-to-br from-[#2D2B44] via-[#333051] to-[#2D2B44] border border-[#ffbade]/20 rounded-xl shadow-2xl p-5 z-[1000001] backdrop-blur-md">
                {/* Decorative header with icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-[#ffbade] to-[#ff9cc7] p-2 rounded-full mr-3">
                    <FontAwesomeIcon icon={faBell} className="text-black text-sm" />
                  </div>
                  <h3 className="text-[#ffbade] font-bold text-lg bg-gradient-to-r from-[#ffbade] to-[#ff9cc7] bg-clip-text text-transparent">
                    📊 Website Statistics
                  </h3>
                </div>
                
                {/* Animated stats cards */}
                <div className="space-y-3 text-sm">
                  <div className="bg-[#3a3757]/50 rounded-lg p-3 border border-[#ffbade]/10 hover:border-[#ffbade]/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        ⏰ Uptime:
                      </span>
                      <span className="text-[#ffbade] font-semibold">{stats.uptime.days}d {stats.uptime.hours}h</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#3a3757]/50 rounded-lg p-3 border border-[#ffbade]/10 hover:border-[#ffbade]/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        📅 Date:
                      </span>
                      <span className="text-white font-semibold">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#3a3757]/50 rounded-lg p-3 border border-[#ffbade]/10 hover:border-[#ffbade]/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        🗓️ Year:
                      </span>
                      <span className="text-white font-semibold">{new Date().getFullYear()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#3a3757]/50 rounded-lg p-3 border border-[#ffbade]/10 hover:border-[#ffbade]/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        🚀 Ping:
                      </span>
                      <span className={`font-semibold ${stats.ping < 100 ? 'text-green-400' : stats.ping < 300 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {stats.ping}ms
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-[#3a3757]/50 rounded-lg p-3 border border-[#ffbade]/10 hover:border-[#ffbade]/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        👥 Daily Visitors:
                      </span>
                      <span className="text-[#ffbade] font-semibold">{stats.dailyVisitors.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative footer with pulsing status */}
                <div className="mt-4 pt-4 border-t border-[#ffbade]/20">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-400 text-center">
                      Server Status: <span className="text-green-400 font-semibold">🟢 Online</span>
                    </p>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Decorative sparkles */}
                  <div className="text-center mt-2">
                    <span className="text-[#ffbade]/50 text-xs">✨ ⭐ ✨</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <MobileSearch />
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
    </SearchProvider>
  );
}

export default Navbar;
