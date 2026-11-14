export interface StoreThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackground: string;
  font: string;
  buttonRadius: "rounded-md" | "rounded-xl" | "rounded-2xl" | "rounded-full";
  buttonStyle: "solid" | "glass" | "outline" | "gradient";
}

export interface StoreLeadDTO {
  id: string;
  creatorId: string;
  blockId: string;
  email?: string;
  whatsapp?: string;
  name?: string;
  createdAt: string;
}
