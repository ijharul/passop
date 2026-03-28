import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const token = localStorage.getItem("token");
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    fetch("https://passop-8ewz.onrender.com");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 bg-green-50">
        {!token ? (
          <div className="flex justify-center items-center h-full pt-20">
            {showLogin ? (
              <Login setShowLogin={setShowLogin} />
            ) : (
              <Signup setShowLogin={setShowLogin} />
            )}
          </div>
        ) : (
          <Manager />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
