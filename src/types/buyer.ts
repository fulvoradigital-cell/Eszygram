export interface BuyerSession {
  email: string;
  iat?: number;
  exp?: number;
}

export interface BuyerPurchaseDTO {
  orderId: string;
  invoiceNumber: string;
  productId: string;
  productTitle: string;
  productType: string;
  productCoverImage?: string;
  creatorId: string;
  creatorDisplayName: string;
  creatorUsername: string;
  creatorAvatarUrl?: string;
  amountInr: number;
  purchaseDate: string;
  downloadTokens: Array<{
    token: string;
    fileName: string;
    downloadCount: number;
    maxDownloads: number;
    expiresAt: string;
    isExpired: boolean;
  }>;
  bookingConfig?: {
    durationMinutes: number;
    calendarUrl?: string;
    timezone: string;
  };
  membershipConfig?: {
    interval: string;
    features?: string[];
  };
}

export interface CourseProgressDTO {
  productId: string;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  totalLessons: number;
  completedCount: number;
  percentComplete: number;
}
