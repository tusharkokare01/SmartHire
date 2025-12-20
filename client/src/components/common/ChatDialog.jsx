import { useState, useEffect, useRef } from 'react';
import { X, Send, User, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ChatDialog = ({ isOpen, onClose, candidate, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && candidate && currentUser) {
      fetchMessages();
      // Set up polling for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, candidate, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/conversation`, {
        params: { user1: currentUser._id, user2: candidate._id }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const response = await api.post('/messages', {
        senderId: currentUser._id,
        receiverId: candidate._id,
        content: newMessage
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 pointer-events-none">
       {/* Backdrop? Maybe not needed if we want it to feel like a popup */}
       <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose}></div>

      <div className="bg-white w-full sm:w-[400px] h-[500px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-violet-600 rounded-t-2xl text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {candidate?.name?.charAt(0) || 'C'}
             </div>
             <div>
               <h3 className="font-bold text-sm">{candidate?.name || 'Candidate'}</h3>
               <p className="text-xs text-violet-200">Online</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No messages yet. Say hello! 👋
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser._id;
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-violet-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <button 
              type="submit" 
              disabled={sending || !newMessage.trim()}
              className="p-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatDialog;
