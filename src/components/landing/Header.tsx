import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MT</span>
            </div>
            <span className="text-xl font-bold text-foreground">MineTrak</span>
          </div>
          
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
