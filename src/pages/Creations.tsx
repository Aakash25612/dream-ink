import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Creation {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

const Creations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreations();
  }, []);

  const fetchCreations = async () => {
    try {
      const { data, error } = await supabase
        .from('creations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCreations(data || []);
    } catch (error) {
      console.error('Error fetching creations:', error);
      toast({
        title: "Error",
        description: "Failed to load creations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `cretera-${prompt.slice(0, 30).replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('creations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCreations(creations.filter(c => c.id !== id));
      toast({
        title: "Deleted",
        description: "Creation deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting creation:', error);
      toast({
        title: "Error",
        description: "Failed to delete creation",
        variant: "destructive",
      });
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
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading creations...</p>
          </div>
        ) : creations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creations.map((creation) => (
              <div
                key={creation.id}
                className="bg-card border border-border rounded-2xl overflow-hidden group"
              >
                {/* Image */}
                <div className="aspect-square bg-secondary/50 relative overflow-hidden">
                  <img
                    src={creation.image_url}
                    alt={creation.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDownload(creation.image_url, creation.prompt)}
                      className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center"
                    >
                      <Download className="w-5 h-5 text-primary-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(creation.id)}
                      className="w-10 h-10 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5 text-destructive-foreground" />
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                <div className="p-4">
                  <p className="text-foreground/80 text-sm line-clamp-2">
                    {creation.prompt}
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    {new Date(creation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No creations yet.</p>
            <Button
              onClick={() => navigate("/home")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6"
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
