import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, useLocation } from "react-router-dom";

import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeIQ" },
    { name: "description", content: "Smarter insights for smarter careers." },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated === false) {
      navigate("/auth?next=/", { replace: true });
    }
  }, [auth, navigate]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-40">
          <h1>Track Your Application and Resume Ratings</h1>
          <h2>Optimize your job applications with AI insights.</h2>
        </div>

        {resumes.length > 0 && ( 
          <div className="resume-section flex gap-4 overflow-x-auto p-2">
            {resumes.map((resume: any) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
