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
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showAdminReset, setShowAdminReset] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !pin) {
      toast({
        title: "Missing Information",
        description: "Please select a user and enter PIN",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await login(pin, selectedUserId);
      if (success) {
        const user = mockUsers.find(u => u.id === selectedUserId);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user?.name}!`,
        });
        
        // Navigate based on user role
        switch (user?.role) {
          case 'operator':
            navigate('/equipment-selection');
            break;
          case 'technician':
            navigate('/maintenance-dashboard');
            break;
          case 'site_manager':
            navigate('/site-manager-dashboard');
            break;
          case 'admin':
            navigate('/admin-portal');
            break;
          default:
            navigate('/equipment-selection');
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
            {isOnline ? (
              <div className="status-online">
                <Wifi className="h-4 w-4" />
                Online
              </div>
            ) : (
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
                <Label htmlFor="user-select">User ID</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="input-mining">
                    <SelectValue placeholder="Select User ID">
                      {selectedUserId && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {selectedUserId}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{user.id}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {user.role.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                disabled={loading || !selectedUserId || !pin}
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
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
              <div className="text-xs space-y-2">
                <p className="font-medium">Demo Credentials:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>OP001: 1234</div>
                  <div>TECH002: 5678</div>
                  <div>MGR003: 9999</div>
                  <div>ADM004: 0000</div>
                </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;