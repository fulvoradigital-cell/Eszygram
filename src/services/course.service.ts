import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { CreatorProfile } from "@/models/CreatorProfile";
import { CourseProgress } from "@/models/CourseProgress";
import { toProductDTO } from "./product.service";
import { AppError } from "@/lib/api-response";
import type { CourseProgressDTO, ProductDTO } from "@/types";

export async function getCourseDetailsAndProgress({
  productId,
  buyerEmail,
  creatorUserId,
}: {
  productId: string;
  buyerEmail?: string | null;
  creatorUserId?: string | null;
}): Promise<{
  product: ProductDTO;
  creator: {
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
  progress: CourseProgressDTO;
  hasAccess: boolean;
}> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not connected.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid product ID", 400, "INVALID_PRODUCT");
  }

  const product = await Product.findById(productId);
  if (!product || product.type !== "course") {
    throw new AppError("Course not found.", 404, "COURSE_NOT_FOUND");
  }

  const creator = await CreatorProfile.findOne({ userId: product.creatorId });

  // Access Verification
  let hasAccess = false;

  // 1. Creator preview access
  if (creatorUserId && product.creatorId.toString() === creatorUserId) {
    hasAccess = true;
  }

  // 2. Buyer paid access
  if (!hasAccess && buyerEmail) {
    const paidOrder = await Order.findOne({
      productId: product._id,
      buyerEmail: buyerEmail.toLowerCase().trim(),
      status: "paid",
    });
    if (paidOrder) {
      hasAccess = true;
    }
  }

  // Total lessons count
  const allLessons = (product.courseContent || []).flatMap((ch) => ch.lessons || []);
  const totalLessons = allLessons.length;

  let completedLessonIds: string[] = [];
  let lastAccessedLessonId: string | undefined = undefined;

  if (hasAccess && buyerEmail) {
    const progressDoc = await CourseProgress.findOne({
      buyerEmail: buyerEmail.toLowerCase().trim(),
      productId: product._id,
    });

    if (progressDoc) {
      completedLessonIds = progressDoc.completedLessonIds || [];
      lastAccessedLessonId = progressDoc.lastAccessedLessonId;
    }
  }

  const completedCount = completedLessonIds.length;
  const percentComplete =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    product: toProductDTO(product),
    creator: {
      displayName: creator?.displayName || "Verified Creator",
      username: creator?.username || "creator",
      avatarUrl: creator?.avatarUrl || undefined,
    },
    progress: {
      productId: product._id.toString(),
      completedLessonIds,
      lastAccessedLessonId,
      totalLessons,
      completedCount,
      percentComplete,
    },
    hasAccess,
  };
}

export async function updateCourseProgress({
  buyerEmail,
  productId,
  lessonId,
  completed = true,
}: {
  buyerEmail: string;
  productId: string;
  lessonId: string;
  completed?: boolean;
}): Promise<CourseProgressDTO> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not connected.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  const cleanEmail = buyerEmail.toLowerCase().trim();
  const productObjectId = new mongoose.Types.ObjectId(productId);

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Course not found.", 404, "NOT_FOUND");
  }

  const totalLessons = (product.courseContent || []).reduce(
    (acc, ch) => acc + (ch.lessons?.length || 0),
    0
  );

  let progressDoc = await CourseProgress.findOne({
    buyerEmail: cleanEmail,
    productId: productObjectId,
  });

  if (!progressDoc) {
    progressDoc = new CourseProgress({
      buyerEmail: cleanEmail,
      productId: productObjectId,
      completedLessonIds: completed ? [lessonId] : [],
      lastAccessedLessonId: lessonId,
    });
  } else {
    progressDoc.lastAccessedLessonId = lessonId;
    const exists = progressDoc.completedLessonIds.includes(lessonId);

    if (completed && !exists) {
      progressDoc.completedLessonIds.push(lessonId);
    } else if (!completed && exists) {
      progressDoc.completedLessonIds = progressDoc.completedLessonIds.filter(
        (id) => id !== lessonId
      );
    }
  }

  await progressDoc.save();

  const completedCount = progressDoc.completedLessonIds.length;
  const percentComplete =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    productId,
    completedLessonIds: progressDoc.completedLessonIds,
    lastAccessedLessonId: progressDoc.lastAccessedLessonId,
    totalLessons,
    completedCount,
    percentComplete,
  };
}
