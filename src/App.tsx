import { useState, useMemo, useEffect } from "react"
import { Switch } from "./components/ui/switch"
import { ThemeProvider, useTheme } from "./components/theme-provider"
import { Card, CardContent, CardHeader } from "./components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select"
import { Separator } from "./components/ui/separator"
import { WalletCard } from "./components/WalletCard"
import walletsData from "./data/wallets.json"
import logo from "./assets/venta.webp"
import { Menu, SearchIcon, Github, Download } from "lucide-react"
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./components/ui/command"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogDescription,
} from "./components/ui/alert-dialog"

// Add type definitions
type WalletFeatures = {
  in_app_dex_swap: boolean;
  nft_gallery: boolean;
  in_app_staking: boolean;
  fiat_on_ramp: boolean;
  fiat_off_ramp: boolean;
  push_notifications: boolean;
  solana_pay_qr: string;
};

type Wallet = {
  name: string;
  platforms: string[];
  custody_model: string;
  features: WalletFeatures;
  version_tested: string;
  test_date: string;
  notes: string;
};

function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
      aria-label="Toggle theme"
    />
  )
}

function AboutDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors border border-border shadow-sm">
          About
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center mb-4">About Solana Wallet Index</AlertDialogTitle>
          <AlertDialogDescription className="text-center leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            <br /><br />
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-row sm:justify-center">
          <AlertDialogAction className="sm:w-24">Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function StatsDialog({ totalWallets, selfCustody, mobile, qrSupport }: { totalWallets: number; selfCustody: number; mobile: number; qrSupport: number }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors border border-border shadow-sm">
          Stats
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center mb-4">Wallet Statistics</AlertDialogTitle>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-bold">{totalWallets}</span>
              <span className="text-xs text-muted-foreground mt-1">Total Wallets</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-bold">{selfCustody}</span>
              <span className="text-xs text-muted-foreground mt-1">Self-Custody</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-bold">{mobile}</span>
              <span className="text-xs text-muted-foreground mt-1">Mobile</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-bold">{qrSupport}</span>
              <span className="text-xs text-muted-foreground mt-1">QR Support</span>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-row sm:justify-center">
          <AlertDialogAction className="sm:w-24">Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function GitHubButton() {
  return (
    <a
      href="https://github.com/Jedway/ventaWalletIndex"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors border border-border shadow-sm gap-2"
    >
      <Github className="h-4 w-4" />
      <span className="hidden sm:inline">GitHub</span>
    </a>
  )
}

function DownloadButton() {
  const handleDownload = () => {
    // Convert features object to columns
    const featureColumns = [
      'in_app_dex_swap',
      'nft_gallery',
      'in_app_staking',
      'fiat_on_ramp',
      'fiat_off_ramp',
      'push_notifications',
      'solana_pay_qr'
    ] as (keyof WalletFeatures)[];

    // Create CSV headers
    const headers = [
      'name',
      'platforms',
      'custody_model',
      ...featureColumns,
      'version_tested',
      'test_date',
      'notes'
    ].join(',');

    // Convert wallet data to CSV rows
    const rows = walletsData.wallets.map((wallet: Wallet) => {
      const platforms = `"${wallet.platforms.join(', ')}"`;
      const features = featureColumns.map(feature => 
        typeof wallet.features[feature] === 'boolean' 
          ? wallet.features[feature] ? 'Yes' : 'No'
          : wallet.features[feature]
      );
      
      return [
        `"${wallet.name}"`,
        platforms,
        `"${wallet.custody_model}"`,
        ...features,
        `"${wallet.version_tested}"`,
        `"${wallet.test_date}"`,
        `"${wallet.notes.replace(/"/g, '""')}"` // Escape quotes in notes
      ].join(',');
    });

    // Combine headers and rows
    const csv = [headers, ...rows].join('\n');

    try {
      // Create and trigger download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'solana_wallets.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors border border-border shadow-sm gap-2"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Download CSV</span>
    </button>
  );
}

function HamburgerMenu({ open, setOpen, children, statsDialog }: { open: boolean; setOpen: (v: boolean) => void; children?: React.ReactNode; statsDialog?: React.ReactNode }) {
  return (
    <>
      <button
        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Open menu"
        onClick={() => setOpen(!open)}
      >
        <Menu className="h-7 w-7" />
      </button>
      <div
        className={`fixed inset-0 z-50 bg-black/40 flex justify-end md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <nav
          className={`bg-background w-64 h-full shadow-lg p-6 flex flex-col gap-6 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button
            className="self-end mb-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <span className="text-2xl">×</span>
          </button>
          <div className="flex flex-col gap-4">
            <AboutDialog />
            <GitHubButton />
            <DownloadButton />
          </div>
          <div className="pt-4 border-t border-border mt-4 flex justify-center">
            {children}
          </div>
          <div className="pt-4 border-t border-border mt-4 flex justify-center">
            {statsDialog}
          </div>
        </nav>
      </div>
    </>
  )
}

export default function App() {
  // Filter/search state
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [custody, setCustody] = useState("all");
  const [feature, setFeature] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Add keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Filtering logic
  const filteredWallets = useMemo(() => {
    return walletsData.wallets.filter((wallet) => {
      // Search by name (case-insensitive)
      if (search && !wallet.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Platform filter
      if (platform !== "all" && !wallet.platforms.map((p: string) => p.toLowerCase()).includes(platform)) {
        return false;
      }
      // Custody model filter
      if (custody !== "all") {
        if (custody === "self" && !wallet.custody_model.toLowerCase().includes("self")) return false;
        if (custody === "third-party" && !wallet.custody_model.toLowerCase().includes("custodial")) return false;
      }
      // Feature filter
      if (feature !== "all") {
        if (feature === "staking" && !wallet.features.in_app_staking) return false;
        if (feature === "nft" && !wallet.features.nft_gallery) return false;
        // Add more features as needed
      }
      return true;
    });
  }, [search, platform, custody, feature]);

  // Stats for accordion
  const totalWallets = walletsData.wallets.length;
  const selfCustody = walletsData.wallets.filter(w => w.custody_model.toLowerCase().includes("self")).length;
  const mobile = walletsData.wallets.filter(w => w.platforms.some((p: string) => ["ios", "android", "mobile app"].includes(p.toLowerCase()))).length;
  const qrSupport = walletsData.wallets.filter(w => {
    const qr = w.features.solana_pay_qr;
    return qr === "Yes" || qr === "Partial";
  }).length;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search wallets..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>No wallets found.</CommandEmpty>
          <CommandGroup heading="Wallets">
            {filteredWallets.map((wallet) => (
              <CommandItem
                key={wallet.name}
                value={wallet.name}
                onSelect={() => {
                  setSearch(wallet.name)
                  setCommandOpen(false)
                }}
              >
                {wallet.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Fixed Header */}
      <header className="w-full bg-background border-b border-border shadow-lg rounded-xl py-4 px-6 flex items-center justify-between fixed top-0 left-0 z-50">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Solana Wallet Index Logo" className="h-8 w-auto invert dark:invert-0" />
        </div>
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <HamburgerMenu 
              open={menuOpen} 
              setOpen={setMenuOpen} 
              statsDialog={<StatsDialog totalWallets={totalWallets} selfCustody={selfCustody} mobile={mobile} qrSupport={qrSupport} />}
            >
              <ThemeSwitch />
            </HamburgerMenu>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <AboutDialog />
            <GitHubButton />
            <DownloadButton />
            <StatsDialog totalWallets={totalWallets} selfCustody={selfCustody} mobile={mobile} qrSupport={qrSupport} />
            <ThemeSwitch />
          </div>
        </div>
      </header>

      {/* Sticky Filter Card */}
      <div className="w-full flex justify-center sticky top-20 left-0 z-30">
        <Card className="w-full max-w-[95%] lg:max-w-[85%] shadow-xl py-2 flex items-center justify-center">
          <CardHeader className="pb-2 hidden" />
          <CardContent className="pt-0 w-full px-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
              <div className="w-full md:w-[30%] min-w-[180px]">
                <button
                  onClick={() => setCommandOpen(true)}
                  className="w-full flex items-center h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <span className="flex-1 text-left text-muted-foreground">Search...</span>
                  <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </button>
              </div>
              <div className="flex flex-row gap-1.5 w-full md:flex-1 py-2 md:py-0">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium text-muted-foreground mb-1 text-center">Platform</span>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="ios">iOS</SelectItem>
                      <SelectItem value="android">Android</SelectItem>
                      <SelectItem value="chrome">Chrome</SelectItem>
                      <SelectItem value="firefox">Firefox</SelectItem>
                      <SelectItem value="windows">Windows</SelectItem>
                      <SelectItem value="macos">macOS</SelectItem>
                      <SelectItem value="linux">Linux</SelectItem>
                      <SelectItem value="hardware (usb)">Hardware (USB)</SelectItem>
                      <SelectItem value="hardware (bluetooth)">Hardware (Bluetooth)</SelectItem>
                      <SelectItem value="hardware (nfc card)">Hardware (NFC card)</SelectItem>
                      <SelectItem value="mobile app">Mobile App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium text-muted-foreground mb-1 text-center">Custody</span>
                  <Select value={custody} onValueChange={setCustody}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Custody Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="self">Self-custody</SelectItem>
                      <SelectItem value="third-party">Custodial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium text-muted-foreground mb-1 text-center">Features</span>
                  <Select value={feature} onValueChange={setFeature}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Features" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="staking">Staking</SelectItem>
                      <SelectItem value="nft">NFT Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Scrollable Content */}
      <div className="pt-[8.5rem] pb-24 w-full min-h-screen">
        <Separator className="w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center mt-4">
          {filteredWallets.map((wallet) => (
            <WalletCard key={wallet.name} {...wallet} />
          ))}
        </div>
      </div>
      <footer className="w-full bg-background border-t border-border shadow-inner py-4 px-6 text-center text-muted-foreground fixed bottom-0 left-0 z-50">
        <span>© 2025 Solana Wallet Index.</span>
      </footer>
    </ThemeProvider>
  )
}
