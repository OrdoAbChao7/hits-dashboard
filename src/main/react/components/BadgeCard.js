import React, { useRef, useState } from "react";

export default function BadgeCard(props) {
    const valueRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        const text = valueRef.current ? valueRef.current.textContent : "";
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1500);
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    };

    const fallbackCopy = (text) => {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            console.error('Failed to copy', e);
        }
    };

    const content = typeof props.render === 'function' ? props.render() : props.render;

    return (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm transition-all duration-150">
            {/* Header bar */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500/70" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{props.title}</p>
                </div>
                <button
                    type="button"
                    onClick={copyToClipboard}
                    aria-label={`Copy ${props.title} code`}
                    className="cursor-pointer inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    {copied ? (
                        <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs font-semibold">Copied</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy</span>
                        </div>
                    )}
                </button>
            </div>
            {/* Code content */}
            <div className="p-3.5 bg-slate-900 dark:bg-black/40 overflow-x-auto">
                <code className="text-xs sm:text-sm text-slate-200 font-mono whitespace-pre select-all block leading-relaxed" ref={valueRef}>
                    {content}
                </code>
            </div>
        </div>
    );
}