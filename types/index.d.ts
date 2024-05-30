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
