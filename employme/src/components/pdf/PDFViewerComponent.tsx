'use client';

import { memo } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { ResumeDocument } from './ResumeDocument';
import { ResumeData } from '@/types/resume';

function PDFViewerComponentRaw({ data }: { data: ResumeData }) {
  return (
    <PDFViewer className="w-full h-full border-none">
      <ResumeDocument data={data} />
    </PDFViewer>
  );
}

export const PDFViewerComponent = memo(PDFViewerComponentRaw);