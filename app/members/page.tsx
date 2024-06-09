import AppPagination from "@/components/AppPagination";
import EmptyState from "@/components/EmptyState";
import { GetMemberParams } from "@/types";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import { getMembers } from "../actions/memberActions";
import MemberCard from "./MemberCard";

const MembersPage = async ({
  searchParams,
}: {
  searchParams: GetMemberParams;
}) => {
  const { items: members, totalCount } = await getMembers(searchParams);
  const likeIds = await fetchCurrentUserLikeIds();

  if (!members || members.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
        {Array.isArray(members) &&
          members.map((member) => (
            <MemberCard key={member.id} member={member} likeIds={likeIds} />
          ))}
      </div>
      <AppPagination totalCount={totalCount} />
    </>
  );
};

export default MembersPage;
