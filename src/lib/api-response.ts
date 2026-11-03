import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiResponse } from "@/types/api";

/**
 * Returns a standardized success API response with HTTP status.
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Returns a standardized error API response with HTTP status.
 */
export function apiError(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: code || `HTTP_${status}`,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );
}

/**
 * Universal error handler for Next.js App Router API route handlers.
 * Automatically inspects and shapes Zod validation errors, MongoDB errors, and standard exceptions.
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  console.error("[API_ERROR]", error);

  // Handle Zod Schema Validation Errors
  if (error instanceof ZodError) {
    return apiError(
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      error.flatten().fieldErrors
    );
  }

  // Handle MongoDB / Mongoose Duplicate Key Error (E11000)
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  ) {
    const keyPattern = (error as { keyPattern?: Record<string, number> }).keyPattern;
    const duplicateFields = keyPattern ? Object.keys(keyPattern).join(", ") : "resource";
    return apiError(
      `A record with this ${duplicateFields} already exists.`,
      409,
      "DUPLICATE_RESOURCE"
    );
  }

  // Standard JavaScript / Application Errors
  if (error instanceof Error) {
    return apiError(error.message, 500, "INTERNAL_SERVER_ERROR");
  }

  return apiError("An unexpected error occurred", 500, "UNKNOWN_ERROR");
}
