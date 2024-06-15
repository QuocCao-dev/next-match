"use client";

import {
  generateResetPasswordEmail,
  resetPassword,
} from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { forgetPasswordSchema } from "@/lib/schemas/forgetPasswordSchema";
import { ActionResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(forgetPasswordSchema),
  });

  const handleResetPassword = async (data: FieldValues) => {
    setResult(await resetPassword(data.password, searchParams.get("token")));
    reset();
  };

  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="Reset Password"
      subHeaderText="Enter your new email password"
      body={
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="flex flex-col space-y-4"
        >
          <Input
            type="password"
            placeholder="Password"
            variant="bordered"
            defaultValue=""
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message as string}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            variant="bordered"
            defaultValue=""
            {...register("confirmPassword")}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message as string}
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
export default ResetPasswordForm;
