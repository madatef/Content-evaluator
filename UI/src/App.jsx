import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import EvaluationTable from './components/EvaluationTable';
import FileDropzone from './components/FileDropzone';
import { motion } from 'framer-motion';

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [evaluationData, setEvaluationData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setStatus('idle');
    setEvaluationData(null);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!file) return;

    setStatus('uploading');
    setErrorMessage('');

    try {
      // Step 1: Upload to external API
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('https://api.dragify.ai/general/uploader-secret', {
        method: 'POST',
        headers: {'x-api-key': 'uLdiVUo67043G997lIua'},
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('File upload failed');
      const { url } = await uploadRes.json();

      // Step 2: Send to backend evaluation API
      const evalRes = await fetch('http://localhost:5000/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!evalRes.ok) throw new Error('Evaluation failed');
      const { content } = await evalRes.json();
      
      // Parse the content properly
      const cleanJson = content.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanJson);

      setEvaluationData(result);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred');
    }
  };

  const resetForm = () => {
    setFile(null);
    setStatus('idle');
    setEvaluationData(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl relative"
        style={{
          border: '0.1px solid rgb(0, 27, 88, 0.7)',
          borderImage: 'linear-gradient(180deg,rgb(6, 28, 87),rgb(102, 9, 224),rgb(94, 7, 1)) 1',
          backgroundClip: 'padding-box',
        }}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-lg p-[1px]">
          <div className="h-full w-full rounded-lg"></div>
        </div>
        
        {/* Header */}
        <div className="relative p-6 border-b border-transparent" style={{
          background: 'linear-gradient(90deg,rgb(6, 11, 27) 0%,rgb(8, 32, 73) 50%,rgb(3, 9, 24) 100%)',
          borderImage: 'linear-gradient(90deg,rgb(6, 28, 87),rgb(102, 9, 224),rgb(94, 7, 1)) 1',
        }}>
          <div className="flex justify-center items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 text-left">Creative Content Evaluation Tool</h1>
              <p className="text-gray-300 text-left mt-2">Upload files for automatic evaluation and scoring</p>
            </div>
            <img 
              // src="https://docs.vectara.com/img/vectara_wordmark.png" 
              src="../public/ai-bg.png" 
              alt="AI Logo" 
              className="w-40 object-contain rounded"
            />
            
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          {status !== 'success' && (
            <>
              <FileDropzone 
                onFileSelect={handleFileChange} 
                fileInputRef={fileInputRef}
                selectedFile={file}
              />
              
              {file && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Upload size={18} />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-gray-400 text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={resetForm}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-gray-300 rounded-md transition-all duration-200 border border-slate-700 hover:border-slate-600"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={status === 'uploading'}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white rounded-md transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-blue-700 hover:border-blue-600 shadow-lg hover:shadow-blue-900/25"
                    >
                      {status === 'uploading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : 'Evaluate File'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Status Messages */}
          {status === 'uploading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 rounded-md flex items-center gap-3 relative overflow-hidden"
              style={{
                border: '0.1px solid rgb(0, 27, 88, 0.7)',
                borderImage: 'linear-gradient(180deg,rgb(6, 28, 87),rgb(102, 9, 224),rgb(94, 7, 1)) 1',
                backgroundClip: 'padding-box',
              }}
            >
              <div className="absolute inset-0 rounded-md p-[1px] bg-gradient-to-r from-blue-800 to-blue-900">
                <div className="h-full w-full rounded-md bg-gradient-to-r from-slate-900 to-slate-800"></div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-950 to-blue-900 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-500">Processing your file</h3>
                  <p className="text-gray-300 text-sm">This may take a moment...</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 rounded-md flex items-center gap-3 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                border: '1px solid transparent',
                backgroundClip: 'padding-box',
              }}
            >
              <div className="absolute inset-0 rounded-md p-[1px] bg-gradient-to-r from-red-800 to-red-900">
                <div className="h-full w-full rounded-md bg-gradient-to-r from-slate-900 to-slate-800"></div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-red-950 to-red-900 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium text-red-500">Error</h3>
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
                <button 
                  onClick={resetForm}
                  className="ml-auto px-3 py-1 text-sm bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-red-200 rounded-md transition-all duration-200 border border-red-700 hover:border-red-600"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {status === 'success' && evaluationData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-green-950 to-green-900 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-500">Evaluation Complete</h3>
                    <p className="text-green-300 text-sm">File processed successfully</p>
                  </div>
                </div>
                <button 
                  onClick={resetForm}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white rounded-md transition-all duration-200 border border-blue-700 hover:border-blue-600 shadow-lg hover:shadow-blue-900/25"
                >
                  Evaluate Another File
                </button>
              </div>
              
              <EvaluationTable data={evaluationData} />
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        © 2025 Madatef • All Rights Reserved
      </div>
    </div>
  );
}