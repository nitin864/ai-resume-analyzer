import React from 'react';
import { Link } from 'react-router'; // Fixed import (use -dom for web)
import ScoreCircle from './ScoreCircle';
import { features } from 'process';

interface Resume {
  id: string; // Assuming string for route; adjust if number
  jobTitle: string;
  companyName: string;
  feedback?: string; // Optional, as it's not used yet
}

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume: { id, jobTitle, companyName ,feedback} }) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 w-full block"  
    >
      <div className="flex flex-col gap-2">  
        <h2 className="!text-black font-bold break-words text-xl">{companyName}</h2>  
        <h3 className="text-lg break-words text-green-500">{jobTitle}</h3>
      </div>
      <div className='flex-shrink-0'>
        <ScoreCircle score={feedback.overallScore}/>
      </div>
    </Link>
  );
};

export default ResumeCard;