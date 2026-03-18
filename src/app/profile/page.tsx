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
  FiDownload, FiUpload, FiSettings, FiUser, FiFileText, FiTrash2, 
  FiHelpCircle, FiLogOut, FiEdit2, FiStar, FiAward, FiFolder, FiMapPin
} from 'react-icons/fi';
import { TbTrophy } from 'react-icons/tb';
import { AVATARS, AVATAR_COLORS, BADGES, LEVELS, UserProfile } from '../../types';

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
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
  });

  const currentLevel = LEVELS.find(l => l.level === (profile?.level || 1)) || LEVELS[0];
  const pointsToNextLevel = currentLevel.maxPoints - (profile?.points || 0);
  const progressPercent = currentLevel.maxPoints > 0 
    ? (((profile?.points || 0) - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100
    : 0;

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
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Sign in to view your profile</h2>
          <Link href="/login" className="px-6 py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-xl font-semibold">My Profile</h1>

      {profile && (
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#242424] rounded-2xl p-6 border border-[#333]">
          <div className="flex items-start gap-4">
            <div className="relative">
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-4xl font-bold text-white transition-transform hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}99)` }}
              >
                {profile.avatar}
              </button>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-[#A855F7] to-[#6366F1] flex items-center justify-center text-sm">
                {currentLevel.icon}
              </div>
              
              {showAvatarPicker && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#1A1A1A] rounded-xl p-4 z-50 shadow-xl border border-[#333]">
                  <p className="text-sm text-[#666] mb-2">Choose Avatar</p>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto mb-3">
                    {AVATARS.map(avatar => (
                      <button
                        key={avatar}
                        onClick={() => handleAvatarChange(avatar)}
                        className="w-10 h-10 rounded-lg bg-[#242424] hover:bg-[#333] flex items-center justify-center text-xl"
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-[#666] mb-2">Choose Color</p>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-8 h-8 rounded-full ${profile.avatarColor === color ? 'ring-2 ring-white' : ''}`}
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
                    className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Location"
                    className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-2 bg-gradient-to-r from-[#A855F7] to-[#6366F1] rounded-lg text-white text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 bg-[#333] rounded-lg text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{profile.displayName}</h2>
                    <button
                      onClick={() => {
                        setEditForm({
                          displayName: profile.displayName,
                          bio: profile.bio,
                          location: profile.location,
                          website: profile.website,
                        });
                        setEditingProfile(true);
                      }}
                      className="p-1 text-[#666] hover:text-white"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </div>
                  <p className="text-[#A855F7] text-sm font-medium">
                    {currentLevel.icon} {currentLevel.title} • {profile.points.toLocaleString()} points
                  </p>
                  {profile.location && (
                    <p className="text-[#666] text-sm flex items-center gap-1 mt-1">
                      <FiMapPin size={12} /> {profile.location}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#666]">Level Progress</span>
              <span className="text-[#A855F7]">{profile.points} / {currentLevel.maxPoints} pts</span>
            </div>
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#A855F7] to-[#6366F1] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {profile && profile.badges.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FiAward className="text-[#A855F7]" /> Badges
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {profile.badges.map(badge => (
              <div
                key={badge.id}
                className="flex-shrink-0 w-16 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#A855F7]/20 to-[#6366F1]/20 flex items-center justify-center text-2xl">
                  {badge.icon}
                </div>
                <p className="text-xs text-[#666] mt-1 truncate">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-[#242424] rounded-xl text-center">
          <TbTrophy className="w-6 h-6 mx-auto text-[#A855F7] mb-1" />
          <p className="text-xl font-bold text-white">{stats.totalItems}</p>
          <p className="text-xs text-[#666]">Items</p>
        </div>
        <div className="p-4 bg-[#242424] rounded-xl text-center">
          <FiFolder className="w-6 h-6 mx-auto text-[#6366F1] mb-1" />
          <p className="text-xl font-bold text-white">{stats.totalCollections}</p>
          <p className="text-xs text-[#666]">Collections</p>
        </div>
        <div className="p-4 bg-[#242424] rounded-xl text-center">
          <FiStar className="w-6 h-6 mx-auto text-[#F59E0B] mb-1" />
          <p className="text-xl font-bold text-white">{profile?.badges.length || 0}</p>
          <p className="text-xs text-[#666]">Badges</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Data Management</h2>
        
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="w-full p-4 bg-[#242424] rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FiDownload size={20} className="text-[#A855F7]" />
              <span className="text-white">Export Data</span>
            </div>
            <span className="text-[#666]">→</span>
          </button>
          
          {showExportMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] rounded-xl overflow-hidden z-10 shadow-xl">
              <button onClick={handleExportPDF} className="w-full p-3 text-left hover:bg-[#242424] flex items-center gap-2">
                <FiFileText size={16} /> Export as PDF Report
              </button>
              <button onClick={handleExportCSV} className="w-full p-3 text-left hover:bg-[#242424] flex items-center gap-2">
                <FiFileText size={16} /> Export as CSV
              </button>
              <button onClick={handleExportJSON} className="w-full p-3 text-left hover:bg-[#242424] flex items-center gap-2">
                <FiDownload size={16} /> Export Full Backup (JSON)
              </button>
            </div>
          )}
        </div>

        <label className="block w-full p-4 bg-[#242424] rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <FiUpload size={20} className="text-[#4ECDC4]" />
            <span className="text-white">Import Data</span>
          </div>
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          {importing && <span className="text-sm text-[#666]">Importing...</span>}
        </label>

        <button
          onClick={handleClearData}
          className="w-full p-4 bg-[#242424] rounded-xl flex items-center justify-between hover:bg-[#FF4757]/10"
        >
          <div className="flex items-center gap-3">
            <FiTrash2 size={20} className="text-[#FF4757]" />
            <span className="text-[#FF4757]">Clear All Data</span>
          </div>
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Settings</h2>
        
        <div className="p-4 bg-[#242424] rounded-xl space-y-4">
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
          
          <label className="flex items-center justify-between">
            <span className="text-white">Notifications</span>
            <input
              type="checkbox"
              checked={state.settings.notifications}
              onChange={async (e) => {
                await updateSettings({ ...state.settings, notifications: e.target.checked });
              }}
              className="w-5 h-5 rounded bg-[#1A1A1A] border-[#333] text-[#A855F7] focus:ring-[#A855F7]"
            />
          </label>
        </div>

        <Link
          href="/help"
          className="w-full p-4 bg-[#242424] rounded-xl flex items-center justify-between hover:bg-[#2a2a2a]"
        >
          <div className="flex items-center gap-3">
            <FiHelpCircle size={20} className="text-[#4ECDC4]" />
            <span className="text-white">Help Center</span>
          </div>
          <span className="text-[#666]">→</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full p-4 bg-[#242424] rounded-xl flex items-center justify-between hover:bg-[#FF4757]/10"
        >
          <div className="flex items-center gap-3">
            <FiLogOut size={20} className="text-[#FF4757]" />
            <span className="text-[#FF4757]">Sign Out</span>
          </div>
        </button>
      </div>

      <div className="text-center text-xs text-[#666] py-4">
        CollectVault v1.0.0
      </div>
    </div>
  );
}
