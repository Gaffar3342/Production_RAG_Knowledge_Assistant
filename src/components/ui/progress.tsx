import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, ...props }, ref) => (
  <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
    <div
      className="h-full w-full flex-1 rounded-full bg-primary transition-transform duration-500 ease-out"
      style={{ transform: `translateX(-${100 - Math.max(0, Math.min(value, 100))}%)` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
