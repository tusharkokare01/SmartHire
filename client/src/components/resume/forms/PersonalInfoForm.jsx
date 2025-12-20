import React from 'react';
import { useFormContext } from 'react-hook-form';

const PersonalInfoForm = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input
                        {...register('personalInfo.fullName')}
                        placeholder="Full Name"
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.personalInfo?.fullName ? 'border-red-500' : 'border-slate-300 focus:border-emerald-500'
                            }`}
                    />
                    {errors.personalInfo?.fullName && (
                        <p className="text-red-500 text-xs mt-1">{errors.personalInfo.fullName.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register('personalInfo.email')}
                        placeholder="Email"
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.personalInfo?.email ? 'border-red-500' : 'border-slate-300 focus:border-emerald-500'
                            }`}
                    />
                    {errors.personalInfo?.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.personalInfo.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register('personalInfo.phone')}
                        placeholder="Phone"
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.personalInfo?.phone ? 'border-red-500' : 'border-slate-300 focus:border-emerald-500'
                            }`}
                    />
                    {errors.personalInfo?.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.personalInfo.phone.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register('personalInfo.address')}
                        placeholder="Address"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-emerald-500 outline-none"
                    />
                </div>

                <div>
                    <input
                        {...register('personalInfo.linkedin')}
                        placeholder="LinkedIn URL"
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.personalInfo?.linkedin ? 'border-red-500' : 'border-slate-300 focus:border-emerald-500'
                            }`}
                    />
                    {errors.personalInfo?.linkedin && (
                        <p className="text-red-500 text-xs mt-1">{errors.personalInfo.linkedin.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register('personalInfo.github')}
                        placeholder="GitHub URL"
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.personalInfo?.github ? 'border-red-500' : 'border-slate-300 focus:border-emerald-500'
                            }`}
                    />
                    {errors.personalInfo?.github && (
                        <p className="text-red-500 text-xs mt-1">{errors.personalInfo.github.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
