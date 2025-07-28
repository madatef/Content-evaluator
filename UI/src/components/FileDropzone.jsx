import { forwardRef } from 'react';
import { Upload, File } from 'lucide-react';

const FileDropzone = forwardRef(({ onFileSelect, fileInputRef, selectedFile }, ref) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-700', 'bg-slate-800');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-700', 'bg-slate-800');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-700', 'bg-slate-800');
    
    if (e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  // Don't show dropzone if a file is already selected
  if (selectedFile) {
    return null;
  }

  return (
    <div
      className="border-2 border-dashed border-slate-700 hover:border-blue-700 rounded-lg p-6 transition-all duration-200 cursor-pointer text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="h-full w-full rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      </div>
      
      <div className="relative flex flex-col items-center justify-center gap-3">
        <div className="p-3 bg-gradient-to-r from-blue-950 to-blue-900 rounded-full border border-blue-800">
          <Upload size={24} className="text-blue-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-gray-300 font-medium">Drag & drop your file here</h3>
          <p className="text-gray-400 text-sm">or click to browse files</p>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Supported formats: Images, PDF
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
});

FileDropzone.displayName = 'FileDropzone';

export default FileDropzone;