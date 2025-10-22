import React, { useState, type FormEvent } from 'react'
import Navbar from '~/components/Navbar'

const upload = () => {
  const [isProcessing , setIsProcessing] = useState(false);
  const [statusText , setStatusText] = useState('');
   
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className='page-heading py-10'>
           <h1>Intelligent insights for your next career move</h1>
           {isProcessing ? (
            <>
            <h2>{statusText}</h2>
            <img src="/images/resume-scan.gif" className='w-100 '/>
            </>
           ): (
             <h2>Drop your Resume for an ATS score and improvement tips</h2>
           )}
           {!isProcessing && (
             <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                <div className='form-div'>
                   <label htmlFor='company-name'>Company Name</label>
                   <input type='text' name='company-name' placeholder='Company Name' id="company-name"></input>
                </div>
                <div className='form-div'>
                   <label htmlFor='job-title'>Job Title</label>
                   <input type='text' name='job-title' placeholder='Job Title' id="job-title"></input>
                </div>
                <div className='form-div'>
                   <label htmlFor='job-description'>Job Description</label>
                   <textarea rows={5} name='job-description' placeholder='Job Description' id="job-description"></textarea>
                </div>
                <div className='form-div'>
                   <label htmlFor='uploader'>Upload Resume</label>
                   <div>Uploader</div>
                </div>
                <button className='primary-button' type='submit'>
                  Check Resume Quality
                </button>
             </form>
           )}
        </div>
        
      </section>
    </main> 
  )
}

export default upload