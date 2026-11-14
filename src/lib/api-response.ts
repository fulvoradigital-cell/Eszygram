import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 400,
    code = "BAD_REQUEST",
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function apiSuccess<T>(
  data: T,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
    },
    { status }
  );
}

export function apiError(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        message,
        code,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}

export function formatZodError(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }
  return fieldErrors;
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ZodError) {
    return apiError(
      "Validation failed. Please check your input.",
      400,
      "VALIDATION_ERROR",
      formatZodError(error)
    );
  }

  if (error instanceof AppError) {
    return apiError(error.message, error.statusCode, error.code, error.details);
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ValidationError"
  ) {
    return apiError("Database validation failed.", 400, "DB_VALIDATION_ERROR");
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  ) {
    return apiError(
      "A record with this unique value already exists.",
      409,
      "DUPLICATE_KEY"
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[API Error]", error instanceof Error ? error.message : error);
  }

  return apiError(
    "Something went wrong. Please try again later.",
    500,
    "INTERNAL_SERVER_ERROR"
  );
}

