import React from "react";

export default function SimpleDropdown(props) {
    return (
        <div className="w-full relative">
            <select
                data-testid="select"
                onChange={props.onChange}
                value={props.value}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer hover:border-slate-400 dark:hover:border-white/20 transition-colors shadow-sm"
            >
                {props.items?.map((item, index) => {
                    return (
                        <option key={index} value={item} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                            {item}
                        </option>
                    );
                })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}