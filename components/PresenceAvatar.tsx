import usePresenceStore from "@/hooks/usePresenceStore";
import { Avatar, Badge } from "@nextui-org/react";

type Props = {
  userId?: string | null;
  src?: string | null;
};
const PresenceAvatar = ({ userId, src }: Props) => {
  const { members } = usePresenceStore((state) => ({
    members: state.members,
  }));

  const isOnline = userId && members.includes(userId);

  return (
    <Badge content="" color="success" shape="circle" isInvisible={!isOnline}>
      <Avatar src={src || "/images/user/png"} alt="User Avatar" />
    </Badge>
  );
};
export default PresenceAvatar;
