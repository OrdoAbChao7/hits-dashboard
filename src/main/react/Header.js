import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./context/ThemeContext";
import { normalize } from "./utils/UniformedResourceNameUtils";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URI}/hits.sh.svg`).catch(error => {
            console.error(error);
        });
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const staticRoutes = ['/', '/about', '/about/', '/docs', '/docs/', '/showcase', '/showcase/', '/changelog', '/changelog/', '/faq', '/faq/', '/privacy', '/privacy/', '/terms', '/terms/'];
    const isStatsPage = !staticRoutes.includes(location.pathname);
    const targetUrn = isStatsPage ? decodeURI(normalize(location.pathname)) : null;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/5 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-md transition-colors duration-150">
            <nav className="container max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Brand & Context */}
                <div className="flex items-center space-x-3 min-w-0">
                    <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                        <div aria-label="Header. logo" role="img" className="shrink-0 transition-transform group-hover:scale-[1.02]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="84" height="24" role="img" aria-label="HITS: &#8734;">
                                <title>HITS: &#8734;</title>
                                <g shapeRendering="crispEdges">
                                    <rect width="50.00" height="24" fill="#334155" />
                                    <rect x="50.00" width="34.00" height="24" fill="#2563EB" />
                                </g>
                                <g fill="#fff" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" textRendering="geometricPrecision" fontSize="85">
                                    <text transform="scale(.1)" x="250" y="150" textLength="280" fill="#fff" fontWeight="600">HITS</text>
                                    <text transform="scale(.1)" x="670" y="150" textLength="110" fill="#fff" fontWeight="bold">&#8734;</text>
                                </g>
                            </svg>
                        </div>
                    </Link>

                    {/* Slash separator & Analytics / Target Context */}
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline select-none">/</span>
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 hidden sm:inline">
                        Analytics
                    </span>

                    {targetUrn && (
                        <a
                            href={`https://${targetUrn}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title={`Open https://${targetUrn}`}
                        >
                            <span>Target</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Right controls: Nav links + Theme toggle + Mobile Menu */}
                <div className="flex items-center space-x-1 sm:space-x-3">
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300 mr-2">
                        <Link to="/about/" className="hover:text-blue-600 dark:hover:text-white transition-colors">About</Link>
                        <Link to="/docs/" className="hover:text-blue-600 dark:hover:text-white transition-colors">Docs</Link>
                        <Link to="/showcase/" className="hover:text-blue-600 dark:hover:text-white transition-colors">Showcase</Link>
                        <Link to="/changelog/" className="hover:text-blue-600 dark:hover:text-white transition-colors">Changelog</Link>
                        <Link to="/faq/" className="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ</Link>
                    </div>

                    {/* Theme Switcher Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === 'dark' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0F19] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
                    {targetUrn && (
                        <div className="pb-3 border-b border-slate-200 dark:border-white/10">
                            <a href={`https://${targetUrn}`} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-xs font-sans inline-flex items-center space-x-1">
                                <span>Visit Target Page</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    )}
                    <div className="flex flex-col space-y-3 text-base font-medium text-slate-700 dark:text-slate-300">
                        <Link to="/about/" className="hover:text-blue-600 dark:hover:text-white py-1 transition-colors" onClick={closeMenu}>About</Link>
                        <Link to="/docs/" className="hover:text-blue-600 dark:hover:text-white py-1 transition-colors" onClick={closeMenu}>Docs</Link>
                        <Link to="/showcase/" className="hover:text-blue-600 dark:hover:text-white py-1 transition-colors" onClick={closeMenu}>Showcase</Link>
                        <Link to="/changelog/" className="hover:text-blue-600 dark:hover:text-white py-1 transition-colors" onClick={closeMenu}>Changelog</Link>
                        <Link to="/faq/" className="hover:text-blue-600 dark:hover:text-white py-1 transition-colors" onClick={closeMenu}>FAQ</Link>
                        <Link to="/privacy/" className="hover:text-blue-600 dark:hover:text-white py-1 transition-colors" onClick={closeMenu}>Privacy Policy</Link>
                        <Link to="/terms/" className="hover:text-blue-600 dark:hover:text-white py-1 transition-colors" onClick={closeMenu}>Terms of Service</Link>
                    </div>
                </div>
            )}
        </header>
    );
}