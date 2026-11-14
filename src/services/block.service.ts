import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Block, type IBlock } from "@/models/Block";
import type { BlockDTO } from "@/types";
import type { CreateBlockInput, UpdateBlockInput } from "@/validators/block.validator";

export function toBlockDTO(doc: IBlock): BlockDTO {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    type: doc.type,
    order: doc.order,
    isActive: doc.isActive,
    data: (doc.data as Record<string, unknown>) || {},
    clicks: doc.clicks || 0,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function getBlocksByUserId(
  userId: string,
  onlyActive = false
): Promise<BlockDTO[]> {
  if (!isDatabaseConfigured()) return [];
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }

  const query: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };
  if (onlyActive) {
    query.isActive = true;
  }

  const blocks = await Block.find(query).sort({ order: 1, createdAt: 1 });
  return blocks.map(toBlockDTO);
}

export async function createBlock(
  userId: string,
  input: CreateBlockInput
): Promise<BlockDTO> {
  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // If order is not provided, put at end
  let order = input.order;
  if (order === undefined) {
    const lastBlock = await Block.findOne({ userId: userObjectId }).sort({ order: -1 });
    order = lastBlock ? lastBlock.order + 1 : 0;
  }

  const block = await Block.create({
    userId: userObjectId,
    type: input.type,
    order,
    isActive: input.isActive ?? true,
    data: input.data || {},
    clicks: 0,
  });

  return toBlockDTO(block);
}

export async function updateBlock(
  userId: string,
  blockId: string,
  input: UpdateBlockInput
): Promise<BlockDTO | null> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(blockId)) {
    return null;
  }

  const updateFields: Record<string, unknown> = {};
  if (input.isActive !== undefined) updateFields.isActive = input.isActive;
  if (input.order !== undefined) updateFields.order = input.order;
  if (input.data !== undefined) updateFields.data = input.data;

  const updated = await Block.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(blockId),
      userId: new mongoose.Types.ObjectId(userId), // strictly authorized to owner
    },
    { $set: updateFields },
    { new: true }
  );

  return updated ? toBlockDTO(updated) : null;
}

export async function deleteBlock(
  userId: string,
  blockId: string
): Promise<boolean> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(blockId)) {
    return false;
  }

  const res = await Block.deleteOne({
    _id: new mongoose.Types.ObjectId(blockId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  return res.deletedCount > 0;
}

export async function reorderBlocks(
  userId: string,
  items: { id: string; order: number }[]
): Promise<boolean> {
  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const bulkOps = items
    .filter((item) => mongoose.Types.ObjectId.isValid(item.id))
    .map((item) => ({
      updateOne: {
        filter: {
          _id: new mongoose.Types.ObjectId(item.id),
          userId: userObjectId,
        },
        update: { $set: { order: item.order } },
      },
    }));

  if (bulkOps.length === 0) return false;

  await Block.bulkWrite(bulkOps);
  return true;
}

export async function incrementBlockClicks(blockId: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(blockId)) {
    return;
  }

  await Block.updateOne(
    { _id: new mongoose.Types.ObjectId(blockId) },
    { $inc: { clicks: 1 } }
  );
}
