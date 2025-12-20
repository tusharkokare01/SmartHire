import { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle, Smartphone } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const MessagesPanel = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeMessage, setActiveMessage] = useState(null);

    useEffect(() => {
        if (isOpen && user) {
            fetchMessages();
        }
    }, [isOpen, user]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/messages/my-messages/${user.id || user._id}`);
            setMessages(res.data);
        } catch (e) {
            console.error("Failed to fetch messages", e);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await api.patch(`/messages/${id}/read`);
            setMessages(msgs => msgs.map(m => m._id === id ? { ...m, read: true } : m));
        } catch (e) { console.error(e); }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 origin-top-right">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    Inbox
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    {messages.filter(m => !m.read).length} New
                </span>
            </div>

            {/* Message List */}
            <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center text-slate-400 text-sm">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Mail className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium">No messages yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                onClick={() => setActiveMessage(activeMessage === msg._id ? null : msg._id)}
                                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group ${!msg.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm ${!msg.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                        {msg.subject || 'No Subject'}
                                    </h4>
                                    {!msg.read && (
                                        <button
                                            onClick={(e) => markAsRead(msg._id, e)}
                                            className="text-[10px] font-bold text-blue-600 hover:underline"
                                            title="Mark as read"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                                    <span>{msg.senderId?.name || 'HR Manager'}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Expandable Content */}
                                {activeMessage === msg._id && (
                                    <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in fade-in">
                                        {msg.content}
                                    </div>
                                )}

                                {/* Preview if not expanded */}
                                {activeMessage !== msg._id && (
                                    <p className="text-xs text-slate-500 truncate">{msg.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 text-center">
                <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                    Close Inbox
                </button>
            </div>
        </div>
    );
};

export default MessagesPanel;
