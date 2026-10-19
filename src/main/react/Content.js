import React from "react";
import SimpleDropdown from "./components/SimpleDropdown";
import BadgeCard from "./components/BadgeCard";
import Utils from "./utils/Utils";
import { normalize } from "./utils/UniformedResourceNameUtils";
import ColorPicker from "./components/ColorPicker";
import { Link } from "react-router-dom";

export default function Content(props) {
    const [url, setUrl] = React.useState(props.url ? props.url : "");
    const [view, setView] = React.useState("total");
    const [style, setStyle] = React.useState("flat");
    const [label, setLabel] = React.useState("");
    const [extraCount, setExtraCount] = React.useState("");
    const [color, setColor] = React.useState("");
    const [labelColor, setLabelColor] = React.useState("");
    const [logo, setLogo] = React.useState("");

    const NO_URL_SPECIFIED = "No URL specified";
    const INVALID_URL = "Invalid URL";

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleViewChange = (e) => {
        setView(e.target.value);
    };

    const handleStyleChange = (e) => {
        setStyle(e.target.value);
    };

    const handleLabelChange = (e) => {
        setLabel(e.target.value);
    };

    const handleNumberKeyPress = (e) => {
        if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
            return;
        }

        if (!/^[0-9]*$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleExtraCountChange = (e) => {
        setExtraCount(e.target.value);
    };

    const handleColorChange = (c) => {
        setColor(c);
    };

    const handleLabelColorChange = (c) => {
        setLabelColor(c);
    };

    const handleLogoChange = (e) => {
        setLogo(e.target.value);
    };

    const toQueryString = () => {
        return Utils.toQueryString({
            view: view,
            style: style,
            label: label,
            extraCount: extraCount,
            color: color,
            labelColor: labelColor,
            logo: logo
        });
    };

    const isValidUrl = () => {
        if (url.trim().length > 0 && url.includes(".") && url[0] !== "." && url[url.length - 1] !== ".") {
            return true;
        }
        return false;
    };

    const toMarkdown = () => {
        if (url.trim().length === 0) {
            return NO_URL_SPECIFIED;
        } else if (!isValidUrl()) {
            return INVALID_URL;
        }
        return `[![Hits](https://hits.sh/${normalize(url)}.svg${toQueryString()})](https://hits.sh/${normalize(url)}/)`;
    };

    const toHTML = () => {
        if (url.trim().length === 0) {
            return NO_URL_SPECIFIED;
        } else if (!isValidUrl()) {
            return INVALID_URL;
        }
        return `<a href="https://hits.sh/${normalize(url)}/"><img alt="Hits" src="https://hits.sh/${normalize(url)}.svg${toQueryString()}"/></a>`;
    };

    const toImageLink = () => {
        if (url.trim().length === 0) {
            return NO_URL_SPECIFIED;
        } else if (!isValidUrl()) {
            return INVALID_URL;
        }
        return `https://hits.sh/${normalize(url)}.svg${toQueryString()}`;
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Input & Options (7 cols on lg) */}
                <div className="lg:col-span-6 space-y-6">
                    {/* URL Input Group */}
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-3">
                        <label htmlFor="url" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Target URL / Identifier
                        </label>
                        <div className="relative w-full flex items-center">
                            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                ref={props.inputRef}
                                id="url"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg h-11 pl-9 pr-4 text-sm font-mono transition-all shadow-sm"
                                placeholder="https://github.com/silentsoft/hits"
                                value={url}
                                onChange={handleUrlChange}
                            />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Supports GitHub repositories, profiles, documentation sites, or any unique Web identifier.
                        </p>
                    </div>

                    {/* Options Panel */}
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                <span>Badge Customization</span>
                            </h3>
                            <span className="text-xs text-slate-400">Live Config</span>
                        </div>

                        <div className="space-y-4">
                            {/* View Type */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">View Type</label>
                                <div className="w-full sm:w-52">
                                    <SimpleDropdown items={['total', 'today-total']} value={view} onChange={handleViewChange} />
                                </div>
                            </div>

                            {/* Style */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Badge Style</label>
                                <div className="w-full sm:w-52">
                                    <SimpleDropdown items={['flat', 'flat-square', 'for-the-badge', 'plastic']} value={style} onChange={handleStyleChange} />
                                </div>
                            </div>

                            {/* Custom Label */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Label Text</label>
                                <div className="w-full sm:w-52">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-sm"
                                        placeholder="hits"
                                        value={label}
                                        onChange={handleLabelChange}
                                    />
                                </div>
                            </div>

                            {/* Extra Count */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex flex-col">
                                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Extra Count</label>
                                    <span className="text-[11px] text-slate-400">Migrate from previous hit counter</span>
                                </div>
                                <div className="w-full sm:w-52">
                                    <input
                                        type="number"
                                        min={0}
                                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-sm font-mono"
                                        placeholder="0"
                                        value={extraCount}
                                        onKeyPress={handleNumberKeyPress}
                                        onChange={handleExtraCountChange}
                                    />
                                </div>
                            </div>

                            {/* Color */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Badge Color</label>
                                <div className="w-full sm:w-52">
                                    <ColorPicker color="#4c1" onChange={handleColorChange} />
                                </div>
                            </div>

                            {/* Label Color */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Label Color</label>
                                <div className="w-full sm:w-52">
                                    <ColorPicker color="#555" onChange={handleLabelColorChange} />
                                </div>
                            </div>

                            {/* Logo */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex flex-col">
                                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Logo</label>
                                    <span className="text-[11px] text-slate-400">Simple-Icons slug or base64</span>
                                </div>
                                <div className="w-full sm:w-52">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-sm"
                                        placeholder="slug or base64"
                                        value={logo}
                                        onChange={handleLogoChange}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <a
                                    href="https://github.com/simple-icons/simple-icons/blob/develop/slugs.md"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center transition-colors"
                                >
                                    <span>Browse available slugs</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Preview Stage & Code Generation (6 cols on lg) */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-6">
                        {/* Preview stage */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>Real-time Preview</span>
                                </h3>
                                {isValidUrl() && (
                                    <a
                                        href={`${process.env.REACT_APP_URI}/${normalize(url)}.preview${toQueryString()}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center space-x-1"
                                    >
                                        <span>Open SVG</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-col justify-center items-center min-h-[110px] bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-300 dark:border-white/10 p-6 transition-all">
                                {isValidUrl() ? (
                                    <div className="flex flex-col items-center space-y-2">
                                        <Link to={`/${normalize(url)}/`} className="hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
                                            <img
                                                src={`${process.env.REACT_APP_URI}/${normalize(url)}.preview${toQueryString()}`}
                                                alt="Badge Preview"
                                                className="max-w-full h-auto"
                                            />
                                        </Link>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Click to navigate to stats page</span>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-400 dark:text-slate-500 text-xs py-2">
                                        <svg className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        Enter a valid URL to see badge preview
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Embed Code Snippets */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Embed Codes
                            </h4>
                            <div className="space-y-3">
                                <BadgeCard title="Markdown" render={toMarkdown} />
                                <BadgeCard title="HTML" render={toHTML} />
                                <BadgeCard title="Image Link" render={toImageLink} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}