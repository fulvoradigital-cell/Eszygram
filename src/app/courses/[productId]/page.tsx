import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { COOKIE_NAME, verifyBuyerToken } from "@/services/buyer-auth.service";
import { getCourseDetailsAndProgress } from "@/services/course.service";
import { CoursePlayer } from "@/components/course/CoursePlayer";

interface CoursePlayerPageProps {
  params: { productId: string };
}

export async function generateMetadata({
  params,
}: CoursePlayerPageProps): Promise<Metadata> {
  try {
    const details = await getCourseDetailsAndProgress({
      productId: params.productId,
    });
    return {
      title: `${details.product.title} | Learning Portal | Ezsygram`,
      description: `Watch and complete lessons for ${details.product.title} by ${details.creator.displayName}`,
    };
  } catch {
    return {
      title: "Course Player | Ezsygram",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const buyerSession = token ? verifyBuyerToken(token) : null;

  const creatorSession = await getAuthSession();

  try {
    const details = await getCourseDetailsAndProgress({
      productId: params.productId,
      buyerEmail: buyerSession?.email,
      creatorUserId: creatorSession?.user?.id,
    });

    return (
      <CoursePlayer
        product={details.product}
        creator={details.creator}
        initialProgress={details.progress}
        hasAccess={details.hasAccess}
        buyerEmail={buyerSession?.email}
      />
    );
  } catch (err: unknown) {
    notFound();
  }
}
