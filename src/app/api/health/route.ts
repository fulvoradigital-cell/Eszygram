import mongoose from "mongoose";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let database: "connected" | "not_configured" | "disconnected" =
      "not_configured";

    if (isDatabaseConfigured()) {
      try {
        await dbConnect();
        database =
          mongoose.connection.readyState === 1 ? "connected" : "disconnected";
      } catch {
        database = "disconnected";
      }
    }

    return apiSuccess({
      status: "ok",
      app: "Ezsygram",
      tagline: "Sell. Automate. Grow.",
      database,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

