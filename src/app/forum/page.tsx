'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiPlus, FiThumbsUp } from 'react-icons/fi';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  likes: number;
  createdAt: any;
  commentCount: number;
  isPinned?: boolean;
}

const FORUM_SECTIONS = [
  { id: 'general', label: 'General' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'news', label: 'News' },
  { id: 'help', label: 'Q&A' },
  { id: 'trades', label: 'Trades' },
  { id: 'showcase', label: 'Showcase' },
];

export default function ForumPage() {
  const { user, profile, updateProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { db } = await import('../../lib/firebase');
        const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
        
        const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !user) return;

    setSubmitting(true);
    try {
      const { db } = await import('../../lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      
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
      window.location.reload();
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
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1F1F1F] px-4 py-4 z-30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-light tracking-wide">Forum</h1>
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
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              category === 'all' ? 'bg-[#C0A080] text-black' : 'bg-[#1F1F1F] text-[#888]'
            }`}
          >
            All
          </button>
          {FORUM_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setCategory(section.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                category === section.id ? 'bg-[#C0A080] text-black' : 'bg-[#1F1F1F] text-[#888]'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {!user && (
        <div className="mx-4 mt-4 p-4 bg-[#141414] rounded-lg border border-[#1F1F1F]">
          <p className="text-sm text-[#666]">
            <Link href="/login" className="text-[#C0A080]">Sign in</Link> to post.
          </p>
        </div>
      )}

      {showNewPost && user && (
        <form onSubmit={handleCreatePost} className="mx-4 mt-4 p-4 bg-[#141414] rounded-lg border border-[#1F1F1F] space-y-3">
          <input
            type="text"
            placeholder="Title..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-[#C0A080] outline-none"
            required
          />
          <textarea
            placeholder="Content..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-[#C0A080] outline-none resize-none"
            rows={4}
            required
          />
          <select
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-[#C0A080] outline-none"
          >
            {FORUM_SECTIONS.map(section => (
              <option key={section.id} value={section.id}>{section.label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNewPost(false)}
              className="flex-1 py-2.5 bg-[#1F1F1F] text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#C0A080] text-black rounded-lg font-medium"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-[#666]">Loading...</div>
      ) : (
        <div className="p-4 space-y-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <Link
                key={post.id}
                href={`/forum/${post.id}`}
                className="block p-4 bg-[#141414] rounded-lg border border-[#1F1F1F] hover:border-[#2A2A2A] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-lg">
                    {post.authorAvatar || '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#666] mb-1">
                      <span className="text-[#888]">{post.authorName}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="font-medium text-white truncate">{post.title}</h3>
                    <p className="text-sm text-[#666] mt-1 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#666]">
                      <span className="flex items-center gap-1">
                        <FiThumbsUp size={14} />
                        {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMessageSquare size={14} />
                        {post.commentCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4 opacity-20">□</div>
              <h3 className="text-lg text-[#666]">No discussions yet</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
