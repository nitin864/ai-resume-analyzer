import React, { useState } from "react";
import type { FormEvent } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FIleUploader";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

/* ------------------ Helper Functions (No console logs) ------------------ */

const getUploadPath = (item: any) => {
  try {
    if (!item) return null;
    return item.path ?? item.key ?? item.Location ?? item.url ?? item.publicUrl ?? item;
  } catch {
    return null;
  }
};

async function arrayBufferToFile(ab: ArrayBuffer, filename = "converted.png", type = "image/png") {
  try {
    const blob = new Blob([ab], { type });
    return new File([blob], filename, { type });
  } catch {
    return null;
  }
}

async function toFile(input: unknown, filename = "converted.png", mime = "image/png"): Promise<File | null> {
  try {
    if (!input) return null;

    if (input instanceof File) return input;
    if (input instanceof Blob) return new File([input], filename, { type: input.type || mime });
    if (input instanceof ArrayBuffer) return await arrayBufferToFile(input, filename, mime);

    // typed arrays
    // @ts-ignore
    if (typeof input === "object" && input && "buffer" in input && input.buffer instanceof ArrayBuffer) {
      // @ts-ignore
      return await arrayBufferToFile(input.buffer, filename, mime);
    }

    // data URL string
    if (typeof input === "string" && input.startsWith("data:")) {
      const res = await fetch(input);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type || mime });
    }

    // shapes like { dataUrl } or { image }
    // @ts-ignore
    if (typeof input === "object" && input && "dataUrl" in input && typeof input.dataUrl === "string") {
      // @ts-ignore
      const res = await fetch(input.dataUrl);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type || mime });
    }
    // @ts-ignore
    if (typeof input === "object" && input && "image" in input && (input.image instanceof Blob || input.image instanceof File)) {
      // @ts-ignore
      const image = input.image as Blob;
      return new File([image], filename, { type: image.type || mime });
    }

    return null;
  } catch {
    return null;
  }
}

/* -------------------------- Main Upload Component -------------------------- */

const Upload: React.FC = () => {
  const { fs, ai, kv } = usePuterStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (f: File | null) => {
    setFile(f);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file: resumeFile,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading your file...");

    try {
      // Upload resume
      const rawUpload = await fs.upload([resumeFile]);
      const uploadedFile = Array.isArray(rawUpload) ? rawUpload[0] : rawUpload;
      const resumePath = getUploadPath(uploadedFile);
      if (!resumePath) throw new Error("Failed to upload file.");

      // Convert PDF to image
      setStatusText("Converting PDF to image...");
      let convertResult: unknown;
      try {
        convertResult = await convertPdfToImage(resumeFile);
      } catch {
        const ab = await resumeFile.arrayBuffer();
        convertResult = await (convertPdfToImage as any)(ab);
      }

      const possibleFile =
        convertResult && typeof convertResult === "object" && "file" in (convertResult as any)
          ? (convertResult as any).file
          : convertResult;

      const imageFile = await toFile(
        possibleFile,
        `${resumeFile.name.replace(/\.[^/.]+$/, "")}-page-1.png`,
        "image/png"
      );
      if (!imageFile) throw new Error("Failed to convert PDF to image.");

      // Upload converted image
      setStatusText("Uploading converted image...");
      const rawImgUpload = await fs.upload([imageFile]);
      const uploadedImage = Array.isArray(rawImgUpload) ? rawImgUpload[0] : rawImgUpload;
      const imagePath = getUploadPath(uploadedImage);
      if (!imagePath) throw new Error("Failed to upload image.");

      // Save metadata
      setStatusText("Saving metadata...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath,
        imagePath,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // AI analysis
      setStatusText("Analyzing resume...");
      const aiResponse = await ai.feedback(resumePath, prepareInstructions({ jobTitle, jobDescription }));
      if (!aiResponse) throw new Error("AI analysis failed.");

      const content = aiResponse.message?.content;
      let feedbackText: string | null = null;
      if (typeof content === "string") feedbackText = content;
      else if (Array.isArray(content) && content.length > 0)
        feedbackText = content[0]?.text ?? JSON.stringify(content[0]);
      else if (typeof content === "object" && "text" in content) feedbackText = (content as any).text;
      else feedbackText = JSON.stringify(content);

      if (!feedbackText) throw new Error("Failed to extract AI feedback.");

      let parsedFeedback: any = feedbackText;
      try {
        parsedFeedback = JSON.parse(feedbackText);
      } catch {
        parsedFeedback = feedbackText;
      }

      data.feedback = parsedFeedback;
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // ---- NEW: log everything to console instead of redirecting ----
      setStatusText("Analysis complete — check console for results.");
      // Log useful debug info (resume/image paths, DB record, AI response, parsed feedback)
      // NOTE: per your original request: these are console logs for debugging — keep sensitive info in mind.
      // eslint-disable-next-line no-console
      console.log("=== Resume Analysis Result ===");
      // eslint-disable-next-line no-console
      console.log("UUID:", uuid);
      // eslint-disable-next-line no-console
      console.log("Stored metadata (kv):", data);
      // eslint-disable-next-line no-console
      console.log("Resume upload object / path:", resumePath, uploadedFile);
      // eslint-disable-next-line no-console
      console.log("Image upload object / path:", imagePath, uploadedImage);
      // eslint-disable-next-line no-console
      console.log("Raw AI response:", aiResponse);
      // eslint-disable-next-line no-console
      console.log("Parsed feedback:", parsedFeedback);
      // If your AI returns ATS score or structured fields, they will appear in `parsedFeedback`.
      // You can further inspect `parsedFeedback` here.
      // -------------------------------------------------------------

    } catch (err: any) {
      setStatusText(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const companyName = (formData.get("company-name") as string) ?? "";
    const jobTitle = (formData.get("job-title") as string) ?? "";
    const jobDescription = (formData.get("job-description") as string) ?? "";

    if (!file) {
      setStatusText("Please upload a resume first.");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  /* --------------------------- JSX Rendering --------------------------- */

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" alt="processing" />
            </>
          ) : (
            <h2>{statusText || "Drop your resume for an ATS score and improvement tips"}</h2>
          )}

          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
