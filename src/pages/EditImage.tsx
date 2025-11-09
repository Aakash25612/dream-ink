import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, RotateCw, Pencil, Sun, Contrast, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Canvas as FabricCanvas, PencilBrush, FabricImage } from "fabric";

const EditImage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { imageUrl, prompt, creationId } = location.state || {};

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "draw">("select");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#00ff00");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
    });

    // Load image
    FabricImage.fromURL(imageUrl, {
      crossOrigin: "anonymous",
    }).then((img) => {
      // Scale to fit canvas
      const scale = Math.min(
        canvas.width! / img.width!,
        canvas.height! / img.height!
      );
      img.scale(scale);
      
      canvas.backgroundImage = img;
      canvas.renderAll();
    });

    // Initialize brush
    const brush = new PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);

    return () => {
      canvas?.dispose();
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = brushColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [activeTool, brushColor, brushSize, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const filterStr = `brightness(${brightness}%) contrast(${contrast}%)`;
    const canvasEl = fabricCanvas.getElement();
    if (canvasEl) {
      canvasEl.style.filter = filterStr;
    }
  }, [brightness, contrast, fabricCanvas]);

  const handleSave = async () => {
    if (!fabricCanvas) return;

    try {
      // Export canvas as image
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });

      // Download the edited image
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `cretera-edited-${Date.now()}.png`;
      link.click();

      toast({
        title: "Image saved",
        description: "Edited image downloaded successfully",
      });

      navigate("/creations");
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save image",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    fabricCanvas?.clear();
    
    if (imageUrl && fabricCanvas) {
      FabricImage.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      }).then((img) => {
        const scale = Math.min(
          fabricCanvas.width! / img.width!,
          fabricCanvas.height! / img.height!
        );
        img.scale(scale);
        
        fabricCanvas.backgroundImage = img;
        fabricCanvas.renderAll();
      });
    }
  };

  if (!imageUrl) {
    navigate("/home");
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl text-foreground">Edit Image</h1>
        </div>

        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Canvas */}
        <div className="mb-6 border-2 border-primary/30 rounded-lg overflow-hidden bg-card/50">
          <canvas ref={canvasRef} />
        </div>

        {/* Tools */}
        <div className="w-full max-w-2xl space-y-4">
          {/* Tool Selection */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant={activeTool === "select" ? "default" : "outline"}
              onClick={() => setActiveTool("select")}
              className="rounded-full"
            >
              Select
            </Button>
            <Button
              variant={activeTool === "draw" ? "default" : "outline"}
              onClick={() => setActiveTool("draw")}
              className="rounded-full"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Draw
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full"
            >
              <Palette className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-full"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Brush Controls */}
          {activeTool === "draw" && (
            <div className="bg-card rounded-2xl p-4 space-y-4">
              <div>
                <label className="text-foreground text-sm mb-2 block">Brush Size: {brushSize}px</label>
                <Slider
                  value={[brushSize]}
                  onValueChange={(val) => setBrushSize(val[0])}
                  min={1}
                  max={50}
                  step={1}
                />
              </div>
              <div>
                <label className="text-foreground text-sm mb-2 block">Brush Color</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Filter Controls */}
          {showFilters && (
            <div className="bg-card rounded-2xl p-4 space-y-4">
              <div>
                <label className="text-foreground text-sm mb-2 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Brightness: {brightness}%
                </label>
                <Slider
                  value={[brightness]}
                  onValueChange={(val) => setBrightness(val[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>
              <div>
                <label className="text-foreground text-sm mb-2 flex items-center gap-2">
                  <Contrast className="w-4 h-4" />
                  Contrast: {contrast}%
                </label>
                <Slider
                  value={[contrast]}
                  onValueChange={(val) => setContrast(val[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditImage;
