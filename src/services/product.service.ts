import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Product, type IProduct } from "@/models/Product";
import type { ProductDTO, ProductType } from "@/types";
import type { CreateProductInput, UpdateProductInput } from "@/validators/product.validator";

export function toProductDTO(doc: IProduct): ProductDTO {
  const pricePaise = doc.price;
  const priceInr = Math.round(pricePaise / 100);

  const compareAtPricePaise = doc.compareAtPrice ?? null;
  const compareAtPriceInr =
    compareAtPricePaise !== null ? Math.round(compareAtPricePaise / 100) : null;

  return {
    id: doc._id.toString(),
    creatorId: doc.creatorId.toString(),
    title: doc.title,
    slug: doc.slug,
    description: doc.description || "",
    pricePaise,
    priceInr,
    compareAtPricePaise,
    compareAtPriceInr,
    type: doc.type,
    coverImage: doc.coverImage || "",
    files: doc.files || [],
    courseContent: doc.courseContent || [],
    bookingConfig: doc.bookingConfig,
    membershipConfig: doc.membershipConfig,
    isActive: doc.isActive,
    inventory: doc.inventory,
    salesCount: doc.salesCount || 0,
    orderBump: doc.orderBump,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
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
