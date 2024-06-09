"use server";

import { prisma } from "@/lib/prisma";
import { GetMemberParams, PaginatedResponse } from "@/types";
import { Member, Photo, User } from "@prisma/client";
import { addYears } from "date-fns";
import { getAuthUserId } from "./authActions";

export async function getMembers({
  ageRange = "18,100",
  gender = "male,female",
  orderBy = "updated",
  pageNumber = "1",
  pageSize = "12",
}: GetMemberParams): Promise<PaginatedResponse<Member>> {
  const userId = await getAuthUserId();

  const [minAge, maxAge] = ageRange.split(",").map(Number);
  const currentDate = new Date();
  const minDob = addYears(currentDate, -maxAge - 1);
  const maxDob = addYears(currentDate, -minAge);

  const selectedGender = gender.split(",");
  const page = Number(pageNumber);
  const limit = Number(pageSize);
  const skip = (page - 1) * limit;

  try {
    const count = await prisma.member.count({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } },
        ],
        NOT: {
          userId,
        },
      },
    });

    const members = await prisma.member.findMany({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } },
        ],
        NOT: {
          userId,
        },
      },
      orderBy: { [orderBy]: "desc" },
      skip,
      take: limit,
    });

    return {
      items: members,
      totalCount: count,
    };
  } catch (error) {
    throw error;
  }
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

export async function updateLastActive() {
  const userId = await getAuthUserId();

  try {
    return prisma.member.update({
      where: { userId },
      data: { updated: new Date() },
    });
  } catch (error) {
    throw error;
  }
}
