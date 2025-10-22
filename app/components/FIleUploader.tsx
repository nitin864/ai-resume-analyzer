import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps{
    onFileSelect?: (file: File | null) => void
}

const FIleUploader = ({ onFileSelect} : FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
     const file = acceptedFiles[0] || null;

     onFileSelect?.(file);

  }, [onFileSelect]);


  const { getRootProps, getInputProps, isDragActive ,acceptedFiles } = useDropzone({ onDrop });
  const [file ,setFile] = useState();
  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
         <div className="space-y-4 cursor-pointer">
            <div className="mx-auto w-16 h-16 flex items-center justify-center">
                <img src="/icons/info.svg" alt="upload" className="size-20"></img>
            </div>

            {file ? (
                <div>

                </div>
            ): (
                <div>
                    <p className="text-lg text-gray-500">
                        <span className="font-bold">
                            Click to Upload
                        </span> or Drag and Drop
                    </p>
                    <p className="text-lg text-gray-500"> PDF (max 15MB)</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default FIleUploader;
