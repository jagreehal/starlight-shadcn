import {
  CheckboxButton,
  CheckboxField,
  type CheckboxFieldProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"
import { CheckIcon } from "@phosphor-icons/react"

/*
 * Built on `CheckboxField` + `CheckboxButton` rather than the bare `Checkbox`,
 * which react-aria-components deprecated in 1.20 ("Use CheckboxField +
 * CheckboxButton instead").
 *
 * This front-runs the shadcn registry, which still emits the deprecated form —
 * so `shadcn add checkbox` will revert this file until they migrate too.
 *
 * The practical difference: `CheckboxButton` is the whole clickable region, so
 * `children` render *beside* the box and clicking the label toggles. The old
 * shape put children inside the 16px box, where the text overflowed.
 */
function Checkbox({ className, children, ...props }: CheckboxFieldProps) {
  return (
    <CheckboxField
      data-slot="checkbox"
      className={cn("group/checkbox inline-flex", className)}
      {...props}
    >
      <CheckboxButton className="flex items-center gap-2 text-sm outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50">
        {({ isSelected, isIndeterminate, isFocusVisible, isInvalid }) => (
          <>
            <span
              data-slot="checkbox-indicator"
              className={cn(
                "relative grid size-4 shrink-0 place-content-center rounded-[4px] border border-input shadow-xs transition-shadow dark:bg-input/30 [&>svg]:size-3.5",
                (isSelected || isIndeterminate) &&
                  "border-primary bg-primary text-primary-foreground dark:bg-primary",
                isFocusVisible && "border-ring ring-3 ring-ring/50",
                isInvalid && !isSelected && "border-destructive ring-3 ring-destructive/20"
              )}
            >
              {(isSelected || isIndeterminate) && <CheckIcon />}
            </span>
            {children as React.ReactNode}
          </>
        )}
      </CheckboxButton>
    </CheckboxField>
  )
}

export { Checkbox }
