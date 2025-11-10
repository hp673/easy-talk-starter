import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Check, ChevronDown, Info } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  location: string;
}

const mockSites: Site[] = [
  { id: 'site-001', name: 'Texas North', location: 'Houston, TX' },
  { id: 'site-002', name: 'Austin East', location: 'Austin, TX' },
  { id: 'site-003', name: 'Newcastle', location: 'Newcastle, WY' }
];

const SiteSwitcher = () => {
  const [selectedSite, setSelectedSite] = useState<Site>(mockSites[0]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 font-rajdhani min-w-[200px] justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{selectedSite.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px] bg-background z-50">
                <DropdownMenuLabel className="font-rajdhani">Switch Site</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockSites.map((site) => (
                  <DropdownMenuItem
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className="flex items-start gap-3 py-3 cursor-pointer"
                  >
                    <Check 
                      className={`h-4 w-4 mt-0.5 ${
                        selectedSite.id === site.id ? 'opacity-100' : 'opacity-0'
                      }`} 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{site.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {site.location}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>Switch site to view equipment and forms from another work area</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SiteSwitcher;
