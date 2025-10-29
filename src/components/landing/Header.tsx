import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import minetrakLogo from "@/assets/minetrak-logo-icon.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src={minetrakLogo} 
              alt="MineTrak Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-rajdhani font-bold text-foreground uppercase tracking-wide">MineTrak</span>
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
