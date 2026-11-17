import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";

export const metadata = {
  title: "Creator Dashboard | Ezsygram",
  description: "Manage your link-in-bio storefront, products, orders, and Instagram automations.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  const profile = await getCreatorProfileByUserId(session.user.id);

  // If creator profile doesn't exist yet, redirect to onboarding wizard
  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <DashboardHeader username={profile.username} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <DashboardBottomNav />
      </div>
    </div>
  );
}

