"use client";

import { Button, Card, Label, TextInput, useThemeMode } from "flowbite-react";
import { useToastContext } from "flowbite-react/lib/esm/components/Toast/ToastContext";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { z } from "zod";

const optsSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(1, {
      message: "Order number must be at least 1 character long",
    })
    .max(25, {
      message: "Order number must be at most 25 characters long",
    }),
});

export default function SignUpPage() {
  const { computedMode } = useThemeMode();
  const { pending } = useFormStatus();
  const toastContext = useToastContext();

  const clientAction = async (formData: FormData) => {
    //construct new options object

    const opts = {
      orderNumber: formData.get("order-number"),
    };

    // client-side validation
    const result = optsSchema.safeParse(opts);
    if (!result.success) {
      let errorMessage = "";
      // result.error.flatten();
      result.error.issues.forEach((issue) => {
        errorMessage = issue.message + ". ";
      });
      toastContext.setIsClosed(false);
      return;
    }

    // await getOrder();
  };

  return (
    <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
      {/* {showToast && (
        <Toast>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{toastMessage}</div>
          <Toast.Toggle onClick={() => setShowToast(false)} />
        </Toast>
      )} */}
      <Link
        href="/"
        className="mb-8 flex items-center justify-center text-2xl font-semibold lg:mb-10 dark:text-white"
      >
        <Image
          alt=""
          src={
            computedMode === "light"
              ? "/images/alliancechemical.svg"
              : "/images/alliancechemical_dark.svg"
          }
          width={150}
          height={150}
          className="mr-4 h-11"
        />
      </Link>
      <Card horizontal className="w-full md:max-w-[1024px]">
        <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
          Book Freight
        </h2>
        <form className="mt-8 space-y-6" action={clientAction}>
          <Label htmlFor="order-number">Enter a Shipstation Order Number</Label>
          <TextInput
            id="order-number"
            name="order-number"
            placeholder="Order Number"
            type="text"
            required
          />
          <Button type="submit" size="lg" color="blue" disabled={pending}>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
