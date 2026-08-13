"use client"

import {
  SwitchButton,
  SwitchField,
  type SwitchFieldProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

/*
 * `SwitchField` + `SwitchButton`, not the bare `Switch` — react-aria-components
 * deprecated that in 1.20. See the note in `checkbox.tsx`: same migration, same
 * caveat about `shadcn add` reverting it, same payoff (the label sits beside the
 * track and clicking it toggles).
 */
function Switch({
  className,
  size = "default",
  children,
  ...props
}: SwitchFieldProps & { size?: "sm" | "default" }) {
  return (
    <SwitchField
      data-slot="switch"
      data-size={size}
      className={cn("group/switch inline-flex", className)}
      {...props}
    >
      <SwitchButton className="flex items-center gap-2 text-sm outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50">
        {({ isSelected, isFocusVisible, isInvalid }) => (
          <>
            <span
              data-slot="switch-track"
              className={cn(
                "relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors",
                size === "default" ? "h-[18.4px] w-[32px]" : "h-[14px] w-[24px]",
                isSelected ? "bg-primary" : "bg-input dark:bg-input/80",
                isFocusVisible && "border-ring ring-3 ring-ring/50",
                isInvalid && "border-destructive ring-3 ring-destructive/20"
              )}
            >
              <span
                data-slot="switch-thumb"
                className={cn(
                  "pointer-events-none block rounded-full bg-background ring-0 transition-transform dark:bg-foreground",
                  size === "default" ? "size-4" : "size-3",
                  isSelected
                    ? "translate-x-[calc(100%-2px)] dark:bg-primary-foreground"
                    : "translate-x-0"
                )}
              />
            </span>
            {children as React.ReactNode}
          </>
        )}
      </SwitchButton>
    </SwitchField>
  )
}

export { Switch }
