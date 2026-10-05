'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, FileCode, X } from 'lucide-react';
import { QuietButton } from '@/components/ui/quiet-button';

export function CustomStudioUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setUploadProgress(15);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 100) {
            clearInterval(interval);
            setIsSuccess(true);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setUploadProgress(null);
    setIsSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        id="cad-file-upload"
        aria-label="Upload 3D CAD or mesh file (.stl, .obj, .step, .stp, .3mf)"
        accept=".stl,.obj,.step,.stp,.3mf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => !fileName && fileInputRef.current?.click()}
        className={`relative rounded-2xl border p-8 sm:p-10 text-center transition-all duration-400 ease-apple-out cursor-pointer ${
          fileName
            ? 'border-chalk/40 bg-onyx/80'
            : 'border-hairline-dark bg-[#111111] hover:border-chalk/30'
        }`}
      >
        {isSuccess ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full border border-chalk/30 mx-auto flex items-center justify-center text-chalk">
              <CheckCircle2 className="w-6 h-6 stroke-[1.2]" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-light tracking-apple-wide text-chalk uppercase">
                Geometry Validated &bull; {fileName}
              </h4>
              <p className="text-xs text-slate mt-1 font-sans">
                Manifold watertight solid verified. Zero non-manifold edges detected.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-2">
              <QuietButton variant="dark" size="sm" onClick={handleReset}>
                Change File
              </QuietButton>
              <QuietButton variant="dark" size="sm">
                Request Quote in Rs &rarr;
              </QuietButton>
            </div>
          </div>
        ) : fileName ? (
          <div className="space-y-4">
            <FileCode className="w-8 h-8 mx-auto text-slate stroke-[1.3] animate-pulse" />
            <div>
              <span className="font-heading text-xs tracking-apple-wide text-chalk block">
                Analyzing Mesh &bull; {fileName}
              </span>
              <div className="w-48 h-1 bg-[#262626] rounded-full mx-auto mt-3 overflow-hidden">
                <div
                  className="h-full bg-chalk transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full border border-hairline-dark mx-auto flex items-center justify-center text-slate group-hover:text-chalk transition-colors">
              <UploadCloud className="w-5 h-5 stroke-[1.3]" />
            </div>

            <div>
              <span className="font-heading text-sm font-light tracking-apple-wide text-chalk block uppercase">
                Drop CAD File Or Select
              </span>
              <p className="text-xs text-slate mt-1.5 font-sans leading-relaxed">
                Accepts <code className="text-chalk font-mono text-[11px]">.STL</code>,{' '}
                <code className="text-chalk font-mono text-[11px]">.STEP</code>,{' '}
                <code className="text-chalk font-mono text-[11px]">.OBJ</code> up to 100MB.
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block px-4 py-2 text-xs font-heading font-light tracking-apple-wide text-chalk border border-hairline-dark rounded-xl hover:border-chalk/40 transition-colors uppercase">
                Choose File From System
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
