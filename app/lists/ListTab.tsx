"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { Member } from "@prisma/client";
import { Key } from "@react-types/shared";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MemberCard from "../members/MemberCard";
import { useTransition } from "react";
import LoadingComponent from "@/components/LoadingComponent";

type Props = {
  members: Member[];
  likeIds: Member["id"][];
};

const ListTab = ({ members, likeIds }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "source", label: "Members I have liked" },
    { id: "target", label: "Members that like me" },
    { id: "mutual", label: "Mutual likes" },
  ];

  function handleTabChange(key: Key) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col mt-10 gap-5">
      <Tabs
        aria-label="List of members"
        items={tabs}
        color="secondary"
        onSelectionChange={handleTabChange}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {isPending ? (
              <LoadingComponent />
            ) : (
              <>
                {members.length > 0 ? (
                  <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
                    {members.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        likeIds={likeIds}
                      />
                    ))}
                  </div>
                ) : (
                  <div> No members</div>
                )}
              </>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
export default ListTab;
