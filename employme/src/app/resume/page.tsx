'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client2';
import { initialResumeState } from '@/types/resume';
import AppShell from "@/components/layout/AppShell";

// Icons for better UI
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

export default function ResumeDashboard() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            router.push('/login'); 
        } else {
            setUser(user);
            fetchResumes(user.id);
        }
    };
    getUser();
  }, []);

  const fetchResumes = async (userId: string) => {
    const { data } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (data) setResumes(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!user) return;
    const title = prompt("Name your new resume:");
    if (!title) return;

    const savedMaster = localStorage.getItem('masterResume');
    const startData = savedMaster ? JSON.parse(savedMaster) : initialResumeState;

    const { data, error } = await supabase
      .from('resumes')
      .insert([{ title, content: startData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      alert('Error creating resume');
    } else {
      router.push(`/resume/editor/${data.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    // Stop the click from bubbling up to the card container (which would navigate)
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this resume?")) return;

    // 1. Optimistic Update (Remove from UI immediately)
    setResumes((prev) => prev.filter((r) => r.id !== id));

    // 2. Delete from DB
    const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Failed to delete resume");
        // Revert if failed (optional, but good practice)
        fetchResumes(user.id); 
    }
  };

  if (loading) return (
    <AppShell>
       <div className="flex h-64 items-center justify-center text-gray-400">Loading your workspace...</div>
    </AppShell>
  );

  return (
    <AppShell>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Resumes</h1>
           <p className="text-gray-500 text-sm mt-1">Manage your specific applications and master template.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link 
              href="/resume/editor" 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
            >
              Edit Master Template
            </Link>
          <button 
            onClick={handleCreate} 
            className="px-5 py-2 text-sm font-medium text-white bg-black rounded-md shadow hover:bg-gray-800 transition"
          >
            + Create New
          </button>
        </div>
      </div>

      {/* Grid Section */}
      {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-gray-300 rounded-lg text-center">
              <div className="p-4 bg-gray-50 rounded-full mb-3">
                 <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No resumes yet</h3>
              <p className="text-gray-500 max-w-sm mt-1 mb-6">Create a specific resume for a job application, or edit your master template to get started.</p>
              <button onClick={handleCreate} className="text-sm text-blue-600 font-medium hover:underline">Create your first resume</button>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div 
                key={resume.id} 
                onClick={() => router.push(`/resume/editor/${resume.id}`)}
                className="group relative bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition cursor-pointer flex flex-col justify-between h-48"
            >
              {/* Delete Button (Absolute top right) */}
              <button 
                onClick={(e) => handleDelete(e, resume.id)}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                title="Delete Resume"
              >
                <TrashIcon />
              </button>

              <div>
                 <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors pr-8">
                    {resume.title}
                 </h2>
                 <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
                    Resume
                 </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <span className="text-xs text-gray-500">
                    Last updated {new Date(resume.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open →
                  </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}