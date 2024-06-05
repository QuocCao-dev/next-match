"use client";

import { deleteMessage } from "@/app/actions/messageActions";
import { MessageDto } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect, useState } from "react";
import useMessagesStore from "./useMessageStore";

export const useMessages = (initialMessages: MessageDto[]) => {
  const { set, remove, messages, updateUnreadCount } = useMessagesStore(
    (state) => ({
      set: state.set,
      remove: state.remove,
      messages: state.messages,
      updateUnreadCount: state.updateUnreadCount,
    })
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox = searchParams.get("container") === "outbox";
  const [deleting, setDeleting] = useState({ id: "", loading: false });

  useEffect(() => {
    set(initialMessages);

    return () => {
      set([]);
    };
  }, [initialMessages, set]);

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
      remove(message.id);
      if (!message.dateRead && !isOutbox) updateUnreadCount(-1);
      setDeleting((prev) => ({ ...prev, loading: false }));
    },
    [isOutbox, remove, updateUnreadCount]
  );

  const handleRowSelect = (key: Key) => {
    const message = initialMessages.find((m) => m.id === key);
    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;
    router.push(url + "/chat");
  };

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    rowSelect: handleRowSelect,
    isDeleting: deleting,
  };
};
