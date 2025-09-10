import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Wifi, WifiOff, User, Lock, Shield } from 'lucide-react';
import { mockUsers } from '@/contexts/AuthContext';
import miningEquipment from '@/assets/mining-equipment.jpg';

const LoginScreen = () => {
  const [pin, setPin] = useState('');
  const [userId, setUserId] = useState('');
  const [showAdminReset, setShowAdminReset] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !pin) {
      toast({
        title: "Missing Information",
        description: "Please enter User ID and PIN",
        variant: "destructive",
      });
      return;
    }

    // Check if user ID exists
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      toast({
        title: "Invalid User ID",
        description: "User ID not found. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await login(pin, userId);
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user?.name}!`,
        });
        
        // Navigate based on user role
        switch (user?.role) {
          case 'operator':
            navigate('/operator-dashboard');
            break;
          case 'maintainer':
            navigate('/maintenance-dashboard');
            break;
          case 'admin':
            navigate('/admin-portal');
            break;
          default:
            navigate('/operator-dashboard');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid PIN. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinReset = () => {
    toast({
      title: "PIN Reset Successful",
      description: "New PIN has been sent to the administrator.",
    });
    setShowAdminReset(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header with mining image */}
        <div className="text-center space-y-4">
          <div className="relative">
            <img 
              src={miningEquipment} 
              alt="Mining Equipment" 
              className="w-full h-48 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <div className="flex items-center text-white">
                <Shield className="h-12 w-12 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold">MineTrak</h1>
                  <p className="text-white/80">Equipment Inspection System</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            {!isOnline && (
              <div className="status-offline">
                <WifiOff className="h-4 w-4" />
                Offline
              </div>
            )}
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-id">User ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="user-id"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="input-mining pl-10"
                    placeholder="Enter User ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">PIN (4-6 digits)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="input-mining pl-10"
                    placeholder="Enter PIN"
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="btn-mining w-full"
                disabled={loading || !userId || !pin}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowAdminReset(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot PIN? Request Reset
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Reset Modal */}
        {showAdminReset && (
          <Card>
            <CardHeader>
              <CardTitle>PIN Reset Request</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A new PIN will be generated and provided by your administrator.
              </p>
              <div className="flex gap-2">
                <Button onClick={handlePinReset} className="btn-mining flex-1">
                  Request Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAdminReset(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Credentials */}
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
              <div className="text-sm space-y-3">
                <p className="font-medium text-primary">🔑 Demo Credentials - Primary User Access:</p>
                <div className="space-y-2">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="font-semibold text-success">Primary Inspector (Workplace Exams)</div>
                    <div className="text-sm">User ID: <strong>OP001</strong> | PIN: <strong>1234</strong></div>
                    <div className="text-xs text-muted-foreground mt-1">✓ Can create and edit workplace examinations</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div><strong>Maintainer:</strong> MAINT002: 5678</div>
                    <div><strong>Admin:</strong> ADM003: 0000</div>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;