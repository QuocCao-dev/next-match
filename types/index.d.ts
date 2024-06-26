import { ZodIssue } from "zod";
import { Message, Prisma } from "@prisma/client";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  select: {
    sender: { select: { userId; name; image } };
    recipient: { select: { userId; name; image } };
  };
}>;

type MessageDto = Omit<Message, "created" | "dateRead"> & {
  senderImage?: string | null;
  recipientName: string;
  recipientImage?: string | null;
  created: string;
  dateRead: string | null;
  senderName: string;
};

type UserFilters = {
  ageRange: number[];
  orderBy: string;
  gender: string[];
};

type PagingParams = {
  pageNumber: number;
  pageSize: number;
};

type PagingResult = {
  totalPages: number;
  totalCount: number;
} & PagingParams;

type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
};

type GetMemberParams = {
  ageRange?: string;
  gender?: string;
  pageNumber?: string;
  pageSize?: string;
  orderBy?: string;
};
