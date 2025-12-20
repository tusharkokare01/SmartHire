import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
    const { register, control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education"
    });

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-slate-900">Education</h2>
                <button
                    type="button"
                    onClick={() => append({ degree: '', institution: '', year: '', gpa: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="border-2 border-slate-100 rounded-xl p-4 bg-slate-50 relative group">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <input
                                    {...register(`education.${index}.degree`)}
                                    placeholder="Degree"
                                    className={`w-full px-4 py-2 border-2 rounded-lg outline-none ${errors.education?.[index]?.degree ? 'border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                                />
                                {errors.education?.[index]?.degree && <p className="text-red-500 text-xs mt-1">{errors.education[index].degree.message}</p>}
                            </div>

                            <div>
                                <input
                                    {...register(`education.${index}.institution`)}
                                    placeholder="Institution"
                                    className={`w-full px-4 py-2 border-2 rounded-lg outline-none ${errors.education?.[index]?.institution ? 'border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                                />
                                {errors.education?.[index]?.institution && <p className="text-red-500 text-xs mt-1">{errors.education[index].institution.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    {...register(`education.${index}.year`)}
                                    placeholder="Year"
                                    className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 outline-none"
                                />
                                <input
                                    {...register(`education.${index}.gpa`)}
                                    placeholder="GPA"
                                    className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {fields.length === 0 && <p className="text-slate-400 text-center py-4">No education added yet</p>}
            </div>
        </div>
    );
};

export default EducationForm;
