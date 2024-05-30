import { CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { ReactNode } from "react";

type Props = {
  header: ReactNode | string;
  body: ReactNode;
  footer?: ReactNode;
};

const CardInnerWrapper = ({ header, body, footer }: Props) => {
  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        {typeof header === "string" ? (
          <div className="text-2xl font-semibold text-secondary">{header}</div>
        ) : (
          <>{header}</>
        )}
      </CardHeader>
      <Divider />
      <CardBody>{body}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </>
  );
};
export default CardInnerWrapper;
