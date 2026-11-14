export type BlockType =
  | "link"
  | "product"
  | "featured_product"
  | "social_embed"
  | "lead_capture"
  | "text"
  | "divider";

export interface LinkBlockData {
  title: string;
  url: string;
  icon?: string;
  badge?: string;
  isHighlighted?: boolean;
}

export interface ProductBlockData {
  title: string;
  description?: string;
  priceInr: number; // in rupees for display, stored as paise or formatted
  imageUrl?: string;
  url?: string;
  ctaText?: string;
  badge?: string;
}

export interface FeaturedProductBlockData extends ProductBlockData {
  features?: string[];
  badge?: string;
}

export interface SocialEmbedBlockData {
  platform: "youtube" | "instagram";
  url: string;
  title?: string;
}

export interface LeadCaptureBlockData {
  headline: string;
  subheadline?: string;
  captureType: "email" | "whatsapp" | "both";
  buttonText?: string;
  successMessage?: string;
  tag?: string;
}

export interface TextBlockData {
  title?: string;
  content: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
}

export interface DividerBlockData {
  style: "solid" | "dashed" | "dots" | "space";
  spacing?: "sm" | "md" | "lg";
}

export type BlockDataMap = {
  link: LinkBlockData;
  product: ProductBlockData;
  featured_product: FeaturedProductBlockData;
  social_embed: SocialEmbedBlockData;
  lead_capture: LeadCaptureBlockData;
  text: TextBlockData;
  divider: DividerBlockData;
};

export interface BlockDTO {
  id: string;
  userId: string;
  type: BlockType;
  order: number;
  isActive: boolean;
  data: Record<string, unknown>;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}
