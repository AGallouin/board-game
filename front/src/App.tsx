// Base
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages & Components
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';

// Styles
import './App.css';


function App() {
    
    return (
        <div className="App">

            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
