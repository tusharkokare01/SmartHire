import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { User, ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const updatePayload = {
                name: formData.name,
                bio: formData.bio,
                email: formData.email
            };

            const res = await api.put('/auth/me', updatePayload);

            const token = localStorage.getItem('token');
            if (token) {
                const updatedUser = { ...user, ...res.data };
                login(updatedUser, token);
            }

            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout role="candidate">
            <div className="max-w-xl mx-auto p-8 space-y-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Settings
                </button>

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Profile Information</h1>
                    <p className="text-slate-500">Update your public profile details.</p>
                </div>

                {/* Success message */}
                {success && (
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {success}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-emerald-500" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Field (Read Only) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Email Address <span className="text-xs text-slate-400 ml-1">(Read-only)</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none text-slate-500 font-medium cursor-not-allowed"
                        />
                    </div>

                    {/* Bio Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Bio / Headline</label>
                        <textarea
                            rows="4"
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                            placeholder="Tell us about yourself..."
                        />
                        <p className="text-xs text-slate-400 mt-2 text-right">{formData.bio.length}/500</p>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ProfileSettings;
