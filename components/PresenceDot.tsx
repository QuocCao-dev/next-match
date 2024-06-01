import usePresenceStore from "@/hooks/usePresenceStore";
import { Member } from "@prisma/client";
import { GoDot, GoDotFill } from "react-icons/go";

type Props = {
  member: Member;
};

const PresenceDot = ({ member }: Props) => {
  const { members } = usePresenceStore((state) => ({ members: state.members }));

  const isOnline = members.includes(member.userId);

  if (!isOnline) return null;

  return (
    <>
      <GoDot
        size={36}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <GoDotFill size={32} className="fill-green-500 animate-pulse" />
    </>
  );
};

export default PresenceDot;
