'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import dynamic from 'next/dynamic';
import { initialResumeState, ResumeData } from '@/types/resume';

import { ResumeForm } from '@/components/editor/ResumeForm'

const PDFPreview = dynamic(
  () => import('@/components/pdf/PDFViewerComponent').then((mod) => mod.PDFViewerComponent),
  {
    ssr: false,
    loading: () => <div className="p-10 text-center">Loading PDF Engine...</div>
  }
);

export default function EditorPage() {
  const [data, setData] = useState<ResumeData>(initialResumeState);
  const [debouncedData] = useDebounce(data, 500);

  const updateField = (field: keyof ResumeData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      
      {/* --- LEFT SIDE: The Form --- */}
      <div className="w-1/2 h-full overflow-y-auto bg-white border-r border-gray-300 shadow-xl z-10">
        <ResumeForm 
            data={data} 
            onChange={setData} 
        />
      </div>

      {/* --- RIGHT SIDE: The Live Preview --- */}
      <div className="w-1/2 bg-gray-500 flex justify-center items-center">
        <PDFPreview data={debouncedData} />
      </div>

    </div>
  );
}