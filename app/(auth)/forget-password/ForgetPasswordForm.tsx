"use client";

import { generateResetPasswordEmail } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { ActionResult } from "@/types";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

const ForgetPasswordForm = () => {
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm();

  const handleForgetPassword = async (data: FieldValues) => {
    setResult(await generateResetPasswordEmail(data.email));
    reset();
  };

  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="Forget Password"
      subHeaderText="Enter your email address to reset your password"
      body={
        <form
          onSubmit={handleSubmit(handleForgetPassword)}
          className="flex flex-col space-y-4"
        >
          <Input
            type="email"
            placeholder="Email address"
            variant="bordered"
            defaultValue=""
            {...register("email")}
          />
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            Send Reset email
          </Button>
        </form>
      }
      footer={<ResultMessage result={result} />}
    />
  );
};
export default ForgetPasswordForm;
