import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';

const StrengthsForm = () => {
    const { watch, setValue } = useFormContext();
    const currentStrengths = watch('strengths') || [];
    const [customStrength, setCustomStrength] = useState('');

    const addStrength = (item) => {
        if (item && !currentStrengths.includes(item)) {
            setValue('strengths', [...currentStrengths, item]);
        }
    };

    const removeStrength = (itemToRemove) => {
        setValue('strengths', currentStrengths.filter(i => i !== itemToRemove));
    };

    const handleAdd = () => {
        if (customStrength.trim()) {
            addStrength(customStrength.trim());
            setCustomStrength('');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Strengths & Soft Skills</h2>
                <p className="text-sm text-slate-500">Add key strengths (e.g., Leadership, Problem Solving)</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                {currentStrengths.length === 0 && (
                    <span className="text-slate-400 text-sm italic">No strengths added...</span>
                )}
                {currentStrengths.map((item, index) => (
                    <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium border border-purple-200 flex items-center gap-2 group"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={() => removeStrength(item)}
                            className="hover:text-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={customStrength}
                    onChange={(e) => setCustomStrength(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                    placeholder="Add a strength..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-purple-500 outline-none"
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

export default StrengthsForm;
