"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "../auth";
import { Photo, User } from "@prisma/client";

export async function getMembers() {
  const session = await auth();

  if (!session?.user) return null;

  try {
    return prisma.member.findMany({
      where: {
        NOT: {
          userId: session.user.id,
        },
      },
    });
  } catch (error) {}
}

export async function getMemberByUserId(userId: User["id"]) {
  try {
    return prisma.member.findUnique({
      where: {
        userId,
      },
    });
  } catch (error) {}
}

export async function getMemberPhotosByUserId(userId: User["id"]) {
  try {
    const member = await prisma.member.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!member) return null;

    return member.photos.map((photo) => photo) as Photo[];
  } catch (error) {
    console.error(error);
  }
}
