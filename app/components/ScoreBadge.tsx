import React from "react";

type ScoreBadgeProps = {
  score: number;
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let bgColor = "";
  let label = "";

  if (score > 69) {
    bgColor = "bg-green-600 text-white";
    label = "Strong";
  } else if (score > 49) {
    bgColor = "bg-yellow-500 text-black";
    label = "Good Start";
  } else {
    bgColor = "bg-red-600 text-white";
    label = "Needs Work";
  }

  return (
    <div className={`inline-block rounded-full px-4 py-1 ${bgColor}`}>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default ScoreBadge;
