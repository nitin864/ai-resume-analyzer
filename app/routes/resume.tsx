import { data, Link, useNavigate, useParams  } from 'react-router'
import React, { useState, useEffect } from "react";
import { usePuterStore } from '~/lib/puter';

export const meta = () => [
  { title: "Resume IQ | Review" },
  { name: "description", content: "Detailed Overview of Your Resume" },
];

const resume = () => {

  const {id}  = useParams();
  const {auth , isLoading  , kv ,fs } = usePuterStore();
  const [imageUrl, setImageUrl] = useState('');
  const [feedback , setFeedback] = useState('');
  const [resumeUrl , setResumeUrl] = useState('');
  const navigate = useNavigate();


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
        }
  } , [id])

  return (
     <main className='!pt-0'>
        <nav className='resume-nav'>
            <Link to="/" className='back-button'>
              <img src='/icons/back.svg' alt='logo'  className='w-2.5 h-2.5'/>
              <span className='text-gray-800 text-sm font-semibold'>Back to Home</span>
            </Link>
            <div className='flex flex-row w-full max-lg:flex-col'>
              <section className='feedback-section '>
                {imageUrl && resumeUrl && (
                   
                   <div className='animate-in fade-in duration-1000 gradient-border max-smm-0 h-[90%] max-wxl:h-fit w-fit'>

                   </div>

                )}
              </section>
            </div>
        </nav>
     </main>
  )
}

export default resume