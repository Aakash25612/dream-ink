import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Creations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { generatedImage, prompt } = location.state || {};

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'cretera-creation.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground">My Creations</h1>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {generatedImage ? (
          <div className="space-y-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={generatedImage}
                alt={prompt || "Generated creation"}
                className="w-full h-auto"
              />
            </div>

            {/* Prompt */}
            {prompt && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-foreground font-medium mb-2">Prompt</h3>
                <p className="text-muted-foreground">{prompt}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => navigate("/home")}
                variant="outline"
                className="flex-1 rounded-full py-6 border-border text-foreground hover:bg-card"
              >
                Create Another
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No creations yet.</p>
            <Button
              onClick={() => navigate("/home")}
              className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6"
            >
              Start Creating
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-muted-foreground text-xs text-center py-8 mt-12">
        © 2025 Cretera — Designed & Created by Aradhya Garhewal. All rights reserved.
      </footer>
    </div>
  );
};

export default Creations;
