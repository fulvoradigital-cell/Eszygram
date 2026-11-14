import Link from "next/link";
import { ArrowLeft, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Products & Courses
            </h1>
            <Badge variant="brand" size="sm">Phase 4</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Manage your digital products, video courses, 1:1 bookings, and memberships.
          </p>
        </div>
      </div>

      <Card className="p-8 sm:p-12 text-center border-slate-border">
        <div className="w-14 h-14 rounded-2xl bg-coral/10 text-coral flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-navy font-display mb-2">
          Products & File Storage
        </h2>
        <p className="text-sm text-slate-muted max-w-md mx-auto mb-6">
          Phase 4 implements digital file uploads to private S3/R2 storage with expiring presigned download URLs, course chapters, and order bumps.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Link>
        </Button>
      </Card>
    </div>
  );
}

