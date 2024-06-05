"use server";

import { prisma } from "@/lib/prisma";
import { Like } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { pusherServer } from "@/lib/pusher";

export async function toggleLikeMember(
  targetUserId: Like["targetUserId"],
  isLiked: boolean
) {
  try {
    const userId = await getAuthUserId();

    if (isLiked) {
      await prisma.like.delete({
        where: {
          sourceUserId_targetUserId: {
            sourceUserId: userId,
            targetUserId,
          },
        },
      });
    } else {
      const like = await prisma.like.create({
        data: {
          sourceUserId: userId,
          targetUserId,
        },
        select: {
          sourceMember: {
            select: {
              name: true,
              image: true,
              userId: true,
            },
          },
        },
      });

      await pusherServer.trigger(`private-${targetUserId}`, "like:new", {
        name: like.sourceMember.name,
        image: like.sourceMember.image,
        userId: like.sourceMember.userId,
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchCurrentUserLikeIds() {
  try {
    const userId = await getAuthUserId();
    const likeIds = await prisma.like.findMany({
      where: { sourceUserId: userId },
      select: { targetUserId: true },
    });

    return likeIds.map((like) => like.targetUserId);
  } catch (error) {
    throw error;
  }
}

type LikeType = "source" | "target" | "mutual";

export async function fetchLikedMembers(type: LikeType = "source") {
  try {
    const userId = await getAuthUserId();

    const mapper: Record<LikeType, Function> = {
      source: fetchSourceLikes,
      target: fetchTargetLikes,
      mutual: fetchMutualLikes,
    };

    const handler = mapper[type];

    return (await handler(userId)) ?? [];
  } catch (error) {}
}

async function fetchSourceLikes(userId: string) {
  const sourceList = await prisma.like.findMany({
    where: {
      sourceUserId: userId,
    },
    select: {
      targetMember: true,
    },
  });

  return sourceList.map((like) => like.targetMember);
}

async function fetchTargetLikes(userId: string) {
  const sourceList = await prisma.like.findMany({
    where: {
      targetUserId: userId,
    },
    select: {
      sourceMember: true,
    },
  });

  return sourceList.map((like) => like.sourceMember);
}

async function fetchMutualLikes(userId: string) {
  const likedUsers = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetUserId: true },
  });

  const likedIds = likedUsers.map((like) => like.targetUserId);

  const mutualLikes = await prisma.like.findMany({
    where: {
      AND: [{ targetUserId: userId }, { sourceUserId: { in: likedIds } }],
    },
    select: { sourceMember: true },
  });

  return mutualLikes.map((like) => like.sourceMember);
}
