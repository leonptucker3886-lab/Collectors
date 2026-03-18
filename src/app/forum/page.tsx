'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiPlus, FiThumbsUp, FiUsers, FiClock, FiTrendingUp } from 'react-icons/fi';
import { doc, onSnapshot, setDoc, serverTimestamp, collection, query, orderBy, getDocs, limit, where, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  likes: number;
  createdAt: any;
  commentCount: number;
  isPinned?: boolean;
}

interface OnlineUser {
  uid: string;
  displayName: string;
  lastActive: any;
}

const FORUM_SECTIONS = [
  { id: 'general', label: 'General' },
  { id: 'trading', label: 'Trading' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'help', label: 'Help' },
  { id: 'news', label: 'News' },
];

const POSTS_PER_PAGE = 15;

export default function ForumPage() {
  const { user, profile, updateProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [submitting, setSubmitting] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const postsRef = collection(db, 'forum_posts');
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'), limit(POSTS_PER_PAGE));
        const snapshot = await getDocs(postsQuery);
        
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(data);

        const countQuery = query(collection(db, 'forum_posts'));
        const countSnapshot = await getDocs(countQuery);
        setTotalPosts(countSnapshot.size);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userStatusRef = doc(db, 'presence', user.uid);
    
    const setupPresence = async () => {
      await setDoc(userStatusRef, {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        lastActive: serverTimestamp(),
        online: true,
      }, { merge: true });

      const timeout = setTimeout(async () => {
        await setDoc(userStatusRef, {
          lastActive: serverTimestamp(),
          online: false,
        }, { merge: true });
      }, 5 * 60 * 1000);

      return () => clearTimeout(timeout);
    };

    setupPresence();

    const unsubscribe = onSnapshot(
      query(collection(db, 'presence'), where('online', '==', true), limit(20)),
      (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data() as OnlineUser);
        setOnlineUsers(users);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return;
      
      await setDoc(doc(db, 'presence', user.uid), {
        lastActive: serverTimestamp(),
        online: true,
      }, { merge: true });
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !user) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'forum_posts'), {
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        likes: 0,
        createdAt: serverTimestamp(),
        commentCount: 0,
      });
      
      if (profile) {
        await updateProfile({ postCount: (profile.postCount || 0) + 1 });
      }
      
      setNewPost({ title: '', content: '', category: 'general' });
      setShowNewPost(false);
      
      const postsQuery = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'), limit(POSTS_PER_PAGE));
      const snapshot = await getDocs(postsQuery);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(data);
      setTotalPosts(prev => prev + 1);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    category === 'all' || post.category === category
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1F1F1F] px-4 py-3 z-30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-semibold">Community</h1>
            <p className="text-xs text-[#666]">{totalPosts} discussions</p>
          </div>
          {user && (
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C0A080] text-black rounded-full text-sm font-medium"
            >
              <FiPlus size={16} />
              Post
            </button>
          )}
        </div>

        {onlineUsers.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-[#C0A080]">
              <span className="w-2 h-2 bg-[#C0A080] rounded-full animate-pulse" />
              <FiUsers size={12} />
              {onlineUsers.length} online
            </div>
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 5).map((u, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-[#1F1F1F] border-2 border-[#0A0A0A] flex items-center justify-center text-[10px]"
                  title={u.displayName}
                >
                  {u.displayName?.[0]?.toUpperCase() || '?'}
                </div>
              ))}
              {onlineUsers.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-[#2A2A2A] border-2 border-[#0A0A0A] flex items-center justify-center text-[10px]">
                  +{onlineUsers.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              category === 'all' ? 'bg-white text-black' : 'bg-[#1F1F1F] text-[#888]'
            }`}
          >
            All
          </button>
          {FORUM_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setCategory(section.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                category === section.id ? 'bg-white text-black' : 'bg-[#1F1F1F] text-[#888]'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {!user && (
        <div className="mx-4 mt-3 p-4 bg-[#141414] rounded-lg border border-[#1F1F1F]">
          <p className="text-sm text-[#666]">
            <Link href="/login" className="text-[#C0A080]">Sign in</Link> to join the discussion.
          </p>
        </div>
      )}

      {showNewPost && user && (
        <form onSubmit={handleCreatePost} className="mx-4 mt-3 p-4 bg-[#141414] rounded-xl border border-[#1F1F1F] space-y-3">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-[#C0A080] outline-none"
            required
          />
          <textarea
            placeholder="Share more details..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-[#C0A080] outline-none resize-none"
            rows={3}
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNewPost(false)}
              className="flex-1 py-2.5 bg-[#1F1F1F] text-white rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#C0A080] text-black rounded-lg font-medium text-sm disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <Link
                key={post.id}
                href={`/forum/${post.id}`}
                className="block p-4 bg-[#141414] rounded-xl border border-[#1F1F1F] hover:border-[#C0A080]/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-sm font-medium text-[#C0A080]">
                    {post.authorName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-[#666] mb-1">
                      <span className="text-[#888] font-medium">{post.authorName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <FiClock size={10} />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-medium text-white text-sm leading-tight">{post.title}</h3>
                    <p className="text-xs text-[#666] mt-1.5 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#666]">
                      <span className="flex items-center gap-1 hover:text-[#C0A080]">
                        <FiThumbsUp size={12} />
                        {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1 hover:text-[#C0A080]">
                        <FiMessageSquare size={12} />
                        {post.commentCount || 0}
                      </span>
                      <span className="ml-auto text-[10px] bg-[#1F1F1F] px-2 py-0.5 rounded-full capitalize">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <FiMessageSquare size={48} className="text-[#2A2A2A] mb-4" />
              <h3 className="text-lg text-[#666]">No discussions yet</h3>
              <p className="text-sm text-[#444] mt-1">Be the first to start a conversation!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
