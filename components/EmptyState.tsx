import { Card, CardBody, CardHeader } from "@nextui-org/react";

const EmptyState = () => {
  return (
    <div className="flex justify-between items-center mt-20">
      <Card className="p-5">
        <CardHeader className="text-3xl text-secondary">
          There are no members to display
        </CardHeader>
        <CardBody className="text-center">
          Please select a different filter
        </CardBody>
      </Card>
    </div>
  );
};
export default EmptyState;
