import { useState, useEffect } from 'react';
import { Mail, Clock, Search, Trash2, ChevronRight, ChevronLeft, User, AlertCircle, RefreshCw, Star, MoreVertical, ArrowLeft, Reply, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';

const MessagesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, [user]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/messages/my-messages/${user.id || user._id}`);
            // Sort by date desc
            const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(sorted);
        } catch (e) {
            console.error("Failed to fetch messages", e);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/messages/${id}/read`);
            setMessages(msgs => msgs.map(m => m._id === id ? { ...m, read: true } : m));
        } catch (e) { console.error(e); }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await api.delete(`/messages/${id}`);
            setMessages(msgs => msgs.filter(m => m._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
        } catch (e) { console.error(e); }
    };

    const sendReply = async () => {
        if (!replyText.trim()) return;

        try {
            await api.post('/messages', {
                senderId: user._id || user.id,
                receiverId: selectedMessage.senderId._id,
                subject: `Re: ${selectedMessage.subject}`,
                content: replyText
            });
            alert('Reply sent!');
            setReplyText('');
            setIsReplying(false);
        } catch (e) {
            console.error(e);
            alert('Failed to send reply');
        }
    };

    // Filter messages
    const filteredMessages = messages.filter(m =>
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.senderId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <Layout role="candidate">
            <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">

                {/* Header / Toolbar */}
                {/* Header / Toolbar */}
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(ROUTES.CANDIDATE_DASHBOARD)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900" title="Back to Dashboard">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <button onClick={fetchMessages} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-emerald-600" title="Refresh">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        {selectedIds.length > 0 && (
                            <button className="p-2 hover:bg-red-50 rounded-full transition-colors text-slate-500 hover:text-red-600" title="Delete Selected">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span>1-{filteredMessages.length} of {messages.length}</span>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-slate-100 rounded-md disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-100 rounded-md disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden relative">
                    {selectedMessage ? (
                        // Detailed View
                        <div className="absolute inset-0 bg-white z-10 flex flex-col overflow-y-auto animate-in fade-in slide-in-from-right-4">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-slate-100 rounded-full mr-2">
                                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                                        </button>
                                        <h2 className="text-xl font-bold text-slate-900">{selectedMessage.subject}</h2>
                                        <span className="bg-slate-100 text-xs px-2 py-1 rounded-md text-slate-500 font-medium tracking-wide uppercase">Inbox</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-500">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                        <button onClick={() => deleteMessage(selectedMessage._id)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                                        {selectedMessage.senderId?.name?.charAt(0) || 'H'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{selectedMessage.senderId?.name || 'HR Manager'}</p>
                                        <p className="text-sm text-slate-500">&lt;Recruitment Team&gt;</p>
                                    </div>
                                </div>

                                <div className="prose max-w-none text-slate-800 mb-12 whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.content}
                                </div>

                                {/* Reply Section */}
                                {isReplying ? (
                                    <div className="border border-slate-200 rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 bg-white">
                                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            <Reply className="w-3 h-3" />
                                            Replying to <span className="text-slate-800">{selectedMessage.senderId?.name}</span>
                                        </div>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full p-6 min-h-[200px] focus:outline-none resize-none text-slate-700 leading-relaxed placeholder:text-slate-300"
                                            placeholder="Write your reply here..."
                                            autoFocus
                                        />
                                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                                            <button
                                                onClick={() => setIsReplying(false)}
                                                className="text-slate-500 hover:text-red-600 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                onClick={sendReply}
                                                className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 flex items-center gap-2"
                                            >
                                                <Send className="w-4 h-4" />
                                                Send Reply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsReplying(true)}
                                        className="flex items-center gap-3 px-6 py-3 border border-slate-200 rounded-full text-slate-500 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-600 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <Reply className="w-4 h-4" />
                                        </div>
                                        Click here to <span className="underline decoration-slate-300 group-hover:decoration-emerald-300 underline-offset-4">Reply</span>
                                    </button>
                                )}

                            </div>
                        </div>
                    ) : (
                        // List View (Gmail Style)
                        <div className="absolute inset-0 overflow-y-auto">
                            {filteredMessages.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Your inbox is empty</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {/* Header Row */}
                                    <div className="flex items-center px-4 py-3 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        <div className="w-10"></div> {/* Checkbox spacer */}
                                        <div className="w-10"></div> {/* Star spacer */}
                                        <div className="w-1/4">Sender</div>
                                        <div className="flex-1">Subject</div>
                                        <div className="w-24 text-right">Date</div>
                                    </div>

                                    {filteredMessages.map((msg) => (
                                        <div
                                            key={msg._id}
                                            onClick={() => {
                                                setSelectedMessage(msg);
                                                if (!msg.read) markAsRead(msg._id);
                                            }}
                                            className={`
                                                group flex items-center px-4 py-3.5 cursor-pointer transition-all border-b border-slate-50 hover:shadow-md hover:z-10 bg-white
                                                ${!msg.read ? 'bg-white' : 'bg-slate-50/30'}
                                                hover:bg-white
                                            `}
                                        >
                                            {/* Selection Bar */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${!msg.read ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-slate-200'}`}></div>

                                            {/* Checkbox */}
                                            <div onClick={(e) => { e.stopPropagation(); toggleSelect(msg._id); }} className="w-10 flex items-center justify-center text-slate-300 hover:text-slate-500 z-10">
                                                <div className={`w-4 h-4 border rounded transition-colors ${selectedIds.includes(msg._id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-slate-400'}`}></div>
                                            </div>

                                            {/* Star */}
                                            <div className="w-10 flex items-center justify-center text-slate-300 hover:text-yellow-400 transition-colors">
                                                <Star className="w-4 h-4" />
                                            </div>

                                            {/* Sender */}
                                            <div className={`w-1/4 truncate pr-6 text-sm ${!msg.read ? 'font-bold text-slate-900' : 'font-medium text-slate-900/80'}`}>
                                                {msg.senderId?.name || 'HR Manager'}
                                            </div>

                                            {/* Subject + Preview */}
                                            <div className="flex-1 min-w-0 pr-4 flex items-center text-sm">
                                                <span className={`truncate ${!msg.read ? 'font-bold text-slate-900' : 'font-medium text-slate-900/80'}`}>
                                                    {msg.subject || 'No Subject'}
                                                </span>
                                                <span className="mx-2 text-slate-300">-</span>
                                                <span className="truncate text-slate-500 font-normal">
                                                    {msg.content}
                                                </span>
                                            </div>

                                            {/* Date */}
                                            <div className={`w-24 text-right text-xs font-medium ${!msg.read ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                                                {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
};

export default MessagesPage;
