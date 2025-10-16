import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";

import { resume } from "react-dom/server";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeIQ" },
    { name: "description", content: "Smarter insights for smarter careers." },
  ];
}

export default function Home() {
  return (
    <>
      <main className="bg-[url('/images/bg-main.svg')]">
        <Navbar />
        <section className="main-section">
          <div className="page-heading">
            <h1>Track Your Application and Resume Ratings</h1>
            <h2>Optimize your job applications with AI insights.</h2>
          </div>
        </section>

        {resume.length > 0 && (
          <div className="resume-section">
            {resumes.map((resume: any) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
