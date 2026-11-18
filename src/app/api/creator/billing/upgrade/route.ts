import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { upgradePlanInitiateSchema } from "@/validators/billing.validator";
import { initiatePlanUpgrade } from "@/services/billing.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = upgradePlanInitiateSchema.parse(body);

    const result = await initiatePlanUpgrade(
      session.user.id,
      validated.plan,
      validated.billingCycle
    );

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
