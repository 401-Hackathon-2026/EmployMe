'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { initialResumeState, ResumeData } from '@/types/resume';
import { ResumeForm } from '@/components/editor/ResumeForm';
import { Button } from '@/components/ui/button';

const PDFPreview = dynamic(
  () => import('@/components/pdf/PDFViewerComponent').then((mod) => mod.PDFViewerComponent),
  {
    ssr: false,
    loading: () => <div className="p-10 text-center">Loading PDF Engine...</div>
  }
);

export default function EditorPage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData>(initialResumeState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedMaster = localStorage.getItem('masterResume');
    if (savedMaster) {
        try {
            setData(JSON.parse(savedMaster));
        } catch (e) {
            console.error("Failed to parse saved resume", e);
        }
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem("masterResume", JSON.stringify(data));
    alert("Saved as Master Resume");
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will load the default Jake template.")) {
        setData(initialResumeState);
        localStorage.removeItem("masterResume");
    }
  };

  const [debouncedData] = useDebounce(data, 500);

  if (!isLoaded) return <div className="p-10 text-center">Loading your resume...</div>;

  return (
    // MAIN CONTAINER: Vertical Layout (Header on top, Content below)
    <div className="flex flex-col h-screen w-screen bg-gray-100 text-gray-900">
      
      {/* 1. GLOBAL HEADER BAR */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-300 shadow-sm z-50">
          <div className="flex items-center gap-6">
             <Link href="/dashboard" className="text-lg font-semibold">
                EmployMe
             </Link>
             
             <nav className="flex gap-4">
              <Link 
                href="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link 
                href="/jobs"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Jobs
              </Link>
              <Link 
                href="/calendar"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Calendar
              </Link>
              <Link 
                href="/resume/editor"
                className="text-sm text-foreground font-medium"
              >
                Resume
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                  Reset Defaults
              </button>
              <button 
                  onClick={handleSave}
                  className="px-5 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md shadow-sm transition-all"
              >
                  Save Changes
              </button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logout()}
              >
                Logout
              </Button>
          </div>
      </header>

      {/* 2. SPLIT SCREEN CONTENT (Takes remaining height) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: The Form */}
        <div className="w-1/2 h-full overflow-y-auto bg-white border-r border-gray-300">
            {/* We passed padding inside the component, but we can add more here if needed */}
            <ResumeForm data={data} onChange={setData} />
        </div>

        {/* RIGHT PANEL: The Preview */}
        {/* 'flex flex-col' ensures the child fills the height */}
        <div className="w-1/2 bg-gray-800 flex flex-col">
           
           {/* 1. Remove 'p-8' (padding) to get rid of the border gap.
              2. Remove 'max-w-[700px]' so it uses the full half-screen width.
              3. Use 'flex-1' to force this container to expand to the bottom.
           */}
           <div className="flex-1 w-full relative">
             <PDFPreview data={debouncedData} />
           </div>

        </div>

      </div>

    </div>
  );
}