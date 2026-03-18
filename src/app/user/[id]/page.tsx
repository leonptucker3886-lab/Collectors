'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiUser, FiPackage, FiMessageSquare, FiClock, FiSettings, FiArrowLeft, FiGrid } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

interface Post {
  id: string;
  title: string;
  content: string;
  board: string;
  createdAt: any;
}

interface UserData {
  uid: string;
  displayName: string;
  isAnonymous: boolean;
  lastActive: any;
  joinedAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const { state } = useApp();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'collections' | 'items' | 'posts'>('collections');

  const userId = params.id as string;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId), limit(1)));
        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data() as UserData);
        }

        const postsQuery = query(
          collection(db, 'forum_threads'),
          where('authorId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const postsSnap = await getDocs(postsQuery);
        setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = userData?.isAnonymous ? 'Anonymous Collector' : (userData?.displayName || 'Unknown User');
  const isOwnProfile = user?.uid === userId;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1F1F1F] px-4 py-3 z-30">
        <div className="flex items-center gap-3">
          <Link href="/collections" className="p-1 -ml-1 text-[#666]">
            <FiArrowLeft size={24} />
          </Link>
          <div className="w-16 h-16 rounded-full bg-[#1F1F1F] flex items-center justify-center text-2xl font-semibold text-[#C0A080]">
            {userData?.isAnonymous ? '?' : displayName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{displayName}</h1>
            {userData?.isAnonymous && (
              <span className="text-xs bg-[#1F1F1F] text-[#666] px-2 py-0.5 rounded-full">Anonymous</span>
            )}
            {userData?.joinedAt && (
              <p className="text-xs text-[#666]">Joined {formatDate(userData.joinedAt)}</p>
            )}
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <div className="p-4">
          <Link
            href="/profile"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#141414] rounded-xl border border-[#1F1F1F] text-white"
          >
            <FiSettings size={18} />
            Edit My Profile
          </Link>
        </div>
      )}

      <div className="flex border-b border-[#1F1F1F]">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'collections' ? 'text-white border-b-2 border-[#C0A080]' : 'text-[#666]'}`}
        >
          <span className="flex items-center justify-center gap-2">
            <FiGrid size={16} />
            Collections
          </span>
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'posts' ? 'text-white border-b-2 border-[#C0A080]' : 'text-[#666]'}`}
        >
          <span className="flex items-center justify-center gap-2">
            <FiMessageSquare size={16} />
            Posts ({posts.length})
          </span>
        </button>
      </div>

      {activeTab === 'collections' ? (
        <div className="p-4">
          <p className="text-sm text-[#666]">User's collection stats</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="p-4 space-y-2">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/forum/thread/${post.id}`}
              className="block p-4 bg-[#141414] rounded-xl border border-[#1F1F1F]"
            >
              <div className="flex items-center gap-2 text-xs text-[#666] mb-1">
                <span className="capitalize">{post.board}</span>
                <span>·</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <h3 className="font-medium text-white">{post.title}</h3>
              <p className="text-sm text-[#666] mt-1 line-clamp-2">{post.content}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <FiMessageSquare size={48} className="text-[#2A2A2A] mb-4" />
          <p className="text-[#666]">No posts yet</p>
        </div>
      )}
    </div>
  );
}
