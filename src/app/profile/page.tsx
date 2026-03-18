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
import { FiDownload, FiUpload, FiSettings, FiUser, FiFileText, FiTrash2, FiHelpCircle, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
  const router = useRouter();
  const { state, updateSettings, getDashboardStats } = useApp();
  const { user, logout } = useAuth();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importing, setImporting] = useState(false);
  const stats = getDashboardStats();

  const handleLogout = async () => {
    await logout();
    router.push('/');
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
        headStyles: { fillColor: [255, 107, 53] },
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

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Profile</h1>

      <div className="p-4 bg-[#242424] rounded-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A855F7] to-[#6366F1] flex items-center justify-center text-2xl font-bold text-white">
          CV
        </div>
        <div>
          <h2 className="font-semibold text-white">Collector</h2>
          <p className="text-sm text-[#666]">{stats.totalItems} items across {stats.totalCollections} collections</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Portfolio Summary</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#242424] rounded-xl">
            <p className="text-sm text-[#666]">Total Value</p>
            <p className="text-2xl font-bold text-[#FFE66D]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              ${stats.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-[#242424] rounded-xl">
            <p className="text-sm text-[#666]">Total Items</p>
            <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
          </div>
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
            <span className="text-white">Dark Mode</span>
            <input
              type="checkbox"
              checked={state.settings.darkMode}
              onChange={async (e) => {
                await updateSettings({ ...state.settings, darkMode: e.target.checked });
              }}
              className="w-5 h-5 rounded bg-[#1A1A1A] border-[#333] text-[#A855F7] focus:ring-[#A855F7]"
            />
          </label>
          
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

        {user && (
          <button
            onClick={handleLogout}
            className="w-full p-4 bg-[#242424] rounded-xl flex items-center justify-between hover:bg-[#FF4757]/10"
          >
            <div className="flex items-center gap-3">
              <FiLogOut size={20} className="text-[#FF4757]" />
              <span className="text-[#FF4757]">Sign Out</span>
            </div>
          </button>
        )}
      </div>

      <div className="text-center text-xs text-[#666] py-4">
        CollectVault v1.0.0
      </div>
    </div>
  );
}
