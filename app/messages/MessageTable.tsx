"use client";

import { useMessages } from "@/hooks/useMessages";
import { MessageDto } from "@/types";
import {
  Button,
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
  nextCursor?: string;
};

const MessageTable = ({ initialMessages, nextCursor }: Props) => {
  const {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    rowSelect: handleRowSelect,
    isDeleting: deleting,
    loadMore,
    loadingMore,
    hasMore,
    messages,
  } = useMessages(initialMessages, nextCursor);

  return (
    <div className="flex flex-col h-[80vh]">
      <Card>
        <Table
          aria-label="Message Table"
          selectionMode="single"
          onRowAction={handleRowSelect}
          shadow="none"
          className="flex flex-col gap-3 h-[80vh] overflow-auto"
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

        <div className="sticky bottom-0 pb-3 mr-3 text-right">
          <Button
            color="secondary"
            isLoading={loadingMore}
            isDisabled={!hasMore}
            onClick={loadMore}
          >
            {hasMore ? "Load More" : "No more messages"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default MessageTable;
