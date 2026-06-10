import * as React from "react"
import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("overflow-y-auto foxio-scrollbar", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ScrollBar() {
  return null
}

export { ScrollArea, ScrollBar }
