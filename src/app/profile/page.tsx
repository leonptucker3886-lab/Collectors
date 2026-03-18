'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Select } from '../../components/ui';
import storage from '../../lib/storage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FiDownload, FiUpload, FiFileText, FiTrash2, 
  FiHelpCircle, FiLogOut, FiEdit2, FiRefreshCw, FiUser
} from 'react-icons/fi';

export default function ProfilePage() {
  const router = useRouter();
  const { state, updateSettings, getDashboardStats } = useApp();
  const { user, profile, logout, updateProfile } = useAuth();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
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
        headStyles: { fillColor: [192, 160, 128] },
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
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Sign in to view your profile</h2>
          <Link href="/login" className="px-6 py-3 bg-[#C0A080] text-black rounded-full font-medium">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#1F1F1F] px-4 py-3 z-30">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <div className="p-4">
        {profile && (
          <div className="bg-[#141414] rounded-2xl p-6 border border-[#1F1F1F] mb-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-[#1F1F1F] flex items-center justify-center">
                <FiUser size={36} className="text-[#666]" />
              </div>
              
              <div className="flex-1">
                {editingProfile ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      placeholder="Display Name"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      placeholder="Your tagline..."
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-[#888] text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 py-2 bg-[#C0A080] text-black rounded-lg text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 bg-[#1F1F1F] text-[#888] rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-white">{profile.displayName}</h2>
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
                        className="p-1 text-[#666] hover:text-white"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    </div>
                    {profile.tagline && (
                      <p className="text-[#666] text-sm mt-1">{profile.tagline}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-4 bg-[#141414] rounded-xl text-center border border-[#1F1F1F]">
            <FiRefreshCw className="w-6 h-6 mx-auto text-[#C0A080] mb-1" />
            <p className="text-xl font-semibold text-white">{profile?.tradeCount || 0}</p>
            <p className="text-xs text-[#666]">Trades</p>
          </div>
          <div className="p-4 bg-[#141414] rounded-xl text-center border border-[#1F1F1F] col-span-2">
            <p className="text-2xl font-semibold text-[#C0A080]">${stats.totalValue.toLocaleString()}</p>
            <p className="text-xs text-[#666]">Total Value</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-light">My Collection</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-[#141414] rounded-xl border border-[#1F1F1F]">
              <p className="text-2xl font-semibold text-white">{stats.totalCollections}</p>
              <p className="text-sm text-[#666]">Collections</p>
            </div>
            <div className="p-4 bg-[#141414] rounded-xl border border-[#1F1F1F]">
              <p className="text-2xl font-semibold text-white">{stats.totalItems}</p>
              <p className="text-sm text-[#666]">Items</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-light">Data</h2>
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="w-full p-4 bg-[#141414] rounded-xl flex items-center justify-between border border-[#1F1F1F]"
            >
              <div className="flex items-center gap-3">
                <FiDownload size={20} className="text-[#C0A080]" />
                <span className="text-white">Export Data</span>
              </div>
              <span className="text-[#666]">→</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] rounded-xl overflow-hidden z-10 shadow-xl border border-[#1F1F1F]">
                <button onClick={handleExportPDF} className="w-full p-3 text-left hover:bg-[#1F1F1F] flex items-center gap-2 text-white">
                  <FiFileText size={16} /> Export as PDF Report
                </button>
                <button onClick={handleExportCSV} className="w-full p-3 text-left hover:bg-[#1F1F1F] flex items-center gap-2 text-white">
                  <FiFileText size={16} /> Export as CSV
                </button>
                <button onClick={handleExportJSON} className="w-full p-3 text-left hover:bg-[#1F1F1F] flex items-center gap-2 text-white">
                  <FiDownload size={16} /> Export Full Backup (JSON)
                </button>
              </div>
            )}
          </div>

          <label className="block w-full p-4 bg-[#141414] rounded-xl flex items-center justify-between cursor-pointer border border-[#1F1F1F] hover:border-[#2A2A2A">
            <div className="flex items-center gap-3">
              <FiUpload size={20} className="text-[#C0A080]" />
              <span className="text-white">Import Data</span>
            </div>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            {importing && <span className="text-sm text-[#666]">Importing...</span>}
          </label>

          <button
            onClick={handleClearData}
            className="w-full p-4 bg-[#141414] rounded-xl flex items-center justify-between border border-[#1F1F1F] hover:border-red-900"
          >
            <div className="flex items-center gap-3">
              <FiTrash2 size={20} className="text-red-500" />
              <span className="text-red-500">Clear All Data</span>
            </div>
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-light">Settings</h2>
          
          <div className="p-4 bg-[#141414] rounded-xl border border-[#1F1F1F] space-y-4">
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
            className="w-full p-4 bg-[#141414] rounded-xl flex items-center justify-between border border-[#1F1F1F] hover:border-[#2A2A2A]"
          >
            <div className="flex items-center gap-3">
              <FiHelpCircle size={20} className="text-[#C0A080]" />
              <span className="text-white">Help Center</span>
            </div>
            <span className="text-[#666]">→</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full p-4 bg-[#141414] rounded-xl flex items-center justify-between border border-[#1F1F1F] hover:border-red-900"
          >
            <div className="flex items-center gap-3">
              <FiLogOut size={20} className="text-red-500" />
              <span className="text-red-500">Sign Out</span>
            </div>
          </button>
        </div>

        <div className="text-center text-xs text-[#444] py-4">
          CollectVault v1.0.0
        </div>
      </div>
    </div>
  );
}
