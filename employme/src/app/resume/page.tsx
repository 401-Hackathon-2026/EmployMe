'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client2';
import { initialResumeState } from '@/types/resume';

export default function ResumeDashboard() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  
  // 2. Initialize the client (reads browser cookies automatically)
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
        // This now reads from the Cookie, not LocalStorage
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
  };

  const handleCreate = async () => {
    if (!user) return;

    const title = prompt("Name your new resume:");
    if (!title) return;

    // Local Storage logic works perfectly here because we are 'use client'
    const savedMaster = localStorage.getItem('masterResume');
    const startData = savedMaster ? JSON.parse(savedMaster) : initialResumeState;

    const { data, error } = await supabase
      .from('resumes')
      .insert([{ 
          title, 
          content: startData,
          user_id: user.id 
      }])
      .select()
      .single();

    if (error) {
      console.error(error);
      alert('Error creating resume');
    } else {
      // 3. This is the route we are about to build
      router.push(`/resume/editor/${data.id}`);
    }
  };

  if (!user) return <div className="p-10">Checking session...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <button 
            onClick={handleCreate} 
            className="bg-black text-white px-6 py-2 rounded shadow hover:bg-gray-800 transition"
          >
            + Create New Resume
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div 
                key={resume.id} 
                onClick={() => router.push(`/resume/editor/${resume.id}`)}
                className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg transition border border-transparent hover:border-gray-300"
            >
              <h2 className="text-xl font-bold mb-2">{resume.title}</h2>
              <p className="text-sm text-gray-500">
                Created: {new Date(resume.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}