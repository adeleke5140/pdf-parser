"use client";

import { useState } from "react";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const parsePDF = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setParsedData(result.data);
      } else {
        console.error("Parsing failed:", result.error);
        setParsedData({ error: result.error });
      }
    } catch (error) {
      console.error("Request failed:", error);
      setParsedData({ error: "Failed to parse PDF" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "InterVariable",
      }}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            PDF Whisperer
          </h1>
          <p className="text-lg text-foreground/70">
            Drop your PDF and watch the magic happen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div
              className="border-2 border-dashed shadow border-foreground/20 hover:border-foreground/40 transition-colors rounded-lg p-8 text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <div className="space-y-4">
                <div className="text-4xl grid place-items-center">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-20"
                  >
                    <path
                      d="M14 2.26946V6.4C14 6.96005 14 7.24008 14.109 7.45399C14.2049 7.64215 14.3578 7.79513 14.546 7.89101C14.7599 8 15.0399 8 15.6 8H19.7305M20 9.98822V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V6.8C4 5.11984 4 4.27976 4.32698 3.63803C4.6146 3.07354 5.07354 2.6146 5.63803 2.32698C6.27976 2 7.11984 2 8.8 2H12.0118C12.7455 2 13.1124 2 13.4577 2.08289C13.7638 2.15638 14.0564 2.27759 14.3249 2.44208C14.6276 2.6276 14.887 2.88703 15.4059 3.40589L18.5941 6.59411C19.113 7.11297 19.3724 7.3724 19.5579 7.67515C19.7224 7.94356 19.8436 8.2362 19.9171 8.5423C20 8.88757 20 9.25445 20 9.98822Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium">Drop your PDF here</p>
                  <p className="text-sm text-foreground/60">
                    or click to browse
                  </p>
                </div>
                {uploadedFile && (
                  <div className="bg-foreground/5 rounded-xl p-3 mt-4">
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-foreground/60">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={parsePDF}
              disabled={isLoading}
              className="w-full bg-blue-500 border shadow text-white font-semibold py-3 px-6 rounded-xl transition-colors hover:bg-blue-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Parsing..." : "Parse PDF"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6 h-[400px] overflow-y-auto font-mono text-sm">
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-foreground/10 rounded w-1/4"></div>
                    <div className="h-3 bg-foreground/10 rounded w-3/4"></div>
                    <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-foreground/10 rounded w-1/3"></div>
                    <div className="h-3 bg-foreground/10 rounded w-2/3"></div>
                    <div className="h-3 bg-foreground/10 rounded w-3/4"></div>
                    <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-foreground/10 rounded w-1/4"></div>
                    <div className="h-3 bg-foreground/10 rounded w-full"></div>
                    <div className="h-3 bg-foreground/10 rounded w-5/6"></div>
                    <div className="h-3 bg-foreground/10 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-foreground/10 rounded w-1/5"></div>
                    <div className="h-3 bg-foreground/10 rounded w-1/3"></div>
                    <div className="h-3 bg-foreground/10 rounded w-1/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-foreground/10 rounded w-1/3"></div>
                    <div className="h-3 bg-foreground/10 rounded w-3/4"></div>
                    <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
                    <div className="h-3 bg-foreground/10 rounded w-2/3"></div>
                  </div>
                </div>
              ) : parsedData ? (
                <pre
                  style={{
                    fontFamily: "Berkeley Mono",
                  }}
                  className="whitespace-pre-wrap overflow-x-auto"
                >
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              ) : (
                <div className="text-foreground/50 italic">
                  Upload and parse a PDF to see the extracted data here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
