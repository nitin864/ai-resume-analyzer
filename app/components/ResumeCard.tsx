import React from "react";
import { Link } from "react-router"; // Fixed import (use -dom for web)
import ScoreCircle from "./ScoreCircle";
import { features } from "process";
import { resume } from "react-dom/server";

interface Resume {
  id: string; // Assuming string for route; adjust if number
  jobTitle: string;
  companyName: string;
  feedback?: string; // Optional, as it's not used yet
}

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  resume: { id, jobTitle, companyName, feedback, imagePath },
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 w-80 flex-shrink-0" // fixed width
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words text-xl">
            {companyName}
          </h2>
          <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback?.overallScore || 0} />
        </div>
      </div>
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img
            src={imagePath}
            alt="resume"
            className="w-full h-[350px] max:h-[200px] object-cover object-top"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
