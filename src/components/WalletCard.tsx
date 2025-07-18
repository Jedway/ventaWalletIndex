import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { CalendarDays, Info } from "lucide-react"
import phantom from '../assets/phantom.svg'
import cakewallet from '../assets/cakewallet.webp'
import fuse from '../assets/fuse.png'
import guarda from '../assets/guarda.png'
import decaf from '../assets/decaf.png'
import glow from '../assets/glow.jpeg'
import coinbase from '../assets/coinbase.svg'
import slope from '../assets/slope.png'
import para from '../assets/para.webp'

// Create a separate types file or move these to a global.d.ts
type ImageImport = string;
declare global {
  interface ImportMetaEnv {
    BASE_URL: string;
  }
}

const walletImages: Record<string, ImageImport> = {
  phantom,
  cakewallet,
  fuse,
  guarda,
  decaf,
  glow,
  coinbase,
  slope,
  para,
}

export type WalletCardProps = {
  name: string;
  image?: string;
  image_url?: string;
  platforms: string[];
  custody_model: string;
  features: {
    in_app_dex_swap: boolean;
    nft_gallery: boolean;
    in_app_staking: boolean;
    fiat_on_ramp: boolean;
    fiat_off_ramp: boolean;
    push_notifications: boolean;
    solana_pay_qr: string;
  };
  version_tested: string;
  test_date: string;
  notes: string;
};

type FeatureKey = keyof WalletCardProps['features'];

const FEATURE_CONFIG: { key: FeatureKey; label: string }[] = [
  { key: 'in_app_dex_swap', label: 'DEX Swap' },
  { key: 'nft_gallery', label: 'NFT Gallery' },
  { key: 'push_notifications', label: 'Push Notifications' },
  { key: 'in_app_staking', label: 'Staking' },
  { key: 'fiat_on_ramp', label: 'Fiat On-Ramp' },
  { key: 'fiat_off_ramp', label: 'Fiat Off-Ramp' },
  { key: 'solana_pay_qr', label: 'Solana Pay QR' },
];

export function WalletCard({
  name,
  image,
  image_url,
  platforms,
  custody_model,
  features,
  version_tested,
  test_date,
  notes,
}: WalletCardProps) {
  const imgSrc = image && walletImages[image] ? walletImages[image] : image_url || undefined;

  // Helper function to determine Solana Pay QR status
  const getSolanaPayStatus = (value: string) => {
    return value === "Yes" || value === "Partial" || value === "No";
  };

  return (
    <Card className="bg-muted/40 dark:bg-background border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl mx-auto mt-8 text-card-foreground w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[420px] h-[540px] flex flex-col will-change-transform transition-transform duration-200 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-2xl">
      <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-muted/30 text-2xl font-bold overflow-hidden">
            {imgSrc ? (
              <img src={imgSrc} alt={name} className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            ) : (
              "IMG"
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold truncate">{name}</h3>
              <Badge className="flex-shrink-0 rounded-full px-2 sm:px-3 py-1 text-xs font-medium bg-emerald-900/50 text-emerald-200 border-emerald-800">{custody_model}</Badge>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="mb-4">
          <span className="text-muted-foreground font-medium text-sm mb-2 block">Platforms</span>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map((platform) => (
              <Badge
                key={platform}
                variant="secondary"
                className={
                  "rounded-full px-2 sm:px-3 py-0.5 text-xs sm:text-sm font-medium flex-shrink-0 " +
                  (platform === "iOS"
                    ? "bg-blue-900/40 text-blue-200 border-blue-800"
                    : platform === "Android"
                    ? "bg-green-900/40 text-green-200 border-green-800"
                    : platform === "Chrome"
                    ? "bg-yellow-900/40 text-yellow-200 border-yellow-800"
                    : platform === "Firefox"
                    ? "bg-orange-900/40 text-orange-200 border-orange-800"
                    : "bg-muted/30 text-muted-foreground border-muted"
                  )
                }
              >
                {platform}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {FEATURE_CONFIG.map(({ key, label }) => (
            <Badge
              key={key}
              className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium flex items-center gap-1.5 ${
                key === 'solana_pay_qr'
                  ? features[key] === "Yes"
                    ? "bg-emerald-900/50 text-emerald-200 border-emerald-800"
                    : features[key] === "Partial"
                    ? "bg-yellow-900/40 text-yellow-200 border-yellow-800"
                    : "bg-red-900/40 text-red-200 border-red-800"
                  : features[key]
                  ? "bg-emerald-900/50 text-emerald-200 border-emerald-800"
                  : "bg-red-900/40 text-red-200 border-red-800"
              }`}
            >
              <span className="flex-shrink-0">
                {key === 'solana_pay_qr'
                  ? features[key] === "Yes"
                    ? "✓"
                    : features[key] === "Partial"
                    ? "~"
                    : "✗"
                  : features[key]
                  ? "✓"
                  : "✗"}
              </span>
              <span className="truncate">{label}</span>
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <CalendarDays className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Tested: {test_date}</span>
            <span className="ml-auto flex-shrink-0">v{version_tested}</span>
          </div>
          <div className="flex items-start gap-2 text-blue-300 text-xs bg-blue-900/40 rounded-md p-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{notes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 