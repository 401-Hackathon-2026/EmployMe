'use client';

import { useDebounce } from 'use-debounce';
import dynamic from 'next/dynamic';
import { ResumeData } from '@/types/resume';
import { ResumeForm } from '@/components/editor/ResumeForm';

// Dynamic Import (Same as before)
const PDFPreview = dynamic(
  () => import('@/components/pdf/PDFViewerComponent').then((mod) => mod.PDFViewerComponent),
  { ssr: false, loading: () => <div className="p-10 text-center">Loading PDF...</div> }
);

interface EditorProps {
  data: ResumeData;
  onUpdate: (data: ResumeData) => void;
  onSave: () => void;
  onReset: () => void;
  title: string;
  isSaving: boolean;
  isLoading?: boolean;
}

export const ResumeEditorLayout = ({ 
  data, 
  onUpdate, 
  onSave, 
  onReset, 
  title, 
  isSaving,
  isLoading 
}: EditorProps) => {
  
  // Debounce logic handles the preview rendering here
  const [debouncedData] = useDebounce(data, 1000);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 text-gray-900">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-300 shadow-sm z-50">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                  onClick={onReset}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                  Reset
              </button>
              <button 
                  onClick={onSave}
                  disabled={isSaving}
                  className="px-5 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md shadow-sm transition-all disabled:opacity-50"
              >
                  {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
          </div>
      </header>

      {/* SPLIT SCREEN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: FORM */}
        <div className="w-1/2 h-full overflow-y-auto bg-white border-r border-gray-300">
            <ResumeForm data={data} onChange={onUpdate} />
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="w-1/2 bg-gray-800 flex flex-col">
           <div className="flex-1 w-full relative">
             {debouncedData && <PDFPreview data={debouncedData} />}
           </div>
        </div>
      </div>
    </div>
  );
};