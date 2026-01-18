'use client';

import { useState, useEffect } from 'react';
import { initialResumeState, ResumeData } from '@/types/resume';
import { ResumeEditorLayout } from '@/components/editor/ResumeEditorLayout';

export default function MasterEditorPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch from LocalStorage
  useEffect(() => {
    const savedMaster = localStorage.getItem('masterResume');
    if (savedMaster) {
        try {
            setData(JSON.parse(savedMaster));
        } catch {
            setData(initialResumeState);
        }
    } else {
        setData(initialResumeState);
    }
  }, []);

  // 2. Save to LocalStorage
  const handleSave = () => {
    if (!data) return;
    setIsSaving(true);
    // Simulate a network delay just for UI consistency
    setTimeout(() => {
        localStorage.setItem("masterResume", JSON.stringify(data));
        setIsSaving(false);
        alert("Master Resume Updated!");
    }, 500);
  };

  // 3. Reset to Defaults
  const handleReset = () => {
    if (confirm("Reset to default Jake's Resume? This clears your Master Template.")) {
        setData(initialResumeState);
        localStorage.removeItem("masterResume");
    }
  };

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  return (
    <ResumeEditorLayout
      title="Master Resume"
      data={data}
      onUpdate={setData}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
    />
  );
}