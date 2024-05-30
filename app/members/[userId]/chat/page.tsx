import { getMessagesThread } from "@/app/actions/messageActions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import ChatForm from "./ChatForm";
import MessageBox from "./MessageBox";
import { getAuthUserId } from "@/app/actions/authActions";

const ChatPage = async ({ params }: { params: { userId: string } }) => {
  const messages = await getMessagesThread(params.userId);
  const userId = await getAuthUserId();

  const body = (
    <div>
      {messages.length === 0 ? (
        "No messages to display"
      ) : (
        <div>
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );

  return <CardInnerWrapper header="Chat" body={body} footer={<ChatForm />} />;
};
export default ChatPage;
