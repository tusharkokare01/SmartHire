import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, X } from 'lucide-react';

const ExtraSectionsForm = () => {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "extraSections"
    });

    // Helper component to manage items within a section
    const SectionItemsManager = ({ nestIndex }) => {
        // Watch the specific section's items
        const currentItems = watch(`extraSections.${nestIndex}.items`) || [];
        const [newItem, setNewItem] = useState('');

        const addItem = () => {
            if (newItem.trim()) {
                const updated = [...currentItems, newItem.trim()];
                setValue(`extraSections.${nestIndex}.items`, updated);
                setNewItem('');
            }
        };

        const removeItem = (itemToRemove) => {
            const updated = currentItems.filter(i => i !== itemToRemove);
            setValue(`extraSections.${nestIndex}.items`, updated);
        };

        return (
            <div className="mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Items</p>
                
                {/* List */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {currentItems.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm flex items-center gap-2">
                            {item}
                            <button type="button" onClick={() => removeItem(item)} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3"/></button>
                        </span>
                    ))}
                    {currentItems.length === 0 && <span className="text-slate-400 text-sm italic">No items yet...</span>}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input 
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                        placeholder="Add item (e.g. 'Member of Club')..."
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-emerald-500"
                    />
                    <button type="button" onClick={addItem} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium">Add</button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Extra Sections</h2>
                    <p className="text-sm text-slate-500">Awards, Hobbies, Volleyball, Volunteering, etc.</p>
                </div>
                <button
                    type="button"
                    onClick={() => append({ title: '', items: [] })}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Section
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="border-2 border-slate-100 rounded-xl p-4 bg-slate-50 relative">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="mb-4 pr-8">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section Title</label>
                            <input
                                {...register(`extraSections.${index}.title`)}
                                placeholder="e.g. Achievements"
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 outline-none font-bold"
                            />
                        </div>

                        <SectionItemsManager nestIndex={index} />
                    </div>
                ))}
                {fields.length === 0 && <p className="text-slate-400 text-center py-4">No extra sections added.</p>}
            </div>
        </div>
    );
};

export default ExtraSectionsForm;
