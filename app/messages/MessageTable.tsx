"use client";

import { useMessages } from "@/hooks/useMessages";
import { MessageDto } from "@/types";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import clsx from "clsx";
import MessageTableCell from "./MessageTableCell";

type Props = {
  initialMessages: MessageDto[];
};

const MessageTable = ({ initialMessages }: Props) => {
  const {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    rowSelect: handleRowSelect,
    isDeleting: deleting,
  } = useMessages(initialMessages);

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
        <TableBody items={initialMessages} emptyContent="No messages found">
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell
                  key={columnKey}
                  className={clsx("truncate", {
                    "font-semibold": !item.dateRead && !isOutbox,
                  })}
                >
                  <MessageTableCell
                    item={item}
                    columnKey={columnKey as string}
                    isOutbox={isOutbox}
                    deleteMessage={handleDeleteMessage}
                    isDeleting={deleting.loading && deleting.id === item.id}
                  />
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
