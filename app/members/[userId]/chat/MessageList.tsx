"use client";

import { MessageDto } from "@/types";
import { useCallback, useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";

type Props = {
  initialMessages: MessageDto[];
  currentUserId: string;
  chatId: string;
};

const MessageList = ({ initialMessages, currentUserId, chatId }: Props) => {
  const [messages, setMessages] = useState(initialMessages);

  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe(chatId);

    channel.bind("message:new", handleNewMessage);

    return () => {
      channel.unsubscribe();
      channel.unbind("message:new");
    };
  }, [chatId, handleNewMessage]);

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
