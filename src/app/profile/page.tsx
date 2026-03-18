'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Select } from '../../components/ui';
import storage from '../../lib/storage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FiDownload, FiUpload, FiFileText, FiTrash2, 
  FiHelpCircle, FiLogOut, FiEdit2, FiMessageCircle, FiRefreshCw
} from 'react-icons/fi';
import { AVATARS, AVATAR_COLORS, UserProfile } from '../../types';

export default function ProfilePage() {
  const router = useRouter();
  const { state, updateSettings, getDashboardStats } = useApp();
  const { user, profile, logout, updateProfile } = useAuth();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const stats = getDashboardStats();

  const [editForm, setEditForm] = useState({
    displayName: profile?.displayName || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
  });

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    await updateProfile(editForm);
    setEditingProfile(false);
  };

  const handleAvatarChange = async (avatar: string) => {
    await updateProfile({ avatar });
    setShowAvatarPicker(false);
  };

  const handleColorChange = async (color: string) => {
    await updateProfile({ avatarColor: color });
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('CollectVault - Insurance Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Total Items: ${stats.totalItems}`, 14, 40);
    doc.text(`Total Value: $${stats.totalValue.toLocaleString()}`, 14, 48);
    
    let yPos = 60;
    for (const collection of state.collections) {
      const items = state.items.filter(i => i.collectionId === collection.id);
      if (items.length === 0) continue;
      
      doc.setFontSize(14);
      doc.text(collection.name, 14, yPos);
      yPos += 8;
      
      const tableData = items.map(item => [
        item.name,
        item.condition,
        item.currentValue ? `$${item.currentValue.toLocaleString()}` : '-',
        item.notes || '-',
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Name', 'Condition', 'Value', 'Notes']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [168, 85, 247] },
      });
      
      yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    }
    
    doc.save('collectvault-report.pdf');
    setShowExportMenu(false);
  };

  const handleExportCSV = async () => {
    const headers = ['Collection', 'Item Name', 'Condition', 'Purchase Price', 'Current Value', 'Notes'];
    const rows: string[][] = [];
    
    for (const collection of state.collections) {
      const items = state.items.filter(i => i.collectionId === collection.id);
      for (const item of items) {
        rows.push([
          collection.name,
          item.name,
          item.condition,
          item.purchasePrice?.toString() || '',
          item.currentValue?.toString() || '',
          item.notes || '',
        ]);
      }
    }
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collectvault-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportJSON = async () => {
    const data = await storage.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collectvault-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    try {
      const text = await file.text();
      const success = await storage.importData(text);
      if (success) {
        alert('Import successful! Please refresh the page.');
        window.location.reload();
      } else {
        alert('Import failed. Please check the file format.');
      }
    } catch (error) {
      alert('Error importing data');
    } finally {
      setImporting(false);
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      if (confirm('This will delete all collections and items. Are you absolutely sure?')) {
        await storage.clearAll();
        window.location.reload();
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sign in to view your profile</h2>
          <Link href="/login" className="px-6 py-3 bg-[#A855F7] text-white rounded-full font-medium">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-30">
        <h1 className="text-xl font-bold">My Profile</h1>
      </div>

      <div className="p-4">
        {profile && (
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-4xl transition-transform hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}99)` }}
                >
                  {profile.avatar}
                </button>
                
                {showAvatarPicker && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl p-4 z-50 shadow-xl border border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Choose Avatar</p>
                    <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto mb-3">
                      {AVATARS.map((avatar: string) => (
                        <button
                          key={avatar}
                          onClick={() => handleAvatarChange(avatar)}
                          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl"
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Choose Color</p>
                    <div className="flex gap-2 flex-wrap">
                      {AVATAR_COLORS.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-8 h-8 rounded-full ${profile.avatarColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                {editingProfile ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      placeholder="Display Name"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 font-semibold"
                    />
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      placeholder="Your tagline..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 py-2 bg-[#A855F7] text-white rounded-lg text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900">{profile.displayName}</h2>
                      <button
                        onClick={() => {
                          setEditForm({
                            displayName: profile.displayName,
                            tagline: profile.tagline || '',
                            bio: profile.bio,
                            location: profile.location,
                            website: profile.website,
                          });
                          setEditingProfile(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    </div>
                    {profile.tagline && (
                      <p className="text-gray-500 text-sm mt-1">{profile.tagline}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <FiMessageCircle className="w-6 h-6 mx-auto text-[#A855F7] mb-1" />
            <p className="text-xl font-bold text-gray-900">{profile?.postCount || 0}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <FiRefreshCw className="w-6 h-6 mx-auto text-[#A855F7] mb-1" />
            <p className="text-xl font-bold text-gray-900">{profile?.tradeCount || 0}</p>
            <p className="text-xs text-gray-500">Trades</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-xl font-bold text-gray-900">{stats.totalItems}</p>
            <p className="text-xs text-gray-500">Items</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-semibold">My Collection</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">{stats.totalCollections}</p>
              <p className="text-sm text-gray-500">Collections</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Value</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-semibold">Data</h2>
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FiDownload size={20} className="text-[#A855F7]" />
                <span className="text-gray-700">Export Data</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl overflow-hidden z-10 shadow-xl border border-gray-200">
                <button onClick={handleExportPDF} className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2">
                  <FiFileText size={16} /> Export as PDF Report
                </button>
                <button onClick={handleExportCSV} className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2">
                  <FiFileText size={16} /> Export as CSV
                </button>
                <button onClick={handleExportJSON} className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2">
                  <FiDownload size={16} /> Export Full Backup (JSON)
                </button>
              </div>
            )}
          </div>

          <label className="block w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <FiUpload size={20} className="text-[#A855F7]" />
              <span className="text-gray-700">Import Data</span>
            </div>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            {importing && <span className="text-sm text-gray-400">Importing...</span>}
          </label>

          <button
            onClick={handleClearData}
            className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-red-50"
          >
            <div className="flex items-center gap-3">
              <FiTrash2 size={20} className="text-red-500" />
              <span className="text-red-600">Clear All Data</span>
            </div>
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <Select
              label="Currency"
              value={state.settings.currency}
              onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                await updateSettings({ ...state.settings, currency: e.target.value });
              }}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'JPY', label: 'JPY (¥)' },
              ]}
            />
          </div>

          <Link
            href="/help"
            className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <FiHelpCircle size={20} className="text-[#A855F7]" />
              <span className="text-gray-700">Help Center</span>
            </div>
            <span className="text-gray-400">→</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-red-50"
          >
            <div className="flex items-center gap-3">
              <FiLogOut size={20} className="text-red-500" />
              <span className="text-red-600">Sign Out</span>
            </div>
          </button>
        </div>

        <div className="text-center text-xs text-gray-400 py-4">
          CollectVault v1.0.0
        </div>
      </div>
    </div>
  );
}
