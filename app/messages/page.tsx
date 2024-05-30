import { getMessagesByContainer } from "../actions/messageActions";
import MessageSidebar from "./MessageSidebar";
import MessageTable from "./MessageTable";

const MessagesPage = async ({
  searchParams,
}: {
  searchParams: { container: string };
}) => {
  const messages = await getMessagesByContainer(searchParams.container);

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh] mt-10">
      <div className="col-span-2">
        <MessageSidebar />
      </div>
      <div className="col-span-10">
        <MessageTable messages={messages} />
      </div>
    </div>
  );
};
export default MessagesPage;
