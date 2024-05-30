import { Spinner } from "@nextui-org/react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex-center vertical-center">
      <Spinner label="Loading..." color="secondary" labelColor="secondary" />
    </div>
  );
}
