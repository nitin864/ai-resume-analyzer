import type { ClassValue } from 'clsx';
import {prepareInstructions} from "../../constants";
import React, { useState, type FormEvent } from 'react'
import { text } from 'stream/consumers';
import FIleUploader from '~/components/FIleUploader';
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';

const upload = () => {
  const [isProcessing , setIsProcessing] = useState(false);
  const [statusText , setStatusText] = useState('');
  const [file , setFile] = useState<File | null>(null); 
  const {auth , isLoading , ai,fs,kv} = usePuterStore();  

  
  const handleFileSelect = (file: File | null) => {
       setFile(file)
  }
   
  const handleAnalyzer = async({companyName , jobTitle , jobDescription , file} : {companyName: string , jobTitle: string , jobDescription: string , file: File}) => {
        setIsProcessing(true);
        setStatusText('Uploading your Resume...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Failed to upload your Resume!')

        setStatusText('converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Failed to Convert PDF to Image');
        
        setStatusText('Uploading the Image...');
        const uploadedImage =  await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Failed to upload Image');

        setStatusText('Preparing Data....');
        const uuid = generateUUID();

        const data = {
          id: uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName,
          jobTitle,
          jobDescription,
          feedback: '',
        }

        await kv.set(`resume: ${uuid}` , JSON.stringify(data));
        
        setStatusText('Analyzing....');

        const feedback = await ai.feedback(
           uploadedFile.path,
           prepareInstructions({jobTitle , jobDescription})
            
        ); 
        
        if (!feedback) return setStatusText('Error analyzing Your Resume...')
        
        const feedbackText = typeof feedback.message.content === 'string' 
        ? feedback.message.content 
        : feedback.message.content[0].text
  }       

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       const form = e.currentTarget.closest('form');
       if(!form) return;
       const formData = new FormData(form);

       const companyName = formData.get('company-name') as string;
       const jobTitle = formData.get('job-title') as string;  
       const jobDescription = formData.get('job-description') as string;
       
       if(!file) return;
       
      handleAnalyzer({companyName , jobTitle , jobDescription , file});
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
                <FIleUploader onFileSelect={handleFileSelect} />
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