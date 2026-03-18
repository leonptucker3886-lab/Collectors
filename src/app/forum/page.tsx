'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiPlus, FiUser, FiThumbsUp, FiArrowRight } from 'react-icons/fi';

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
}

export default function ForumPage() {
  const { user, profile, addPoints, earnBadge } = useAuth();
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
        authorAvatar: profile?.avatar || '👤',
        likes: 0,
        createdAt: serverTimestamp(),
        commentCount: 0,
      });
      
      await addPoints(2);
      
      if (profile) {
        const currentPosts = profile.stats?.forumPosts || 0;
        if (currentPosts === 0) {
          await earnBadge('forum_post');
        } else if (currentPosts >= 9) {
          await earnBadge('ten_forum_posts');
        }
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

  const categories = ['all', 'general', 'cards', 'records', 'toys', 'sports', 'help', 'trades'];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Community Forum</h1>
        {user && (
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white rounded-lg text-sm font-medium"
          >
            <FiPlus size={18} />
            New Post
          </button>
        )}
      </div>

      {!user && (
        <div className="bg-[#242424] rounded-xl p-4 text-center">
          <p className="text-[#666] text-sm">Sign in to post and comment</p>
          <Link href="/login" className="text-[#A855F7] text-sm mt-2 inline-block">
            Sign In →
          </Link>
        </div>
      )}

      {showNewPost && user && (
        <form onSubmit={handleCreatePost} className="bg-[#242424] rounded-xl p-4 space-y-4">
          <h3 className="font-medium text-white">Create New Post</h3>
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#A855F7]"
            required
          />
          <textarea
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#A855F7] resize-none"
            rows={4}
            required
          />
          <select
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#A855F7]"
          >
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNewPost(false)}
              className="flex-1 py-2 bg-[#333] text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white rounded-lg font-medium"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-[#A855F7] text-white'
                : 'bg-[#242424] text-[#A0A0A0] hover:text-white'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#666]">Loading posts...</div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-3">
          {filteredPosts.map(post => (
            <Link
              key={post.id}
              href={`/forum/${post.id}`}
              className="block bg-[#242424] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#A855F7]/20 text-[#A855F7]">
                    {post.category}
                  </span>
                  <h3 className="font-medium text-white mt-2">{post.title}</h3>
                  <p className="text-sm text-[#666] mt-1 line-clamp-2">{post.content}</p>
                </div>
                <FiArrowRight className="text-[#666] mt-2" />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-[#666]">
                <span className="flex items-center gap-1">
                  <FiUser size={12} />
                  {post.authorName}
                </span>
                <span>{formatDate(post.createdAt)}</span>
                <span className="flex items-center gap-1">
                  <FiThumbsUp size={12} />
                  {post.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FiMessageSquare size={12} />
                  {post.commentCount || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#242424] flex items-center justify-center">
            <FiMessageSquare size={24} className="text-[#666]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
          <p className="text-[#666] text-sm">Be the first to start a discussion!</p>
        </div>
      )}
    </div>
  );
}
