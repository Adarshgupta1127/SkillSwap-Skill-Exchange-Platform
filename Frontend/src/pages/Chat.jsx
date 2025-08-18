import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function Chat() {
  const { user } = useAuth();
  const { userId } = useParams(); // the other user's id
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (!user) return;
    const s = io(SOCKET_URL, { autoConnect: true });
    socketRef.current = s;
    s.on('connect', () => {
      s.emit('join', { userId: user.id });
      s.emit('startConversation', { withUserId: userId });
    });
    s.on('newMessage', (m) => {
      // incoming message
      setMessages(prev => [...prev, m]);
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      s.disconnect();
    };
  }, [user, userId]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/messages/conversations/${userId}`);
        setMessages(data || []);
        setTimeout(()=> scrollRef.current?.scrollIntoView({behavior: 'smooth'}), 100);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [userId]);

  const send = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    try {
      // send via socket (which will also persist on server)
      socketRef.current.emit('sendMessage', { to: userId, text });
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded shadow h-[60vh] overflow-auto">
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m._id || Math.random()} className={`p-2 rounded ${m.sender === user.id ? 'bg-blue-100 self-end text-right' : 'bg-gray-100'}`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type a message" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </form>
    </div>
  );
}
