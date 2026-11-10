import connectToDatabase from "@/lib/db";
import CreatorProfile, { ICreatorProfile } from "@/models/CreatorProfile";
import Block, { IBlock } from "@/models/Block";
import Lead, { ILead } from "@/models/Lead";
import DailyPageView from "@/models/DailyPageView";
import {
  CreateBlockInput,
  UpdateBlockInput,
  ReorderBlocksInput,
  UpdateThemeInput,
  UpdateSeoInput,
  LeadCaptureInput,
} from "@/validators/store.validator";

/**
 * Retrieves the creator's profile and all blocks for the store builder.
 */
export async function getStoreByUserId(userId: string) {
  await connectToDatabase();

  const profile = await CreatorProfile.findOne({ userId });
  if (!profile) return null;

  const blocks = await Block.find({ profileId: profile._id }).sort({ order: 1 });

  return { profile, blocks };
}

/**
 * Retrieves the public storefront for a creator by username, returning only active blocks.
 */
export async function getPublicStoreByUsername(username: string) {
  try {
    await connectToDatabase();

    const profile = await CreatorProfile.findOne({
      username: username.toLowerCase().trim(),
    });
    if (!profile) return null;

    const blocks = await Block.find({
      profileId: profile._id,
      isActive: true,
    }).sort({ order: 1 });

    return { profile, blocks };
  } catch (err) {
    console.warn("[PUBLIC_STORE_DB_WARNING]", (err as Error).message);
    return null;
  }
}

/**
 * Creates a new block for the creator's storefront.
 */
export async function createBlock(userId: string, input: CreateBlockInput): Promise<IBlock> {
  await connectToDatabase();

  const profile = await CreatorProfile.findOne({ userId });
  if (!profile) {
    throw new Error("Creator profile not found");
  }

  // Calculate next order value
  const lastBlock = await Block.findOne({ profileId: profile._id }).sort({ order: -1 });
  const nextOrder = lastBlock ? lastBlock.order + 1 : 0;

  const block = new Block({
    profileId: profile._id,
    type: input.type,
    order: nextOrder,
    isActive: input.isActive ?? true,
    data: input.data || {},
    clicks: 0,
  });

  return block.save();
}

/**
 * Updates an existing block.
 */
export async function updateBlock(
  userId: string,
  blockId: string,
  input: UpdateBlockInput
): Promise<IBlock | null> {
  await connectToDatabase();

  const profile = await CreatorProfile.findOne({ userId });
  if (!profile) {
    throw new Error("Creator profile not found");
  }

  const block = await Block.findOne({
    _id: blockId,
    profileId: profile._id,
  });

  if (!block) return null;

  if (input.isActive !== undefined) {
    block.isActive = input.isActive;
  }

  if (input.data !== undefined) {
    block.data = { ...block.data, ...input.data };
  }

  return block.save();
}

/**
 * Deletes a block.
 */
export async function deleteBlock(userId: string, blockId: string): Promise<boolean> {
  await connectToDatabase();

  const profile = await CreatorProfile.findOne({ userId });
  if (!profile) {
    throw new Error("Creator profile not found");
  }

  const result = await Block.deleteOne({
    _id: blockId,
    profileId: profile._id,
  });

  return result.deletedCount > 0;
}

/**
 * Reorders multiple blocks.
 */
export async function reorderBlocks(
  userId: string,
  input: ReorderBlocksInput
): Promise<boolean> {
  await connectToDatabase();

  const profile = await CreatorProfile.findOne({ userId });
  if (!profile) {
    throw new Error("Creator profile not found");
  }

  const updatePromises = input.orders.map(({ id, order }) =>
    Block.updateOne(
      { _id: id, profileId: profile._id },
      { $set: { order } }
    )
  );

  await Promise.all(updatePromises);
  return true;
}

/**
 * Updates storefront theme configuration.
 */
export async function updateStoreTheme(
  userId: string,
  theme: UpdateThemeInput
): Promise<ICreatorProfile | null> {
  await connectToDatabase();

  return CreatorProfile.findOneAndUpdate(
    { userId },
    { $set: { theme } },
    { new: true }
  );
}

/**
 * Updates storefront SEO configuration.
 */
export async function updateStoreSeo(
  userId: string,
  seo: UpdateSeoInput
): Promise<ICreatorProfile | null> {
  await connectToDatabase();

  return CreatorProfile.findOneAndUpdate(
    { userId },
    { $set: { seo } },
    { new: true }
  );
}

/**
 * Increments the click count for a given block.
 */
export async function incrementBlockClick(blockId: string): Promise<boolean> {
  try {
    await connectToDatabase();
    await Block.findByIdAndUpdate(blockId, { $inc: { clicks: 1 } });
    return true;
  } catch (err) {
    console.warn("[CLICK_TRACKING_ERROR]", err);
    return false;
  }
}

/**
 * Increments the daily page view count for a creator profile.
 */
export async function recordDailyPageView(profileId: string): Promise<boolean> {
  try {
    await connectToDatabase();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    await DailyPageView.findOneAndUpdate(
      { profileId, date: today },
      { $inc: { views: 1 } },
      { upsert: true, new: true }
    );
    return true;
  } catch (err) {
    console.warn("[PAGE_VIEW_TRACKING_ERROR]", err);
    return false;
  }
}

/**
 * Saves a lead from the lead-capture block.
 */
export async function saveLead(input: LeadCaptureInput): Promise<ILead> {
  await connectToDatabase();

  const lead = new Lead({
    profileId: input.profileId,
    blockId: input.blockId,
    name: input.name?.trim() || "",
    email: input.email?.trim().toLowerCase() || "",
    phone: input.phone?.trim() || "",
    source: "lead-capture",
  });

  return lead.save();
}
