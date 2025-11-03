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
import { MapPin, Check, ChevronDown } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  location: string;
}

const mockSites: Site[] = [
  { id: 'site-001', name: 'North Pit Mine', location: 'Queensland, Australia' },
  { id: 'site-002', name: 'South Processing Plant', location: 'Western Australia' },
  { id: 'site-003', name: 'East Ridge Exploration', location: 'Northern Territory' }
];

const SiteSwitcher = () => {
  const [selectedSite, setSelectedSite] = useState<Site>(mockSites[0]);

  return (
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
      <DropdownMenuContent align="start" className="w-[300px] bg-background">
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
  );
};

export default SiteSwitcher;
