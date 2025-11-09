import { ArrowLeft, Mail, MessageCircle, BookOpen, Shield, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do credits work?",
      answer: "You get 5 free signup credits and 1 daily credit for the first 7 days. Each image generation uses 1 credit. Subscribe to get more credits!"
    },
    {
      question: "What happens to my unused credits?",
      answer: "Signup and subscription credits never expire. Daily credits refresh every 24 hours for 7 days after signup. Referral credits never expire."
    },
    {
      question: "How does the referral system work?",
      answer: "Share your unique referral link with friends. When they sign up, you both get 5 free credits instantly!"
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel anytime from the subscription management page. Your credits will remain active until the end of your billing period."
    },
    {
      question: "What image formats are supported?",
      answer: "We support JPG, PNG, and WebP formats for both uploading reference images and downloading your creations."
    },
    {
      question: "Is my data private?",
      answer: "Yes! All your creations are private by default and only visible to you. We never share your images publicly without your permission."
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground">Help & Support</h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card border-border p-6 text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer">
            <Mail className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground">Email Support</h3>
            <p className="text-sm text-muted-foreground">support@cretera.com</p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Send Email
            </Button>
          </Card>

          <Card className="bg-card border-border p-6 text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer">
            <MessageCircle className="w-8 h-8 text-accent mx-auto" />
            <h3 className="font-semibold text-foreground">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Chat with our team</p>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Start Chat
            </Button>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-card border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-foreground text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Resources */}
        <Card className="bg-card border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Resources</h3>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground"
              onClick={() => window.open("/tutorials", "_blank")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Video Tutorials
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground"
              onClick={() => window.open("/terms", "_blank")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground"
              onClick={() => window.open("/privacy", "_blank")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
          </div>
        </Card>

        {/* App Info */}
        <Card className="bg-card border-border p-6 text-center">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Cretera v1.0.0</p>
            <p>© 2025 Cretera. All rights reserved.</p>
            <p className="text-xs">Your Private World of Creation</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Help;
