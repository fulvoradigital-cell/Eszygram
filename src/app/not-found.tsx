import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 shadow-soft">
        <FileQuestion className="h-8 w-8" />
      </div>
      <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-800">
        404 Not Found
      </span>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        The creator store, link, or resource you are looking for doesn&apos;t exist or
        has been moved.
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button variant="primary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

