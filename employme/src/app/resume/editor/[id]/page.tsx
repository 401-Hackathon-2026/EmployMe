'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client2'; 
import { initialResumeState, ResumeData } from '@/types/resume';
import { ResumeEditorLayout } from '@/components/editor/ResumeEditorLayout'; // <--- Import UI

export default function DatabaseEditorPage() {
  const params = useParams();
  const resumeId = params.id as string;
  const supabase = createClient();
  const router = useRouter();

  const [data, setData] = useState<ResumeData | null>(null);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Logic
  useEffect(() => {
    const fetchResume = async () => {
      const { data: resume, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (error || !resume) {
        alert('Resume not found');
        router.push('/dashboard');
      } else {
        setData(resume.content);
        setTitle(resume.title);
      }
    };
    if (resumeId) fetchResume();
  }, [resumeId]);

  // 2. Save Logic
  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    await supabase.from('resumes').update({ content: data }).eq('id', resumeId);
    setIsSaving(false);
  };

  // 3. Reset Logic
  const handleReset = () => {
    if (confirm('Reset to Master?')) {
        const master = localStorage.getItem('masterResume');
        setData(master ? JSON.parse(master) : initialResumeState);
    }
  };

  if (!data) return <div>Loading...</div>;

  // 4. Render the UI
  return (
    <ResumeEditorLayout
      data={data}
      onUpdate={setData}
      onSave={handleSave}
      onReset={handleReset}
      title={title}
      isSaving={isSaving}
    />
  );
}