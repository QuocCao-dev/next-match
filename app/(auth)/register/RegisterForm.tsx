"use client";

import { registerUser } from "@/app/actions/authActions";
import {
  RegisterSchema,
  profileSchema,
  registerSchema,
} from "@/lib/schemas/registerSchema";
import { handleFormServerErrors } from "@/lib/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { FormProvider, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import UserDetailsForm from "./UserDetailsForm";
import { useState } from "react";
import ProfileForm from "./ProfileForm";
import { useRouter } from "next/navigation";

const stepSchemas = [registerSchema, profileSchema];

const RegisterForm = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const currentValidation = stepSchemas[activeStep];

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(currentValidation),
    mode: "onTouched",
  });

  const {
    formState: { errors, isValid, isSubmitting },
    getValues,
  } = methods;

  const onSubmit = async () => {
    const data = getValues();
    const result = await registerUser(data);
    if (result.status === "success") {
      router.push("/register/success");
    } else {
      handleFormServerErrors(result, methods.setError);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
      case 1:
        return <ProfileForm />;
      default:
        return "Unknown step";
    }
  };

  const onBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onNext = async () => {
    if (activeStep === stepSchemas.length - 1) {
      await onSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500">Welcome to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onNext)}>
            {getStepContent(activeStep)}
            {errors.root?.serverError && (
              <p className="text-danger text-sm">
                {errors.root.serverError.message}
              </p>
            )}
            <div className="flex flex-row items-center gap-6 mt-4">
              {activeStep !== 0 && <Button onClick={onBack}>Back</Button>}
              <Button
                isLoading={isSubmitting}
                isDisabled={!isValid}
                fullWidth
                color="secondary"
                type="submit"
              >
                {activeStep === stepSchemas.length - 1 ? "Submit" : "Continue"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
};
export default RegisterForm;
