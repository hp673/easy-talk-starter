import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import minetrakLogo from "@/assets/minetrak-logo-light-bg.png";
import { useAuth } from "@/contexts/AuthContext";
import { RoleViewSwitcher } from "@/components/RoleViewSwitcher";
import SiteSwitcher from "@/components/SiteSwitcher";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src={minetrakLogo} 
              alt="MineTrak Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <SiteSwitcher />
                <RoleViewSwitcher />
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="gap-2 font-rajdhani font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <Button 
                onClick={() => navigate('/login')}
                variant="default"
                className="gap-2 font-rajdhani font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
