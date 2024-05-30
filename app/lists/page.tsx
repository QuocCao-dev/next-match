import {
  fetchCurrentUserLikeIds,
  fetchLikedMembers,
} from "../actions/likeActions";
import ListTab from "./ListTab";

const ListsPage = async ({
  searchParams,
}: {
  searchParams: { type: string };
}) => {
  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikedMembers(
    searchParams.type as "source" | "target" | "mutual"
  );

  return (
    <div>
      <ListTab members={members} likeIds={likeIds} />
    </div>
  );
};
export default ListsPage;
