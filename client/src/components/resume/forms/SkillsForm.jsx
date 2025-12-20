import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';

const SKILL_CATEGORIES = {
    "Languages": ["Java", "Python", "C++", "PHP", "SQL", "JavaScript", "TypeScript", "Go", "Rust", "Swift"],
    "Web Technologies": ["HTML5", "CSS3", "React", "Angular", "Vue.js", "Node.js", "Express", "Next.js", "Tailwind CSS"],
    "Data & Cloud": ["Data Structures", "Algorithms", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Firebase"],
    "Tools": ["Git", "Jira", "Figma", "VS Code", "Postman"]
};

const SkillsForm = () => {
    const { register, watch, setValue } = useFormContext();
    const currentSkills = watch('skills') || [];
    const [customSkill, setCustomSkill] = useState('');

    const addSkill = (skill) => {
        if (skill && !currentSkills.includes(skill)) {
            setValue('skills', [...currentSkills, skill]);
        }
    };

    const removeSkill = (skillToRemove) => {
        setValue('skills', currentSkills.filter(s => s !== skillToRemove));
    };

    const handleAddCustomSkill = () => {
        if (customSkill.trim()) {
            addSkill(customSkill.trim());
            setCustomSkill('');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Skills & Tools</h2>
                <p className="text-sm text-slate-500">Select relevant technical skills, tools, and technologies or add your own</p>
            </div>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                {currentSkills.length === 0 && (
                    <span className="text-slate-400 text-sm italic">No skills selected yet...</span>
                )}
                {currentSkills.map((skill, index) => (
                    <span
                        key={index}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200 flex items-center gap-2 group"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Quick Add Categories */}
            <div className="space-y-4 mb-6">
                {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                    <div key={category}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => {
                                const isSelected = currentSkills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => isSelected ? removeSkill(skill) : addSkill(skill)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${isSelected
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
                    placeholder="Add a custom skill or tool (e.g. AWS, Figma, Python)..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 outline-none"
                />
                <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default SkillsForm;
