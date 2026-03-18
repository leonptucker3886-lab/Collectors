'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiHelpCircle, FiBook, FiMail, FiMessageCircle, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

const faqs = [
  {
    question: 'How do I create a collection?',
    answer: 'Tap the + button in the center of the bottom navigation, or go to Collections and tap "New Collection". Choose a category and fill in the details.',
  },
  {
    question: 'How do I add items to my collection?',
    answer: 'Open a collection and tap the + button. You can take photos, add details like condition, purchase price, and current value.',
  },
  {
    question: 'How does the marketplace work?',
    answer: 'List items you want to sell with photos and price. We charge a 5% commission on each sale. Buyers can browse and contact sellers.',
  },
  {
    question: 'How do I use the camera feature?',
    answer: 'When adding items, tap the camera icon. On mobile, this opens your camera. You can also upload existing photos from your gallery.',
  },
  {
    question: 'Can I export my collection data?',
    answer: 'Yes! Go to Profile > Export to download your data as PDF, CSV, or JSON format.',
  },
  {
    question: 'How do I join the community forum?',
    answer: 'Tap Forum in the bottom navigation. You can post questions, share collections, and interact with other collectors.',
  },
  {
    question: 'Is my data backed up?',
    answer: 'Data is stored locally on your device. Use the Import/Backup feature in Profile to save copies of your collection.',
  },
  {
    question: 'How do I update my profile?',
    answer: 'Go to Profile in the bottom navigation (tap your avatar icon). You can update your display name and manage account settings.',
  },
];

const guides = [
  { title: 'Getting Started', desc: 'Beginner guide to CollectVault', icon: '🚀' },
  { title: 'Managing Collections', desc: 'Create and organize your items', icon: '📁' },
  { title: 'Selling on Marketplace', desc: 'List items and track sales', icon: '💰' },
  { title: 'Using the Forum', desc: 'Connect with other collectors', icon: '💬' },
  { title: 'Camera & Photos', desc: 'Capture and manage images', icon: '📷' },
  { title: 'Data & Backup', desc: 'Export and import your data', icon: '💾' },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-20">
      <header className="sticky top-0 bg-[#0F0F0F]/95 backdrop-blur-sm z-40 border-b border-[#333]">
        <div className="flex items-center gap-3 p-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-[#333] rounded-lg transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">Help Center</h1>
        </div>
        
        <div className="px-4 pb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl py-3 pl-10 pr-4 text-white placeholder-[#666] focus:border-[#A855F7] focus:outline-none"
            />
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FiBook className="text-[#A855F7]" />
            Quick Guides
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 hover:border-[#A855F7] transition-colors cursor-pointer"
              >
                <span className="text-2xl mb-2 block">{guide.icon}</span>
                <h3 className="font-medium text-sm">{guide.title}</h3>
                <p className="text-[#666] text-xs mt-1">{guide.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FiHelpCircle className="text-[#A855F7]" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-sm pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <FiChevronUp className="text-[#A855F7]" />
                  ) : (
                    <FiChevronDown className="text-[#666]" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-[#A0A0A0] text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#A855F7]/20 to-[#6366F1]/20 border border-[#A855F7]/30 rounded-xl p-4">
          <h2 className="font-semibold mb-2">Still need help?</h2>
          <p className="text-sm text-[#A0A0A0] mb-4">
            Can&apos;t find what you&apos;re looking for? Contact us or ask the community.
          </p>
          <div className="flex gap-3">
            <Link
              href="/forum"
              className="flex-1 bg-[#A855F7] text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-[#A855F7]/90 transition-colors"
            >
              <FiMessageCircle className="inline mr-2" />
              Ask Forum
            </Link>
            <a
              href="mailto:support@collectvault.app"
              className="flex-1 bg-[#1A1A1A] border border-[#333] text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:border-[#A855F7] transition-colors"
            >
              <FiMail className="inline mr-2" />
              Email Us
            </a>
          </div>
        </section>

        <section className="text-center text-[#666] text-sm">
          <p>CollectVault v1.0.0</p>
          <p className="mt-1">Made with love for collectors</p>
        </section>
      </main>
    </div>
  );
}
