import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Docs from './pages/Docs';
import Showcase from './pages/Showcase';
import Changelog from './pages/Changelog';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Dashboard from './Dashboard';
import Footer from './Footer';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
    return (
        <ThemeProvider>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-150">
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/docs" element={<Docs />} />
                        <Route path="/showcase" element={<Showcase />} />
                        <Route path="/changelog" element={<Changelog />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="*" element={<Dashboard />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </ThemeProvider>
    );
}