import { getAuthUserId } from "@/app/actions/authActions";
import { getMemberByUserId } from "@/app/actions/memberActions";
import { Card } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import MemberSidebar from "@/app/members/MemberSidebar";

const Layout = async ({
  children,
}: PropsWithChildren<{
  params: { userId: string };
}>) => {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);

  if (!member) return notFound();

  const basePath = "/members/edit";

  const navLinks = [
    { name: "Update Profile", href: basePath },
    { name: "Update Photos", href: `${basePath}/photos` },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member} navLinks={navLinks} />
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">{children}</Card>
      </div>
    </div>
  );
};
export default Layout;
