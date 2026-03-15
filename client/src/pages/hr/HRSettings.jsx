import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HRLayout from '../../components/common/HRLayout';
import { User, Bell, Lock, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { ROUTES } from '../../utils/constants';

const HRSettings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // -- STATES --
    const [activeSection, setActiveSection] = useState(null);
    const [prefs, setPrefs] = useState({
        notifications: user?.notifications || { email: true, push: true },
        language: user?.language || 'en-US'
    });

    // -- HANDLERS --
    const toggleSection = (section) => setActiveSection(activeSection === section ? null : section);

    const handlePrefChange = async (key, val, nestedKey = null) => {
        // Optimistic UI
        let newPrefs = { ...prefs };
        if (nestedKey) {
            newPrefs[key] = { ...newPrefs[key], [nestedKey]: val };
        } else {
            newPrefs[key] = val;
        }
        setPrefs(newPrefs);

        try {
            // Save to backend
            await api.put('/auth/preferences', newPrefs);
        } catch (e) { console.error('Failed to save pref'); }
    };

    return (
        <HRLayout>
            <div className="max-w-3xl mx-auto p-8 space-y-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* 1. Profile Section */}
                    <div className="border-b border-slate-100">
                        <button onClick={() => navigate(ROUTES.HR_PROFILE)} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><User className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">Profile Information</h3>
                                <p className="text-sm text-slate-500">Update your name, email, and bio.</p>
                            </div>
                        </button>
                    </div>

                    {/* 2. Notifications Section */}
                    <div className="border-b border-slate-100">
                        <button onClick={() => toggleSection('notifications')} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Bell className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">Notifications</h3>
                                <p className="text-sm text-slate-500">Manage email and push preferences.</p>
                            </div>
                        </button>
                        {activeSection === 'notifications' && (
                            <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-700">Email Notifications</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={prefs.notifications.email} onChange={e => handlePrefChange('notifications', e.target.checked, 'email')} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-700">Push Notifications</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={prefs.notifications.push} onChange={e => handlePrefChange('notifications', e.target.checked, 'push')} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Security Section */}
                    <div className="border-b border-slate-100">
                        <button onClick={() => navigate(ROUTES.HR_CHANGE_PASSWORD)} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Lock className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">Security</h3>
                                <p className="text-sm text-slate-500">Change password and 2FA.</p>
                            </div>
                        </button>
                    </div>

                    {/* 4. Language Section */}
                    <div>
                        <button onClick={() => toggleSection('language')} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Globe className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">Language & Region</h3>
                                <p className="text-sm text-slate-500">English (US) • Mumbai, India</p>
                            </div>
                        </button>
                        {activeSection === 'language' && (
                            <div className="px-6 pb-6 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Interface Language</label>
                                <select
                                    value={prefs.language}
                                    onChange={e => handlePrefChange('language', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border-none font-medium"
                                >
                                    <option value="en-US">English (United States)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* 5. Logout Section */}
                    <div className="border-t border-slate-100">
                        <button onClick={() => {
                            logout();
                            navigate(ROUTES.LOGIN);
                        }} className="w-full text-left p-6 flex items-center gap-4 hover:bg-red-50 transition-colors group">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100 transition-colors"><LogOut className="w-5 h-5" /></div>
                            <div>
                                <h3 className="font-bold text-red-600">Log Out</h3>
                                <p className="text-sm text-red-400">Sign out of your account.</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="text-center text-slate-400 text-sm">
                    Smart Career hub Enterprise v3.0.0
                </div>
            </div>
        </HRLayout>
    );
};

export default HRSettings;

