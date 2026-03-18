'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { collectionTemplates } from '../../../data/templates';
import { Button, Input, Textarea } from '../../../components/ui';
import { FiArrowLeft } from 'react-icons/fi';

export default function NewCollectionPage() {
  const router = useRouter();
  const { createCollection } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !selectedTemplate) return;
    setLoading(true);
    try {
      const collection = await createCollection(name, selectedTemplate, description);
      router.push(`/collections/${collection.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="p-2 text-[#A0A0A0]">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Choose Template</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {collectionTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  if (template.id !== 'custom') {
                    setName(template.name);
                  }
                  setStep(2);
                }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-[#A855F7] bg-[#A855F7]/10'
                    : 'border-[#333] bg-[#242424] hover:border-[#666]'
                }`}
              >
                <span className="text-3xl block mb-2">{template.icon}</span>
                <h3 className="font-medium text-white">{template.name}</h3>
                <p className="text-xs text-[#666] mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep(1)} className="p-2 text-[#A0A0A0]">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Collection Details</h1>
          </div>

          <div className="space-y-4">
            <Input
              label="Collection Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="My Collection"
            />
            
            <Textarea
              label="Description (optional)"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />

            {selectedTemplate !== 'custom' && (
              <div className="p-4 bg-[#242424] rounded-xl">
                <h3 className="text-sm font-medium text-white mb-2">Custom Fields</h3>
                <div className="space-y-1">
                  {collectionTemplates
                    .find((t) => t.id === selectedTemplate)
                    ?.fields.map((field) => (
                      <p key={field.id} className="text-xs text-[#666]">
                        • {field.name} {field.required && <span className="text-[#A855F7]">*</span>}
                      </p>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleCreate}
                loading={loading}
                disabled={!name.trim()}
                className="flex-1"
              >
                Create Collection
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
