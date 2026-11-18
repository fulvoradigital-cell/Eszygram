export type CreatorNiche =
  | "coaching"
  | "courses"
  | "fitness"
  | "design"
  | "tech"
  | "finance"
  | "content"
  | "photography"
  | "astrology"
  | "culinary"
  | "other";

export interface SocialLink {
  platform: "instagram" | "youtube" | "twitter" | "linkedin" | "website" | "threads";
  url: string;
}

export interface ProfileTheme {
  preset: string;
  primaryColor: string;
  backgroundColor: string;
  font: string;
  buttonRadius?: string;
  cardStyle?: "glass" | "solid" | "bordered";
}

export interface ProfileSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface CreatorProfileDTO {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  niche: CreatorNiche;
  socialLinks: SocialLink[];
  theme: ProfileTheme;
  seo: ProfileSeo;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

