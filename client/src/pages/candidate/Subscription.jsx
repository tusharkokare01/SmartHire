import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft, Star, Zap, Shield } from 'lucide-react';
import Layout from '../../components/common/Layout';
import { ROUTES } from '../../utils/constants';

import axios from 'axios';
// import useRazorpay from 'react-razorpay'; 
// Using manual script load for stability
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Subscription = () => {
    console.log("Rendering Subscription Page");
    const { user, refreshUser } = useAuth();
    // const [Razorpay] = useRazorpay();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async (plan) => {
        console.log("handlePayment triggered for:", plan.name);
        if (plan.name !== 'Pro') return;

        setLoading(true);
        try {
            // 1. Create Order
            const orderUrl = `${import.meta.env.VITE_API_URL}/payment/create-order`;
            const { data: order } = await axios.post(orderUrl, {
                amount: 50, // 1 INR (Test Amount)
                currency: 'INR', // Razorpay supports INR best
                planName: plan.name
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log("Order created:", order);

            // 2. Open Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "Smart Career hub",
                description: "Pro Subscription Upgrade",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        console.log("PAYMENT SUCCESSFUL, STARTING VERIFICATION...");
                        // 3. Verify Payment
                        const verifyUrl = `${import.meta.env.VITE_API_URL}/payment/verify-payment`;
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planName: plan.name
                        };
                        console.log("Sending verification data:", verifyData);

                        const verifyRes = await axios.post(verifyUrl, verifyData, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });

                        console.log("Verification Response:", verifyRes.data);

                        if (verifyRes.data.success) {
                            console.log("Verification Success! Refreshing user...");
                            // Update user context immediately
                            await refreshUser();

                            // Double check if user is updated
                            const updatedUser = JSON.parse(localStorage.getItem('user'));
                            console.log("User after refresh:", updatedUser);

                            toast.success("Payment Successful! Welcome to Pro.");
                            // ideally update local user context or force reload
                            // setTimeout(() => window.location.reload(), 2000);
                        } else {
                            console.error("Verification returned false success");
                            toast.error("Payment Verification Failed.");
                        }
                    } catch (err) {
                        console.error("VERIFICATION ERROR:", err.response?.data || err);
                        toast.error("Payment verification failed on server.");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone || "" // Add phone if available
                },
                notes: {
                    address: "Smart Career hub HQ"
                },
                theme: {
                    color: "#059669" // matches emerald-600
                }
            };

            // CHECK FOR MOCK ORDER
            if (order.receipt && order.receipt.startsWith('rcpt_mock_')) {
                console.log("⚠️ Mock Order detected. Bypassing Razorpay SDK...");
                toast.info("Test Mode: Simulating successful payment...");
                
                // Simulate delay for realism
                setTimeout(() => {
                    const mockResponse = {
                        razorpay_order_id: order.id,
                        razorpay_payment_id: "pay_mock_" + Date.now(),
                        razorpay_signature: "mock_signature_bypass"
                    };
                    options.handler(mockResponse);
                }, 1500);
                return;
            }

            if (!window.Razorpay) {
                toast.error("Razorpay SDK failed to load. Please check your internet connection.");
                setLoading(false);
                return;
            }

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error(response.error.description);
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment Init Error", error);
            toast.error("Failed to initiate payment.");
        } finally {
            setLoading(false);
        }
    };

    const isPro = user?.subscriptionStatus === 'active';

    const plans = [
        {
            name: 'Free',
            price: '₹0',
            period: '/month',
            description: 'Perfect for getting started',
            features: [
                'Build 1 Resume',
                'Basic Templates',
                'PDF Download',
                'Basic Job Search'
            ],
            current: !isPro,
            buttonText: 'Current Plan',
            buttonVariant: 'outline'
        },
        {
            name: 'Pro',
            price: '₹50',
            period: '/month',
            description: 'Unlock your full potential',
            features: [
                'Unlimited Resumes',
                'All Premium Templates',
                'AI Resume Content Generation',
                'Smart Cover Letter Generator',
                'Mock Interview with AI (Resume Context)',
                'Resume Score Analysis',
                'Priority Support'
            ],
            recommended: !isPro,
            current: isPro,
            buttonText: isPro ? 'Active Plan' : 'Upgrade to Pro',
            buttonVariant: 'primary'
        },
        {
            name: 'Enterprise',
            price: 'Contact',
            period: '',
            description: 'For teams and organizations',
            features: [
                'Everything in Pro',
                'Team Management',
                'Custom Branding',
                'API Access',
                'Dedicated Account Manager'
            ],
            current: false,
            buttonText: 'Contact Sales',
            buttonVariant: 'outline'
        }
    ];

    return (
        <Layout role="candidate">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to={ROUTES.CANDIDATE_DASHBOARD}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
                        <p className="text-slate-500 mt-1">Choose the perfect plan for your career journey</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative bg-white rounded-2xl shadow-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col ${plan.recommended ? 'border-emerald-500 ring-2 ring-emerald-500 ring-offset-2' : 'border-slate-200'
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                    Recommended
                                </div>
                            )}

                            <div className="p-8 flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500 ml-1">{plan.period}</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-3">
                                            <div className={`mt-0.5 rounded-full p-0.5 ${plan.recommended ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-slate-700 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <button
                                    className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${plan.buttonVariant === 'primary'
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200'
                                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    onClick={() => handlePayment(plan)}
                                    disabled={plan.current || loading}
                                >
                                    {plan.current ? 'Current Plan' : (loading && plan.name === 'Pro' ? 'Processing...' : plan.buttonText)}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Why Upgrade?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">AI Power</h3>
                            <p className="text-slate-500 text-sm">Leverage advanced AI to write your resume and practice interviews tailored specifically to you.</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                                <Star className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Stand Out</h3>
                            <p className="text-slate-500 text-sm">Access premium, professionally designed templates that pass ATS systems and catch recruiter eyes.</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Career Security</h3>
                            <p className="text-slate-500 text-sm">Get insights into your resume score and improve your chances of landing that dream job.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Subscription;

