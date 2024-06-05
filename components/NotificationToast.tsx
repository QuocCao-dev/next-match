import { transformImageUrl } from "@/lib/util";
import Link from "next/link";
import Image from "next/image";
import { MessageDto } from "@/types";
import { toast } from "react-toastify";

type Props = {
  image?: string | null;
  href: string;
  title: string;
  subtitle?: string;
};

const NotificationToast = ({ href, title, subtitle, image }: Props) => {
  return (
    <Link href={href} className="flex items-center">
      <div className="mr-2">
        <Image
          src={transformImageUrl(image) ?? "/images/user.png"}
          height={50}
          width={50}
          alt="Sender Image"
        />
        <div className="flex flex-grow flex-col justify-center">
          <div className="font-semibold">{title}</div>
          <div className="text-sm">{subtitle ?? "Click to view"}</div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationToast;

export const newMessageToast = (message: MessageDto) => {
  toast(
    <NotificationToast
      image={message.senderImage}
      href={`/members/${message.senderId}/chat`}
      title={`${message.senderName} send you a new message`}
    />
  );
};

export const newLikeToast = (
  name: string,
  image: string | null,
  userId: string
) => {
  toast(
    <NotificationToast
      image={image}
      href={`/members/${userId}`}
      title={`You have a new like from ${name}`}
      subtitle="Click here to view their profile"
    />
  );
};
