"use client";

import CardWrapper from "@/components/CardWrapper";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

const RegisterSuccessPage = () => {
  const router = useRouter();

  return (
    <CardWrapper
      headerText="You have successfully registered"
      subHeaderText="You can now log in to your account"
      action={() => router.push("/auth/login")}
      actionLabel="Go to login page"
      headerIcon={FaCheckCircle}
    />
  );
};
export default RegisterSuccessPage;
