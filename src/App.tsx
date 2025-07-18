import { useState, useMemo } from "react"
import { Switch } from "./components/ui/switch"
import { ThemeProvider, useTheme } from "./components/theme-provider"
import { Card, CardContent, CardHeader } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select"
import { Separator } from "./components/ui/separator"
import { WalletCard } from "./components/WalletCard"
import walletsData from "./data/wallets.json"
import logo from "./assets/venta.webp"
import { Menu } from "lucide-react"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "./components/ui/drawer"

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

function StatsDrawer({ totalWallets, selfCustody, mobile, qrSupport }: { totalWallets: number; selfCustody: number; mobile: number; qrSupport: number }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors border border-border shadow-sm">
          Stats
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xs w-full sm:max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Stats</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
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
        <DrawerClose asChild>
          <button className="mt-4 mx-auto block rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/80 transition">Close</button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}

function HamburgerMenu({ open, setOpen, children, statsAccordion }: { open: boolean; setOpen: (v: boolean) => void; children?: React.ReactNode; statsAccordion?: React.ReactNode }) {
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
          {/* Add your menu items here */}
          <a href="#" className="text-lg font-medium py-2 px-2 rounded hover:bg-muted transition-colors">Home</a>
          <a href="#" className="text-lg font-medium py-2 px-2 rounded hover:bg-muted transition-colors">Wallets</a>
          <a href="#" className="text-lg font-medium py-2 px-2 rounded hover:bg-muted transition-colors">About</a>
          <div className="pt-4 border-t border-border mt-4 flex justify-center">
            {children}
          </div>
          <div className="pt-4 border-t border-border mt-4">
            {statsAccordion}
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
      {/* Fixed Header */}
      <header className="w-full bg-background border-b border-border shadow-lg rounded-xl py-4 px-6 flex items-center justify-between fixed top-0 left-0 z-50">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Solana Wallet Index Logo" className="h-8 w-auto invert dark:invert-0" />
        </div>
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} statsAccordion={<StatsDrawer totalWallets={totalWallets} selfCustody={selfCustody} mobile={mobile} qrSupport={qrSupport} />}>
              <ThemeSwitch />
            </HamburgerMenu>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitch />
            <StatsDrawer totalWallets={totalWallets} selfCustody={selfCustody} mobile={mobile} qrSupport={qrSupport} />
          </div>
        </div>
      </header>
      {/* Sticky Filter Card */}
      <div className="w-full flex justify-center sticky top-20 left-0 px-2 z-30">
        <Card className="w-full max-w-4xl shadow-xl px-4 sm:px-6 md:px-8 py-2 flex items-center justify-center">
          <CardHeader className="pb-2 hidden" />
          <CardContent className="pt-0 w-full flex items-center justify-center">
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-6 w-full max-w-3xl">
              <div className="flex-1 min-w-[200px]">
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex flex-row gap-2 md:gap-4 w-full md:w-auto py-2 md:py-0">
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
      <div className="pt-[8.5rem] pb-24 w-full flex flex-col items-center justify-center gap-4 overflow-y-auto min-h-screen">
        <Separator className="w-full" />
        {filteredWallets.map((wallet) => (
          <WalletCard key={wallet.name} {...wallet} />
        ))}
      </div>
      <footer className="w-full bg-background border-t border-border shadow-inner py-4 px-6 text-center text-muted-foreground fixed bottom-0 left-0 z-50">
        <span>© 2025 Solana Wallet Index.</span>
      </footer>
    </ThemeProvider>
  )
}
