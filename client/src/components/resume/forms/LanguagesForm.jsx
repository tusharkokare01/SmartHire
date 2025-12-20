import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { X, Plus } from 'lucide-react';

const LanguagesForm = () => {
    const { watch, setValue } = useFormContext();
    const currentLanguages = watch('languages') || [];
    const [customLanguage, setCustomLanguage] = useState('');

    const addLanguage = (lang) => {
        if (lang && !currentLanguages.includes(lang)) {
            setValue('languages', [...currentLanguages, lang]);
        }
    };

    const removeLanguage = (langToRemove) => {
        setValue('languages', currentLanguages.filter(l => l !== langToRemove));
    };

    const handleAdd = () => {
        if (customLanguage.trim()) {
            addLanguage(customLanguage.trim());
            setCustomLanguage('');
        }
    };

    // Common languages for quick add
    const commonLanguages = ["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Hindi", "Arabic"];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Languages</h2>
                <p className="text-sm text-slate-500">Add languages you speak</p>
            </div>

            {/* Selected Languages */}
            <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                {currentLanguages.length === 0 && (
                    <span className="text-slate-400 text-sm italic">No languages added...</span>
                )}
                {currentLanguages.map((lang, index) => (
                    <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 flex items-center gap-2 group"
                    >
                        {lang}
                        <button
                            type="button"
                            onClick={() => removeLanguage(lang)}
                            className="hover:text-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Quick Add */}
            <div className="mb-4">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common</p>
                 <div className="flex flex-wrap gap-2">
                    {commonLanguages.map(lang => (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => currentLanguages.includes(lang) ? removeLanguage(lang) : addLanguage(lang)}
                            className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                                currentLanguages.includes(lang) 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                            }`}
                        >
                            {lang}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                    placeholder="Add other language..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default LanguagesForm;
