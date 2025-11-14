import { data, Link, useNavigate, useParams  } from 'react-router'
import React, { useState, useEffect } from "react";
import { usePuterStore } from '~/lib/puter';
import { isZeroValueString } from 'framer-motion';
import Summary from '~/components/Summary';
import ATS from '~/components/ATS';
import Details from '~/components/Details';

export const meta = () => [
  { title: "Resume IQ | Review" },
  { name: "description", content: "Detailed Overview of Your Resume" },
];

const resume = () => {
  
  const {id}  = useParams();
  const {auth , isLoading  , kv ,fs } = usePuterStore();
  const [imageUrl, setImageUrl] = useState('');
  const [feedback , setFeedback] = useState<Feedback | null>(null);
  const [resumeUrl , setResumeUrl] = useState('');
  const navigate = useNavigate();
 
    useEffect(() => {
    if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [isLoading])

  useEffect(() => {
        const loadResume = async() => {
            const resume = await kv.get(`resume:${id}`);
            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);
            
            setFeedback(data.feedback);
            console.log(imageUrl , resumeUrl, feedback);
        }

        loadResume();
  } , [id])

  return (
  <main className="min-h-screen bg-gray-50 p-4">
    <nav className="max-w-6xl mx-auto mb-4">
      <Link to="/" className="inline-flex items-center gap-2">
        <img
          src="/icons/back.svg"
          alt="logo"
          className="w-3.5 h-3.5"
        />
        <span className="text-gray-800 text-sm font-medium">Back to Home</span>
      </Link>
    </nav>

    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ===================== LEFT SECTION ===================== */}
      <section className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-200">
        {imageUrl ? (
          <div className="w-full max-w-md mx-auto">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={imageUrl}
                className="w-full h-auto rounded-xl shadow-sm hover:shadow-lg transition-all"
                alt="resume preview"
              />
            </a>

            <button
              onClick={() => window.open(resumeUrl, "_blank")}
              className="mt-4 w-full px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
            >
              Open Full Resume
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading resume preview...</p>
        )}
      </section>

      {/* ===================== RIGHT SECTION ===================== */}
      <section className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Resume Review
        </h2>
       
        {feedback ? (
          <div className='flex flex-col gap-8 animate-in fade-in  duration-1000'>
             <Summary feedback = {feedback}/>
             <ATS score = {feedback.ATS.score || 0} suggestions = {feedback.ATS.tips || []} />
             <Details feedback = {feedback}/>
          </div>
        ) : (
          <img src='/images/resume-scan-2.gif' className='w-full'/>
        )}        
      
      </section>

    </div>
  </main>
);

}

export default resume