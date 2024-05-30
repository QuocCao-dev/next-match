import { getMemberByUserId } from "@/app/actions/memberActions";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import { notFound } from "next/navigation";

type Props = {
  params: {
    userId: string;
  };
};

const MemberDetailedPage = async ({ params }: Props) => {
  const member = await getMemberByUserId(params.userId);

  if (!member) return notFound();

  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Profile
      </CardHeader>
      <Divider />
      <CardBody>{member.description}</CardBody>
    </>
  );
};
export default MemberDetailedPage;
