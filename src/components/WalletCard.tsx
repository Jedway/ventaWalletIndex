import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { CalendarDays, Info } from "lucide-react"

export type WalletCardProps = {
  name: string;
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
    solana_pay_qr: string | boolean;
  };
  version_tested: string;
  test_date: string;
  notes: string;
};

export function WalletCard({
  name,
  image_url,
  platforms,
  custody_model,
  features,
  version_tested,
  test_date,
  notes,
}: WalletCardProps) {
  return (
    <Card className="bg-muted/40 dark:bg-background border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-w-2xl mx-auto mt-8 text-card-foreground">
      <CardContent className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-muted/30 text-2xl font-bold overflow-hidden">
            {/* Placeholder for icon/image */}
            {image_url ? (
              <img src={image_url} alt={name} className="w-10 h-10 object-contain" />
            ) : (
              "IMG"
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{name}</span>
              <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-emerald-900/50 text-emerald-200 border-emerald-800">{custody_model}</Badge>
            </div>
          </div>
        </div>
        {/* Platforms */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-muted-foreground font-medium mr-2">Platforms</span>
          {platforms.map((platform) => (
            <Badge
              key={platform}
              variant="secondary"
              className={
                "rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 " +
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
        {/* Features Grid */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Badge className={`rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2 ${features.in_app_dex_swap ? "bg-emerald-900/50 text-emerald-200 border-emerald-800" : "bg-red-900/40 text-red-200 border-red-800"}`}><span>{features.in_app_dex_swap ? "✓" : "✗"}</span>DEX Swap</Badge>
          <Badge className={`rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2 ${features.nft_gallery ? "bg-emerald-900/50 text-emerald-200 border-emerald-800" : "bg-red-900/40 text-red-200 border-red-800"}`}><span>{features.nft_gallery ? "✓" : "✗"}</span>NFT Gallery</Badge>
          <Badge className={`rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2 ${features.push_notifications ? "bg-emerald-900/50 text-emerald-200 border-emerald-800" : "bg-red-900/40 text-red-200 border-red-800"}`}><span>{features.push_notifications ? "✓" : "✗"}</span>Push Notifications</Badge>
          <Badge className={`rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2 ${features.in_app_staking ? "bg-emerald-900/50 text-emerald-200 border-emerald-800" : "bg-red-900/40 text-red-200 border-red-800"}`}><span>{features.in_app_staking ? "✓" : "✗"}</span>Staking</Badge>
          <Badge className={`rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2 ${features.fiat_on_ramp ? "bg-emerald-900/50 text-emerald-200 border-emerald-800" : "bg-red-900/40 text-red-200 border-red-800"}`}><span>{features.fiat_on_ramp ? "✓" : "✗"}</span>Fiat On-Ramp</Badge>
          <Badge className={`rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2 ${features.fiat_off_ramp ? "bg-emerald-900/50 text-emerald-200 border-emerald-800" : "bg-red-900/40 text-red-200 border-red-800"}`}><span>{features.fiat_off_ramp ? "✓" : "✗"}</span>Fiat Off-Ramp</Badge>
          <Badge className={`rounded-full px-3 py-2 text-sm font-medium flex items-center gap-2 ${features.solana_pay_qr === true || features.solana_pay_qr === "Yes" ? "bg-emerald-900/50 text-emerald-200 border-emerald-800" : features.solana_pay_qr === "Partial" ? "bg-yellow-900/40 text-yellow-200 border-yellow-800" : "bg-red-900/40 text-red-200 border-red-800"}`}><span>{features.solana_pay_qr === true || features.solana_pay_qr === "Yes" ? "✓" : features.solana_pay_qr === "Partial" ? "~" : "✗"}</span>Solana Pay QR</Badge>
        </div>
        {/* Footer */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CalendarDays className="w-4 h-4" />
            <span>Tested: {test_date}</span>
            <span className="ml-auto text-xs text-muted-foreground">v{version_tested}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300 text-xs bg-blue-900/40 rounded-md px-3 py-2 mt-1">
            <Info className="w-4 h-4" />
            <span>{notes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 