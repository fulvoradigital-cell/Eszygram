export type ProductType = "download" | "course" | "booking" | "membership";

export interface ProductFile {
  id: string;
  name: string;
  size: number; // in bytes
  s3Key: string;
  mimeType: string;
  url?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  order: number;
  videoUrl?: string;
  notes?: string;
  duration?: string; // e.g. "12:30"
  attachments?: Array<{
    name: string;
    s3Key: string;
    size: number;
  }>;
}

export interface CourseChapter {
  id: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
}

export interface BookingConfig {
  durationMinutes: number; // 15, 30, 45, 60, 90
  calendarUrl?: string;
  timezone: string;
  customQuestions?: string[];
}

export interface MembershipConfig {
  interval: "monthly" | "yearly";
  features?: string[];
}

export interface OrderBumpConfig {
  enabled: boolean;
  productId?: string;
  productTitle?: string;
  discountPricePaise?: number;
  headline?: string;
}

export interface ProductDTO {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  description: string;
  pricePaise: number; // in paise (e.g. 49900 = ₹499)
  priceInr: number; // in INR (e.g. 499)
  compareAtPricePaise?: number | null;
  compareAtPriceInr?: number | null;
  type: ProductType;
  coverImage?: string;
  files: ProductFile[];
  courseContent: CourseChapter[];
  bookingConfig?: BookingConfig;
  membershipConfig?: MembershipConfig;
  isActive: boolean;
  inventory?: number | null; // null = unlimited
  salesCount: number;
  orderBump?: OrderBumpConfig;
  createdAt: string;
  updatedAt: string;
}
