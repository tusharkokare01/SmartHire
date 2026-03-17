import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { User, Bell, Lock, Globe, Crown, LogOut, Gift, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { ROUTES } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const Settings = () => {
    const { user, login, refreshUser } = useAuth();
    const navigate = useNavigate();

    // -- STATES --
    const [activeSection, setActiveSection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState('');
    const [feedbackForm, setFeedbackForm] = useState({
        type: 'General Feedback',
        subject: '',
        message: '',
        rating: 5
    });

    const [prefs, setPrefs] = useState({
        notifications: user?.notifications || { email: true, push: true },
        language: user?.language || 'en-US',
        twoFactor: user?.twoFactor || false
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

    const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your Pro membership? You will lose access to premium features.')) return;
        
        setLoading(true); setSuccess('');
        try {
            await api.post('/payment/cancel-subscription');
            setSuccess('Subscription canceled successfully.');
            
            // Refresh user data from server to sync state
            await refreshUser();
            
            // Optional: Redirect or just let the UI update (since user state changes, UI will reflect it)
        } catch (e) { 
            console.error(e);
            const msg = e.response?.data?.message || 'Failed to cancel subscription';
            alert(`Error: ${msg}`); 
        } finally { setLoading(false); }
    };

    const handleRedeemCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setCouponLoading(true);
        setCouponError('');
        try {
            const validateUrl = `${import.meta.env.VITE_API_URL}/payment/validate-coupon`;
            const { data } = await axios.post(validateUrl, {
                couponCode: couponCode.trim()
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (data.valid) {
                setAppliedCoupon(data);
                // Redeem on server immediately so coupon stays only in Settings > Membership flow.
                const orderUrl = `${import.meta.env.VITE_API_URL}/payment/create-order`;
                const { data: order } = await axios.post(orderUrl, {
                    amount: 50,
                    currency: 'INR',
                    planName: 'Pro',
                    couponCode: data.coupon
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                if (order.isFreeUpgrade) {
                    await refreshUser();
                    setSuccess('Coupon redeemed successfully. Pro membership is now active.');
                    setCouponCode('');
                    toast.success('Free Pro access activated.');
                    return;
                }

                toast.info('Coupon validated. Please continue payment on Subscription page.');
                navigate(ROUTES.SUBSCRIPTION);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Invalid coupon code';
            setCouponError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackForm.subject.trim() || !feedbackForm.message.trim()) {
            alert('Please add both subject and message.');
            return;
        }

        setFeedbackLoading(true);
        setFeedbackSuccess('');
        try {
            await api.post('/feedback', {
                type: feedbackForm.type,
                subject: feedbackForm.subject,
                message: feedbackForm.message,
                rating: Number(feedbackForm.rating)
            });

            setFeedbackSuccess('Thank you. Your feedback has been submitted.');
            setFeedbackForm({
                type: 'General Feedback',
                subject: '',
                message: '',
                rating: 5
            });
        } catch (error) {
            console.error('Feedback submission failed', error);
            alert(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setFeedbackLoading(false);
        }
    };


    return (
        <Layout role="candidate">
            <div className="max-w-3xl mx-auto p-8 space-y-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

                {success && (
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-center gap-2 animate-in fade-in">
                        <User className="w-5 h-5" />
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* 1. Profile Section */}
                    <div className="border-b border-slate-100">
                        <button onClick={() => navigate(ROUTES.PROFILE_SETTINGS)} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><User className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">Profile Information</h3>
                                <p className="text-sm text-slate-500">Update your name, email, and bio.</p>
                            </div>
                        </button>
                    </div>


                    {/* 2. Membership Section */}
                    <div className="border-b border-slate-100">
                        <button onClick={() => toggleSection('membership')} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                            <div className={`p-3 rounded-xl transition-colors ${user?.subscriptionStatus === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Crown className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    Membership
                                    {user?.subscriptionStatus === 'active' && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">PRO ACTIVE</span>}
                                </h3>
                                <p className="text-sm text-slate-500">{user?.subscriptionStatus === 'active' ? 'You are a Pro member.' : 'Manage your subscription and billing.'}</p>
                            </div>
                        </button>
                        
                        {activeSection === 'membership' && (
                            <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-slate-500">Current Plan</span>
                                        <span className="font-bold text-slate-900 capitalize">{user?.subscriptionStatus === 'active' ? 'Pro Plan' : 'Free Plan'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Status</span>
                                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                                            user?.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {user?.subscriptionStatus === 'active' ? 'Active' : 'Free'}
                                        </span>
                                    </div>
                                </div>

                                {/* Coupon Redemption Section */}
                                {user?.subscriptionStatus !== 'active' && (
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Gift className="w-4 h-4 text-purple-600" />
                                            <h4 className="font-semibold text-slate-900 text-sm">Have a Coupon Code?</h4>
                                        </div>
                                        
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code..."
                                                value={couponCode}
                                                onChange={(e) => {
                                                    setCouponCode(e.target.value);
                                                    setCouponError('');
                                                }}
                                                className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                                            />
                                            <button
                                                onClick={handleRedeemCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-400 font-medium transition-colors text-sm whitespace-nowrap"
                                            >
                                                {couponLoading ? 'Checking...' : 'Redeem'}
                                            </button>
                                        </div>

                                        {couponError && (
                                            <p className="text-red-600 text-xs mb-2">{couponError}</p>
                                        )}
                                        
                                        {appliedCoupon && (
                                            <div className="p-2 bg-emerald-100 rounded-lg border border-emerald-300">
                                                <p className="text-emerald-700 font-semibold text-xs">
                                                    ✓ {appliedCoupon.description} ({appliedCoupon.discount}% off)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => navigate(ROUTES.SUBSCRIPTION)}
                                        className="flex-1 py-2 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        {user?.subscriptionStatus === 'active' ? 'View Details' : 'Upgrade to Pro'}
                                    </button>

                                    {user?.subscriptionStatus === 'active' && (
                                        <button 
                                            onClick={handleCancelSubscription}
                                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Notifications Section */}
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

                    {/* 4. Security Section */}
                    <div className="border-b border-slate-100">
                        <button onClick={() => navigate(ROUTES.CHANGE_PASSWORD)} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Lock className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">Security</h3>
                                <p className="text-sm text-slate-500">Change password and 2FA.</p>
                            </div>
                        </button>
                    </div>

                    {/* 5. Language Section */}
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

                    {/* 6. Feedback Section */}
                    <div className="border-t border-slate-100">
                        <button onClick={() => toggleSection('feedback')} className="w-full text-left p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><MessageSquare className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">Feedback & Suggestions</h3>
                                <p className="text-sm text-slate-500">Tell us what to improve or suggest a feature.</p>
                            </div>
                        </button>
                        {activeSection === 'feedback' && (
                            <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                                {feedbackSuccess && (
                                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium">
                                        {feedbackSuccess}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Type</label>
                                    <select
                                        value={feedbackForm.type}
                                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                                    >
                                        <option>General Feedback</option>
                                        <option>Suggestion</option>
                                        <option>Feature Request</option>
                                        <option>Bug Report</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={feedbackForm.subject}
                                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                                        placeholder="Short title for your feedback"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Message</label>
                                    <textarea
                                        value={feedbackForm.message}
                                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-medium min-h-[120px]"
                                        placeholder="Share details, issues, or ideas..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">App Rating</label>
                                    <select
                                        value={feedbackForm.rating}
                                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                                    >
                                        <option value={5}>5 - Excellent</option>
                                        <option value={4}>4 - Good</option>
                                        <option value={3}>3 - Average</option>
                                        <option value={2}>2 - Needs improvement</option>
                                        <option value={1}>1 - Poor</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleSubmitFeedback}
                                    disabled={feedbackLoading}
                                    className="w-full py-2.5 px-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-70 transition-colors"
                                >
                                    {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 7. Logout Section */}
                    <div className="border-t border-slate-100">
                        <button onClick={() => {
                            // Use AuthContext logout if available, otherwise clear storage and redirect
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
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
                    Smart Career hub v3.0.0
                </div>
            </div>
        </Layout>
    );
};

export default Settings;

