'use client';

import { ResumeData } from '@/types/resume';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const ResumeForm = ({ data, onChange }: ResumeFormProps) => {

  // --- HELPER: Generic Field Update ---
  const handleChange = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // --- HELPER: Nested Array Update (for Education, Experience, etc.) ---
  // section: 'experience' | 'education' | 'projects'
  // index: which item in the array to update
  // field: which property of that item (e.g., 'company')
  // value: the new value
  const handleArrayChange = (section: keyof ResumeData, index: number, field: string, value: any) => {
    // @ts-ignore - TS struggles with dynamic keys on complex unions, ignoring for brevity
    const newSectionData = [...data[section]];
    newSectionData[index] = { ...newSectionData[index], [field]: value };
    handleChange(section, newSectionData);
  };

  // --- HELPER: Add/Remove Items ---
  const addItem = (section: keyof ResumeData, initialItem: any) => {
     // @ts-ignore
    const newSectionData = [...data[section], initialItem];
    handleChange(section, newSectionData);
  };

  const removeItem = (section: keyof ResumeData, index: number) => {
     // @ts-ignore
    const newSectionData = [...data[section]];
    newSectionData.splice(index, 1);
    handleChange(section, newSectionData);
  };

  return (
    <div className="space-y-8 p-6 pb-20">
      
      {/* 1. PERSONAL DETAILS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">Personal Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" value={data.name} onChange={(v) => handleChange('name', v)} />
          <Input label="Email" value={data.email} onChange={(v) => handleChange('email', v)} />
          <Input label="Phone" value={data.phone} onChange={(v) => handleChange('phone', v)} />
          <Input label="LinkedIn (URL)" value={data.linkedin} onChange={(v) => handleChange('linkedin', v)} />
          <Input label="GitHub (URL)" value={data.github} onChange={(v) => handleChange('github', v)} />
        </div>
      </section>

      {/* 2. EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="border p-4 rounded bg-gray-50 space-y-3 relative">
            <button onClick={() => removeItem('education', index)} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>
            <div className="grid grid-cols-2 gap-3">
              <Input label="School" value={edu.school} onChange={(v) => handleArrayChange('education', index, 'school', v)} />
              <Input label="Location" value={edu.location} onChange={(v) => handleArrayChange('education', index, 'location', v)} />
              <Input label="Degree" value={edu.degree} onChange={(v) => handleArrayChange('education', index, 'degree', v)} />
              <Input label="Year" value={edu.year} onChange={(v) => handleArrayChange('education', index, 'year', v)} />
            </div>
          </div>
        ))}
        <Button onClick={() => addItem('education', { school: "New School", degree: "Degree", year: "2024", location: "City" })}>
          + Add School
        </Button>
      </section>

      {/* 3. EXPERIENCE (The Complex One) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="border p-4 rounded bg-gray-50 space-y-3 relative">
            <button onClick={() => removeItem('experience', index)} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>
            
            <div className="grid grid-cols-2 gap-3">
              <Input label="Company" value={exp.company} onChange={(v) => handleArrayChange('experience', index, 'company', v)} />
              <Input label="Location" value={exp.location} onChange={(v) => handleArrayChange('experience', index, 'location', v)} />
              <Input label="Title" value={exp.title} onChange={(v) => handleArrayChange('experience', index, 'title', v)} />
              <Input label="Date" value={exp.date} onChange={(v) => handleArrayChange('experience', index, 'date', v)} />
            </div>

            {/* Bullet Points Logic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bullet Points (One per line)</label>
              <textarea
                className="w-full p-2 border rounded text-sm min-h-[100px]"
                value={exp.points.join('\n')} 
                onChange={(e) => handleArrayChange('experience', index, 'points', e.target.value.split('\n'))}
              />
            </div>
          </div>
        ))}
         <Button onClick={() => addItem('experience', { company: "New Company", title: "Job Title", date: "2024", location: "City", points: ["Did a thing"] })}>
          + Add Job
        </Button>
      </section>

      {/* 4. SKILLS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">Skills</h2>
        <div className="space-y-3">
           {/* Note: Skills is an object, not an array, so we update it differently */}
           <Input label="Languages" value={data.skills.languages} onChange={(v) => onChange({ ...data, skills: { ...data.skills, languages: v } })} />
           <Input label="Frameworks" value={data.skills.frameworks} onChange={(v) => onChange({ ...data, skills: { ...data.skills, frameworks: v } })} />
           <Input label="Tools" value={data.skills.tools} onChange={(v) => onChange({ ...data, skills: { ...data.skills, tools: v } })} />
           <Input label="Libraries" value={data.skills.libraries} onChange={(v) => onChange({ ...data, skills: { ...data.skills, libraries: v } })} />
        </div>
      </section>

    </div>
  );
};

// --- MINI COMPONENTS (Internal for this file) ---

const Input = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{label}</label>
    <input 
      type="text" 
      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  </div>
);

const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
    <button onClick={onClick} className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 transition">
        {children}
    </button>
)