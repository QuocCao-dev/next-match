"use client";

import { MessageDto } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/util";
import { Channel } from "pusher-js";

type Props = {
  initialMessages: MessageDto[];
  currentUserId: string;
  chatId: string;
};

const MessageList = ({ initialMessages, currentUserId, chatId }: Props) => {
  const [messages, setMessages] = useState(initialMessages);
  const channelRef = useRef<Channel | null>(null);

  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleReadMessage = useCallback((messageIds: string[]) => {
    setMessages((prevState) =>
      prevState.map((message) =>
        messageIds.includes(message.id)
          ? { ...message, dateRead: formatShortDateTime(new Date()) }
          : message
      )
    );
  }, []);

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(chatId);
      channelRef.current.bind("message:new", handleNewMessage);
      channelRef.current.bind("message:read", handleReadMessage);
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind("message:new");
        channelRef.current.unbind("message:read");
      }
    };
  }, [chatId, handleNewMessage, handleReadMessage]);

  return (
    <div>
      {messages.length === 0 ? (
        "No message to display"
      ) : (
        <div>
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default MessageList;
