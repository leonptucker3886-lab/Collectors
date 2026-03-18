'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiPlus, FiClock, FiChevronRight, FiEye } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Board {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  threadCount: number;
  postCount: number;
  lastPost?: {
    title: string;
    author: string;
    time: any;
  };
}

const BOARDS: Board[] = [
  { id: 'general', title: 'General Discussion', description: 'Talk about anything collector-related', icon: '💬', color: '#C0A080', threadCount: 0, postCount: 0 },
  { id: 'trading', title: 'Trading Post', description: 'Buy, sell, and trade with other collectors', icon: '🔄', color: '#4CAF50', threadCount: 0, postCount: 0 },
  { id: 'showcase', title: 'Showcase', description: 'Show off your collections', icon: '🏆', color: '#2196F3', threadCount: 0, postCount: 0 },
  { id: 'help', title: 'Help & Support', description: 'Get help with your collections', icon: '❓', color: '#FF9800', threadCount: 0, postCount: 0 },
  { id: 'news', title: 'News & Updates', description: 'Latest news and announcements', icon: '📰', color: '#9C27B0', threadCount: 0, postCount: 0 },
];

export default function ForumBoardsPage() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>(BOARDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardStats = async () => {
      try {
        const threadsRef = collection(db, 'forum_threads');
        const boardsWithStats = await Promise.all(
          BOARDS.map(async (board) => {
            const threadsQuery = query(threadsRef, where('board', '==', board.id));
            const threadsSnap = await getDocs(threadsQuery);
            
            let postCount = 0;
            let lastPost: Board['lastPost'] = undefined;
            
            const threads = threadsSnap.docs.map(d => d.data());
            postCount = threads.length;
            
            if (threads.length > 0) {
              const sortedThreads = threads.sort((a: any, b: any) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime.getTime() - aTime.getTime();
              });
              
              if (sortedThreads[0]) {
                lastPost = {
                  title: sortedThreads[0].title,
                  author: sortedThreads[0].authorName,
                  time: sortedThreads[0].createdAt,
                };
              }
            }
            
            return {
              ...board,
              threadCount: threadsSnap.size,
              postCount,
              lastPost,
            };
          })
        );
        
        setBoards(boardsWithStats);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardStats();
  }, []);

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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Forums</h1>
          {user && (
            <Link
              href="/forum/new"
              className="flex items-center gap-2 px-4 py-2 bg-[#C0A080] text-black rounded-full text-sm font-medium"
            >
              <FiPlus size={16} />
              New Thread
            </Link>
          )}
        </div>
      </div>

      {!user && (
        <div className="mx-4 mt-3 p-4 bg-[#141414] rounded-lg border border-[#1F1F1F]">
          <p className="text-sm text-[#666]">
            <Link href="/login" className="text-[#C0A080]">Sign in</Link> to create threads.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/forum/${board.id}`}
              className="block bg-[#141414] rounded-xl border border-[#1F1F1F] hover:border-[#2A2A2A] transition-colors overflow-hidden"
            >
              <div className="p-4 flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${board.color}20` }}
                >
                  {board.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{board.title}</h3>
                    {board.id === 'trading' && (
                      <span className="text-[10px] bg-[#C0A080]/20 text-[#C0A080] px-2 py-0.5 rounded-full">Active</span>
                    )}
                  </div>
                  <p className="text-sm text-[#666] mt-0.5 line-clamp-1">{board.description}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#444]">
                    <span className="flex items-center gap-1">
                      <FiMessageSquare size={12} />
                      {board.threadCount} threads
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye size={12} />
                      {board.postCount} posts
                    </span>
                  </div>
                </div>
                <FiChevronRight size={20} className="text-[#444]" />
              </div>
              
              {board.lastPost && (
                <div className="px-4 py-2 bg-[#0A0A0A] border-t border-[#1F1F1F] flex items-center gap-2 text-xs">
                  <span className="text-[#666]">Latest:</span>
                  <span className="text-white truncate flex-1">{board.lastPost.title}</span>
                  <span className="text-[#444]">{formatTime(board.lastPost.time)}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
