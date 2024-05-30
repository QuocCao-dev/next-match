"use client";

import { MessageDto } from "@/types";
import {
  Avatar,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, useCallback, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { deleteMessage } from "../actions/messageActions";

type Props = {
  messages: MessageDto[];
};

const MessageTable = ({ messages }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox = searchParams.get("container") === "outbox";
  const [deleting, setDeleting] = useState({ id: "", loading: false });

  const columns = [
    {
      key: isOutbox ? "recipientName" : "senderName",
      label: isOutbox ? "Recipient" : "Sender",
    },
    {
      key: "text",
      label: "Message",
    },
    {
      key: "created",
      label: isOutbox ? "Date Sent" : "Date Received",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  const handleDeleteMessage = useCallback(
    async (message: MessageDto) => {
      setDeleting({ id: message.id, loading: true });
      await deleteMessage(message.id, isOutbox);
      router.refresh();
      setDeleting((prev) => ({ ...prev, loading: false }));
    },
    [isOutbox, router]
  );

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);
    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;
    router.push(url + "/chat");
  };

  const renderCell = useCallback(
    (item: MessageDto, columnKey: keyof MessageDto) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "recipientName":
        case "senderName":
          return (
            <div className={clsx("flex items-center gap-2 cursor-pointer")}>
              <Avatar
                alt="image of member"
                src={
                  (isOutbox ? item.recipientImage : item.senderImage) ??
                  "/images/user.png"
                }
              />
              <span>{cellValue}</span>
            </div>
          );
        case "text":
          return <div className="truncate max-w-xs">{cellValue}</div>;
        case "created":
          return cellValue;

        default:
          return (
            <Button
              isIconOnly
              variant="light"
              onClick={() => handleDeleteMessage(item)}
              isLoading={deleting.id === item.id && deleting.loading}
            >
              <AiFillDelete size={24} className="text-danger" />
            </Button>
          );
      }
    },
    [isOutbox, deleting.id, deleting.loading, handleDeleteMessage]
  );

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Message Table"
        selectionMode="single"
        onRowAction={handleRowSelect}
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              width={column.key === "text" ? "50%" : undefined}
              className="truncate"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={messages} emptyContent="No messages found">
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell
                  key={columnKey}
                  className={clsx("truncate", {
                    "font-semibold": !item.dateRead && !isOutbox,
                  })}
                >
                  {renderCell(item, columnKey as keyof MessageDto)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
export default MessageTable;
