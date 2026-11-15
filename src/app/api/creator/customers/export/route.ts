import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { apiError, handleApiError } from "@/lib/api-response";
import { exportCustomersCsv } from "@/services/customer.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    const csvContent = await exportCustomersCsv(session.user.id);
    const dateSlug = new Date().toISOString().split("T")[0];

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ezsygram-customers-${dateSlug}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
