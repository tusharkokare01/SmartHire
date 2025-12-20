import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { Lock, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { ROUTES } from '../../utils/constants';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [passData, setPassData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passData.newPassword !== passData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        if (passData.newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passData.currentPassword,
                newPassword: passData.newPassword
            });
            setSuccess('Password changed successfully!');
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout role="candidate">
            <div className="max-w-xl mx-auto p-8 space-y-8">
                <button
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Change Password</h1>
                    <p className="text-slate-500">Ensure your account is secure with a strong password.</p>
                </div>

                {success && (
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-emerald-500" />
                            <input
                                type="password"
                                value={passData.currentPassword}
                                onChange={e => setPassData({ ...passData, currentPassword: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-emerald-500" />
                            <input
                                type="password"
                                value={passData.newPassword}
                                onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-emerald-500" />
                            <input
                                type="password"
                                value={passData.confirmPassword}
                                onChange={e => setPassData({ ...passData, confirmPassword: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ChangePassword;
