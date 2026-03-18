'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { FiMessageSquare, FiPlus, FiClock, FiChevronLeft, FiEye, FiTrendingUp } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  board: string;
  views: number;
  replyCount: number;
  isPinned?: boolean;
  createdAt: any;
  lastReply?: {
    author: string;
    time: any;
  };
}

const BOARD_INFO: Record<string, { title: string; icon: string; color: string }> = {
  general: { title: 'General Discussion', icon: '💬', color: '#C0A080' },
  trading: { title: 'Trading Post', icon: '🔄', color: '#4CAF50' },
  showcase: { title: 'Showcase', icon: '🏆', color: '#2196F3' },
  help: { title: 'Help & Support', icon: '❓', color: '#FF9800' },
  news: { title: 'News & Updates', icon: '📰', color: '#9C27B0' },
};

export default function ForumThreadsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const board = params.board as string;
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const boardInfo = BOARD_INFO[board] || { title: board, icon: '📋', color: '#C0A080' };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const threadsRef = collection(db, 'forum_threads');
        const q = query(
          threadsRef,
          where('board', '==', board),
          orderBy('isPinned', 'desc'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const snapshot = await getDocs(q);
        
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Thread[];
        setThreads(data);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [board]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.content.trim() || !user) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'forum_threads'), {
        title: newThread.title,
        content: newThread.content,
        board,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        views: 0,
        replyCount: 0,
        isPinned: false,
        createdAt: serverTimestamp(),
      });
      
      setNewThread({ title: '', content: '' });
      setShowNewThread(false);
      
      const q = query(
        collection(db, 'forum_threads'),
        where('board', '==', board),
        orderBy('isPinned', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Thread[];
      setThreads(data);
    } catch (error) {
      console.error('Error creating thread:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1F1F1F] px-4 py-3 z-30">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.back()} className="p-1 -ml-1 text-[#666]">
            <FiChevronLeft size={24} />
          </button>
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${boardInfo.color}20` }}
          >
            {boardInfo.icon}
          </div>
          <div>
            <h1 className="text-lg font-semibold">{boardInfo.title}</h1>
            <p className="text-xs text-[#666]">{threads.length} threads</p>
          </div>
        </div>
        
        {user && (
          <button
            onClick={() => setShowNewThread(!showNewThread)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C0A080] text-black rounded-lg text-sm font-medium"
          >
            <FiPlus size={16} />
            New Thread
          </button>
        )}
      </div>

      {!user && (
        <div className="mx-4 mt-3 p-4 bg-[#141414] rounded-lg border border-[#1F1F1F]">
          <p className="text-sm text-[#666]">
            <Link href="/login" className="text-[#C0A080]">Sign in</Link> to post.
          </p>
        </div>
      )}

      {showNewThread && user && (
        <form onSubmit={handleCreateThread} className="mx-4 mt-3 p-4 bg-[#141414] rounded-xl border border-[#1F1F1F] space-y-3">
          <input
            type="text"
            placeholder="Thread title..."
            value={newThread.title}
            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-[#C0A080] outline-none"
            required
          />
          <textarea
            placeholder="What's on your mind?"
            value={newThread.content}
            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-[#C0A080] outline-none resize-none"
            rows={4}
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNewThread(false)}
              className="flex-1 py-2.5 bg-[#1F1F1F] text-white rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#C0A080] text-black rounded-lg font-medium text-sm disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Thread'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : threads.length > 0 ? (
        <div className="p-4 space-y-2">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/forum/thread/${thread.id}`}
              className="block bg-[#141414] rounded-xl border border-[#1F1F1F] hover:border-[#2A2A2A] transition-colors p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-sm font-medium text-[#C0A080] flex-shrink-0">
                  {thread.authorName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {thread.isPinned && (
                      <span className="text-[10px] bg-[#C0A080]/20 text-[#C0A080] px-2 py-0.5 rounded">PINNED</span>
                    )}
                    <h3 className="font-medium text-white text-sm leading-tight">{thread.title}</h3>
                  </div>
                  <p className="text-xs text-[#666] mt-1 line-clamp-2">{thread.content}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#444]">
                    <span>{thread.authorName}</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={10} />
                      {formatTime(thread.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye size={10} />
                      {thread.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMessageSquare size={10} />
                      {thread.replyCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <FiMessageSquare size={48} className="text-[#2A2A2A] mb-4" />
          <h3 className="text-lg text-[#666]">No threads yet</h3>
          <p className="text-sm text-[#444] mt-1">Be the first to start a discussion!</p>
        </div>
      )}
    </div>
  );
}
