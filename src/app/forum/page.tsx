'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiPlus, FiUser, FiThumbsUp, FiArrowRight, FiClock, FiStar } from 'react-icons/fi';

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
  { id: 'general', label: 'General Discussion', icon: '💬', description: 'Talk about anything collecting' },
  { id: 'reviews', label: 'Reviews & Guides', icon: '⭐', description: 'Share your expert knowledge' },
  { id: 'news', label: 'Market News', icon: '📰', description: 'Latest trends and prices' },
  { id: 'help', label: 'Q&A Help', icon: '❓', description: 'Ask the community' },
  { id: 'trades', label: 'Trade Talk', icon: '🔄', description: 'Buying, selling, trading' },
  { id: 'showcase', label: 'Showcase', icon: '🏆', description: 'Show off your collection' },
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
        authorAvatar: profile?.avatar || '⚔️',
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

  const pinnedPosts = filteredPosts.filter(p => p.isPinned);
  const regularPosts = filteredPosts.filter(p => !p.isPinned);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getSectionInfo = (catId: string) => FORUM_SECTIONS.find(s => s.id === catId) || FORUM_SECTIONS[0];

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24">
      <div className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Community</h1>
          {user && (
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="flex items-center gap-2 px-4 py-2 bg-[#A855F7] text-white rounded-full text-sm font-medium"
            >
              <FiPlus size={18} />
              New Post
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              category === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {FORUM_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setCategory(section.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                category === section.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{section.icon}</span>
              {section.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {!user && (
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
          <p className="text-sm text-gray-600">Join the discussion! <Link href="/login" className="text-[#A855F7] font-medium">Sign in</Link> to post.</p>
        </div>
      )}

      {showNewPost && user && (
        <form onSubmit={handleCreatePost} className="mx-4 mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
          <h3 className="font-semibold">Start a Discussion</h3>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#A855F7]"
            required
          />
          <textarea
            placeholder="Share more details..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#A855F7] resize-none"
            rows={4}
            required
          />
          <select
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#A855F7]"
          >
            {FORUM_SECTIONS.map(section => (
              <option key={section.id} value={section.id}>{section.icon} {section.label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNewPost(false)}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 bg-[#A855F7] text-white rounded-lg font-medium"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading discussions...</div>
      ) : (
        <div className="p-4 space-y-3">
          {pinnedPosts.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <FiStar size={14} /> Pinned
              </div>
              {pinnedPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/forum/${post.id}`}
                  className="block p-4 bg-amber-50 rounded-xl border border-amber-100 mb-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                        {getSectionInfo(post.category).icon} {getSectionInfo(post.category).label}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    <FiArrowRight className="text-gray-400 mt-2" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Latest Discussions</span>
            <span>{filteredPosts.length} posts</span>
          </div>

          {regularPosts.length > 0 ? (
            regularPosts.map(post => (
              <Link
                key={post.id}
                href={`/forum/${post.id}`}
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A855F7] to-[#6366F1] flex items-center justify-center text-white text-sm">
                    {post.authorAvatar || '👤'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                        {getSectionInfo(post.category).icon}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-1">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiThumbsUp size={14} />
                        {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMessageSquare size={14} />
                        {post.commentCount || 0}
                      </span>
                      <span>{post.authorName}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No discussions yet</h3>
              <p className="text-gray-500 text-sm">Be the first to start a conversation!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
