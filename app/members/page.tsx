import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import { getMembers } from "../actions/memberActions";
import MemberCard from "./MemberCard";

const MembersPage = async () => {
  const members = await getMembers();
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
      {Array.isArray(members) &&
        members.map((member) => (
          <MemberCard key={member.id} member={member} likeIds={likeIds} />
        ))}
    </div>
  );
};

export default MembersPage;
