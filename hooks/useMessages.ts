"use client";

import {
  deleteMessage,
  getMessagesByContainer,
} from "@/app/actions/messageActions";
import { MessageDto } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import useMessagesStore from "./useMessageStore";

export const useMessages = (
  initialMessages: MessageDto[],
  nextCursor?: string
) => {
  const cursorRef = useRef(nextCursor);
  const { set, remove, messages, updateUnreadCount, resetMessages } =
    useMessagesStore((state) => ({
      set: state.set,
      remove: state.remove,
      messages: state.messages,
      updateUnreadCount: state.updateUnreadCount,
      resetMessages: state.resetMessages,
    }));

  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox = searchParams.get("container") === "outbox";
  const container = searchParams.get("container");
  const [deleting, setDeleting] = useState({ id: "", loading: false });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    set(initialMessages);
    cursorRef.current = nextCursor;

    return () => {
      resetMessages();
    };
  }, [initialMessages, resetMessages, set, nextCursor]);

  const loadMore = useCallback(async () => {
    if (cursorRef.current) {
      setLoadingMore(true);
      const { messages, nextCursor } = await getMessagesByContainer(
        container,
        cursorRef.current
      );
      set(messages);
      cursorRef.current = nextCursor;
      setLoadingMore(false);
    }
  }, [container, set]);

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
    loadMore,
    loadingMore,
    hasMore: !!cursorRef.current,
    messages,
  };
};
