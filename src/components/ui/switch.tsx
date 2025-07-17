import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { Sun, Moon } from "lucide-react"
import { cn } from "../../lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-10 w-20 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* Sun icon for dark mode (checked) */}
      <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 transition-opacity duration-200 data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0 pointer-events-none">
        <Sun size={20} className="text-yellow-400" />
      </span>
      {/* Moon icon for light mode (unchecked) */}
      <span className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 transition-opacity duration-200 data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100 pointer-events-none">
        <Moon size={20} className="text-blue-500" />
      </span>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-8 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-10 data-[state=unchecked]:translate-x-0 border border-border shadow"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
