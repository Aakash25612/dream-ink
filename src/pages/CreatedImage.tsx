import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Edit, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CreatedImage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { imageUrl, prompt, creationId } = location.state || {};

  const [isSharing, setIsSharing] = useState(false);

  if (!imageUrl) {
    navigate("/home");
    return null;
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cretera-${prompt?.slice(0, 30).replace(/\s+/g, '-') || 'creation'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "🖨️ Creation downloaded to your device.",
        description: "Image saved successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);

      // Fetch and prepare the image for sharing
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'cretera-creation.png', { type: 'image/png' });

      // Check if Web Share API is available and can share files
      if (navigator.share && navigator.canShare) {
        const shareData = {
          files: [file],
          title: 'My Cretera Creation',
          text: prompt || 'Check out my creation from Cretera! 🎨✨',
        };

        // Verify this specific data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          // User successfully shared
          toast({
            title: "Shared Successfully!",
            description: "Your creation has been shared"
          });
          return;
        }
      }

      // Fallback: copy image URL to clipboard
      await navigator.clipboard.writeText(imageUrl);
      toast({
        title: "Link Copied",
        description: "Image link copied to clipboard for sharing"
      });
    } catch (error) {
      // User cancelled share dialog - don't show error
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      // Actual error occurred
      console.error('Share error:', error);
      toast({
        title: "Error",
        description: "Could not share image. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleEdit = () => {
    navigate("/edit-image", { 
      state: { imageUrl, prompt, creationId } 
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl text-foreground">Your Creation</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Image Display */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative aspect-square bg-card/50 rounded-2xl overflow-hidden border-2 border-primary/30">
            <img
              src={imageUrl}
              alt={prompt || "Creation"}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Prompt */}
          {prompt && (
            <p className="text-foreground/70 text-center mt-4 text-sm">
              "{prompt}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={handleEdit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
            style={{
              boxShadow: "0 0 20px hsl(200_100%_70% / 0.4), 0 0 40px hsl(217_91%_60% / 0.2)"
            }}
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit
          </Button>

          <Button
            onClick={handleDownload}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
            style={{
              boxShadow: "0 0 20px hsl(200_100%_70% / 0.4), 0 0 40px hsl(217_91%_60% / 0.2)"
            }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>

          <Button
            onClick={handleShare}
            disabled={isSharing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
            style={{
              boxShadow: "0 0 20px hsl(200_100%_70% / 0.4), 0 0 40px hsl(217_91%_60% / 0.2)"
            }}
          >
            <Share2 className="w-5 h-5 mr-2" />
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreatedImage;
