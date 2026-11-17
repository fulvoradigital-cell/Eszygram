import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Product, type IProduct } from "@/models/Product";
import type { ProductDTO, ProductType } from "@/types";
import type { CreateProductInput, UpdateProductInput } from "@/validators/product.validator";

export function toProductDTO(doc: IProduct): ProductDTO {
  const plain =
    typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : (doc as unknown as Record<string, unknown>);

  const pricePaise = Number(plain.price || 0);
  const priceInr = Math.round(pricePaise / 100);

  const compareAtPricePaise =
    plain.compareAtPrice !== undefined && plain.compareAtPrice !== null
      ? Number(plain.compareAtPrice)
      : null;
  const compareAtPriceInr =
    compareAtPricePaise !== null ? Math.round(compareAtPricePaise / 100) : null;

  const filesRaw = Array.isArray(plain.files) ? plain.files : [];
  const courseContentRaw = Array.isArray(plain.courseContent) ? plain.courseContent : [];
  const bookingConfigRaw = plain.bookingConfig as Record<string, unknown> | undefined;
  const membershipConfigRaw = plain.membershipConfig as Record<string, unknown> | undefined;
  const orderBumpRaw = plain.orderBump as Record<string, unknown> | undefined;

  return {
    id: (plain._id || doc._id).toString(),
    creatorId: (plain.creatorId || doc.creatorId).toString(),
    title: String(plain.title || ""),
    slug: String(plain.slug || ""),
    description: String(plain.description || ""),
    pricePaise,
    priceInr,
    compareAtPricePaise,
    compareAtPriceInr,
    type: plain.type as ProductType,
    coverImage: String(plain.coverImage || ""),
    files: filesRaw.map((f: unknown, fIdx: number) => {
      const file = (f as Record<string, unknown>) || {};
      return {
        id: String(file.id || file._id || `file-${fIdx}`),
        name: String(file.name || ""),
        size: Number(file.size || file.sizeBytes || 0),
        s3Key: String(file.s3Key || file.url || ""),
        mimeType: String(file.mimeType || "application/octet-stream"),
        url: file.url ? String(file.url) : undefined,
      };
    }),
    courseContent: courseContentRaw.map((c: unknown, chIdx: number) => {
      const chapter = (c as Record<string, unknown>) || {};
      const lessonsRaw = Array.isArray(chapter.lessons) ? chapter.lessons : [];
      return {
        id: String(chapter.id || chapter._id || `ch-${chIdx}`),
        title: String(chapter.title || ""),
        order: Number(chapter.order || chIdx),
        lessons: lessonsRaw.map((l: unknown, lIdx: number) => {
          const lesson = (l as Record<string, unknown>) || {};
          const attRaw = Array.isArray(lesson.attachments) ? lesson.attachments : [];
          return {
            id: String(lesson.id || lesson._id || `l-${lIdx}`),
            title: String(lesson.title || ""),
            order: Number(lesson.order || lIdx),
            videoUrl: lesson.videoUrl ? String(lesson.videoUrl) : undefined,
            notes: lesson.notes ? String(lesson.notes) : undefined,
            duration: lesson.duration ? String(lesson.duration) : undefined,
            attachments: attRaw.map((a: unknown) => {
              const att = (a as Record<string, unknown>) || {};
              return {
                name: String(att.name || ""),
                s3Key: String(att.s3Key || ""),
                size: Number(att.size || 0),
              };
            }),
          };
        }),
      };
    }),
    bookingConfig: bookingConfigRaw
      ? {
          durationMinutes: Number(bookingConfigRaw.durationMinutes || 30),
          calendarUrl: bookingConfigRaw.calendarUrl ? String(bookingConfigRaw.calendarUrl) : undefined,
          timezone: String(bookingConfigRaw.timezone || "Asia/Kolkata"),
          customQuestions: Array.isArray(bookingConfigRaw.customQuestions)
            ? bookingConfigRaw.customQuestions.map(String)
            : [],
        }
      : undefined,
    membershipConfig: membershipConfigRaw
      ? {
          interval: (membershipConfigRaw.interval as "monthly" | "yearly") || "monthly",
          features: Array.isArray(membershipConfigRaw.features)
            ? membershipConfigRaw.features.map(String)
            : Array.isArray(membershipConfigRaw.perks)
            ? (membershipConfigRaw.perks as string[]).map(String)
            : [],
        }
      : undefined,
    isActive: Boolean(plain.isActive),
    inventory:
      plain.inventory !== undefined && plain.inventory !== null
        ? Number(plain.inventory)
        : null,
    salesCount: Number(plain.salesCount || 0),
    orderBump: orderBumpRaw
      ? {
          enabled: Boolean(orderBumpRaw.enabled ?? true),
          productId: orderBumpRaw.productId ? String(orderBumpRaw.productId) : undefined,
          productTitle: orderBumpRaw.productTitle ? String(orderBumpRaw.productTitle) : (orderBumpRaw.title ? String(orderBumpRaw.title) : undefined),
          discountPricePaise: orderBumpRaw.discountPricePaise ? Number(orderBumpRaw.discountPricePaise) : (orderBumpRaw.pricePaise ? Number(orderBumpRaw.pricePaise) : undefined),
          headline: orderBumpRaw.headline ? String(orderBumpRaw.headline) : undefined,
        }
      : undefined,
    createdAt: plain.createdAt
      ? new Date(plain.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
    updatedAt: plain.updatedAt
      ? new Date(plain.updatedAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

export async function getProductsByCreatorId(
  creatorId: string,
  options: {
    type?: ProductType;
    isActive?: boolean;
    search?: string;
  } = {}
): Promise<ProductDTO[]> {
  if (!isDatabaseConfigured()) return [];
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(creatorId)) {
    return [];
  }

  const query: Record<string, unknown> = {
    creatorId: new mongoose.Types.ObjectId(creatorId),
  };

  if (options.type) {
    query.type = options.type;
  }
  if (options.isActive !== undefined) {
    query.isActive = options.isActive;
  }
  if (options.search) {
    const searchRegex = new RegExp(options.search.trim(), "i");
    query.$or = [{ title: searchRegex }, { slug: searchRegex }];
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  return products.map(toProductDTO);
}

export async function getProductById(
  productId: string,
  creatorId?: string
): Promise<ProductDTO | null> {
  if (!isDatabaseConfigured()) return null;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return null;
  }

  const query: Record<string, unknown> = {
    _id: new mongoose.Types.ObjectId(productId),
  };
  if (creatorId && mongoose.Types.ObjectId.isValid(creatorId)) {
    query.creatorId = new mongoose.Types.ObjectId(creatorId);
  }

  const product = await Product.findOne(query);
  return product ? toProductDTO(product) : null;
}

export async function getProductBySlug(
  creatorId: string,
  slug: string
): Promise<ProductDTO | null> {
  if (!isDatabaseConfigured()) return null;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(creatorId)) {
    return null;
  }

  const product = await Product.findOne({
    creatorId: new mongoose.Types.ObjectId(creatorId),
    slug: slug.toLowerCase().trim(),
  });

  return product ? toProductDTO(product) : null;
}

export async function createProduct(
  creatorId: string,
  input: CreateProductInput
): Promise<ProductDTO> {
  await dbConnect();

  const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

  // Determine paise amount strictly
  let pricePaise = 0;
  if (input.pricePaise !== undefined) {
    pricePaise = input.pricePaise;
  } else if (input.priceInr !== undefined) {
    pricePaise = Math.round(input.priceInr * 100);
  }

  let compareAtPricePaise: number | null = null;
  if (input.compareAtPricePaise !== undefined) {
    compareAtPricePaise = input.compareAtPricePaise;
  } else if (input.compareAtPriceInr !== undefined && input.compareAtPriceInr !== null) {
    compareAtPricePaise = Math.round(input.compareAtPriceInr * 100);
  }

  // Ensure unique slug per creator
  let slug = input.slug.toLowerCase().trim();
  const existingWithSlug = await Product.findOne({
    creatorId: creatorObjectId,
    slug,
  });
  if (existingWithSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  // Order bump processing
  let orderBump = undefined;
  if (input.orderBump?.enabled) {
    let bumpDiscountPaise = 0;
    if (input.orderBump.discountPricePaise !== undefined) {
      bumpDiscountPaise = input.orderBump.discountPricePaise;
    } else if (input.orderBump.discountPriceInr !== undefined) {
      bumpDiscountPaise = Math.round(input.orderBump.discountPriceInr * 100);
    }

    orderBump = {
      enabled: true,
      productId: input.orderBump.productId,
      productTitle: input.orderBump.productTitle,
      discountPricePaise: bumpDiscountPaise,
      headline: input.orderBump.headline,
    };
  }

  const product = await Product.create({
    creatorId: creatorObjectId,
    title: input.title.trim(),
    slug,
    description: input.description?.trim() || "",
    price: pricePaise,
    compareAtPrice: compareAtPricePaise,
    type: input.type,
    coverImage: input.coverImage?.trim() || "",
    files: input.files || [],
    courseContent: input.courseContent || [],
    bookingConfig: input.bookingConfig,
    membershipConfig: input.membershipConfig,
    isActive: input.isActive ?? true,
    inventory: input.inventory ?? null,
    salesCount: 0,
    orderBump,
  });

  return toProductDTO(product);
}

export async function updateProduct(
  creatorId: string,
  productId: string,
  input: UpdateProductInput
): Promise<ProductDTO | null> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return null;
  }

  const updateFields: Record<string, unknown> = {};

  if (input.title !== undefined) updateFields.title = input.title.trim();
  if (input.slug !== undefined) updateFields.slug = input.slug.toLowerCase().trim();
  if (input.description !== undefined) updateFields.description = input.description.trim();
  if (input.type !== undefined) updateFields.type = input.type;
  if (input.coverImage !== undefined) updateFields.coverImage = input.coverImage.trim();
  if (input.files !== undefined) updateFields.files = input.files;
  if (input.courseContent !== undefined) updateFields.courseContent = input.courseContent;
  if (input.bookingConfig !== undefined) updateFields.bookingConfig = input.bookingConfig;
  if (input.membershipConfig !== undefined) updateFields.membershipConfig = input.membershipConfig;
  if (input.isActive !== undefined) updateFields.isActive = input.isActive;
  if (input.inventory !== undefined) updateFields.inventory = input.inventory;

  // Pricing conversion
  if (input.pricePaise !== undefined) {
    updateFields.price = input.pricePaise;
  } else if (input.priceInr !== undefined) {
    updateFields.price = Math.round(input.priceInr * 100);
  }

  if (input.compareAtPricePaise !== undefined) {
    updateFields.compareAtPrice = input.compareAtPricePaise;
  } else if (input.compareAtPriceInr !== undefined) {
    updateFields.compareAtPrice =
      input.compareAtPriceInr !== null ? Math.round(input.compareAtPriceInr * 100) : null;
  }

  if (input.orderBump !== undefined) {
    if (!input.orderBump.enabled) {
      updateFields.orderBump = { enabled: false };
    } else {
      let bumpDiscountPaise = 0;
      if (input.orderBump.discountPricePaise !== undefined) {
        bumpDiscountPaise = input.orderBump.discountPricePaise;
      } else if (input.orderBump.discountPriceInr !== undefined) {
        bumpDiscountPaise = Math.round(input.orderBump.discountPriceInr * 100);
      }
      updateFields.orderBump = {
        enabled: true,
        productId: input.orderBump.productId,
        productTitle: input.orderBump.productTitle,
        discountPricePaise: bumpDiscountPaise,
        headline: input.orderBump.headline,
      };
    }
  }

  const updated = await Product.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(productId),
      creatorId: new mongoose.Types.ObjectId(creatorId), // strictly scoped to authenticated owner
    },
    { $set: updateFields },
    { new: true }
  );

  return updated ? toProductDTO(updated) : null;
}

export async function deleteProduct(
  creatorId: string,
  productId: string
): Promise<boolean> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return false;
  }

  const res = await Product.deleteOne({
    _id: new mongoose.Types.ObjectId(productId),
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });

  return res.deletedCount > 0;
}

export async function toggleProductActive(
  creatorId: string,
  productId: string,
  isActive: boolean
): Promise<ProductDTO | null> {
  return updateProduct(creatorId, productId, { isActive });
}
