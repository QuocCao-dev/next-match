import { getAuthUserId } from "@/app/actions/authActions";
import {
  getMemberByUserId,
  getMemberPhotosByUserId,
} from "@/app/actions/memberActions";
import MemberPhotos from "@/components/MemberPhotos";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import { notFound } from "next/navigation";
import MemberPhotoUpload from "./MemberPhotoUpload";

const PhotosPage = async () => {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  const photos = await getMemberPhotosByUserId(userId);

  if (!photos) return notFound();

  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        <div className="text-2xl font-semibold text-secondary-50">
          Edit Photos
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <MemberPhotoUpload />
        <MemberPhotos photos={photos} editing mainImageUrl={member?.image} />
      </CardBody>
    </>
  );
};
export default PhotosPage;
