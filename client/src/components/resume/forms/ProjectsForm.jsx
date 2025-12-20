import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const ProjectsForm = () => {
    const { register, control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "projects"
    });

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-slate-900">Projects</h2>
                <button
                    type="button"
                    onClick={() => append({ name: '', technologies: '', link: '', description: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add
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

                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <input
                                    {...register(`projects.${index}.name`)}
                                    placeholder="Project Name"
                                    className={`w-full px-4 py-2 border-2 rounded-lg outline-none ${errors.projects?.[index]?.name ? 'border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                                />
                                {errors.projects?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.projects[index].name.message}</p>}
                            </div>

                            <input
                                {...register(`projects.${index}.technologies`)}
                                placeholder="Technologies Used"
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 outline-none"
                            />

                            <div>
                                <input
                                    {...register(`projects.${index}.link`)}
                                    placeholder="Project Link (Optional)"
                                    className={`w-full px-4 py-2 border-2 rounded-lg outline-none ${errors.projects?.[index]?.link ? 'border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                                />
                                {errors.projects?.[index]?.link && <p className="text-red-500 text-xs mt-1">{errors.projects[index].link.message}</p>}
                            </div>

                            <textarea
                                {...register(`projects.${index}.description`)}
                                placeholder="Description"
                                rows={3}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 outline-none resize-none"
                            />
                        </div>
                    </div>
                ))}
                {fields.length === 0 && <p className="text-slate-400 text-center py-4">No projects added yet</p>}
            </div>
        </div>
    );
};

export default ProjectsForm;
