import React from "react";
import { Card } from "@/components/ui/card";
import { Database, AlertCircle } from "lucide-react";

export function EmptyState({
  title = "Backend Support Pending",
  description = "This metric requires backend telemetry, HR system integration, or future database migrations before it can be calculated.",
}) {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-border/60 bg-muted/30">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 relative">
        <Database className="w-8 h-8 opacity-50" />
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
          <AlertCircle className="w-5 h-5 text-destructive" />
        </div>
      </div>
      <h3 className="text-xl font-extrabold text-foreground mb-2">{title}</h3>
      <p className="text-sm font-medium text-muted-foreground text-center max-w-md">
        {description}
      </p>
    </Card>
  );
}
