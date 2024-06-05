import PresenceAvatar from "@/components/PresenceAvatar";
import { MessageDto } from "@/types";
import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { AiFillDelete } from "react-icons/ai";

type Props = {
  item: MessageDto;
  columnKey: string;
  isOutbox: boolean;
  deleteMessage: (message: MessageDto) => void;
  isDeleting: boolean;
};

const MessageTableCell = ({
  item,
  columnKey,
  isOutbox,
  deleteMessage,
  isDeleting,
}: Props) => {
  const cellValue = item[columnKey as keyof MessageDto];

  switch (columnKey) {
    case "recipientName":
    case "senderName":
      return (
        <div className={clsx("flex items-center gap-2 cursor-pointer")}>
          <PresenceAvatar
            userId={isOutbox ? item.recipientId : item.senderId}
            src={isOutbox ? item.recipientImage : item.senderImage}
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
          onClick={() => deleteMessage(item)}
          isLoading={isDeleting}
        >
          <AiFillDelete size={24} className="text-danger" />
        </Button>
      );
  }
};
export default MessageTableCell;
