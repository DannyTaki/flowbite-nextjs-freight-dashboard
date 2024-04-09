"use client";

import { Button, Card, Label, TextInput, useThemeMode, Toast } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { set, z } from "zod";
import { useState, ReactElement } from "react"; 
import { HiX, HiExclamation } from "react-icons/hi";
import { getOrder } from "@/app/actions/action";
import { optsSchema } from "@/types/optsSchema";



export default function BookFreight() {
  const { computedMode } = useThemeMode();
  const { pending } = useFormStatus();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [orderData, setOrderData] = useState(undefined);
  const [icon, setIcon] = useState(<HiX className="h-5 w-5" />);


  const clientAction = async (formData: FormData) => {
    //construct new options object

    const opts = {
      orderNumber: formData.get("order-number"),
    };

    // client-side validation
    const result = optsSchema.safeParse(opts);
    if (!result.success) {
      let errorMessage = "";
      result.error.issues.forEach((issue) => {
        errorMessage = issue.message + ". ";
      });
      setShowToast(true); 
      setToastMessage(errorMessage);
      return;
    }

    const response = await getOrder(opts);
    if(response !== null && 'error' in response) {
      setShowToast(true);
      setToastMessage(response.error.message);
    } else {
      if (response == null || response.orders.length === 0) {
        setShowToast(true);
        setToastMessage("No orders found with that order number");
        setIcon(<HiExclamation className="h-5 w-5" />);
      }
    }
  };

  return (
    <>
    {showToast && (
      <Toast className="fixed top-30 right-5 mt-6">
        <div  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
          {icon}
        </div>
        <div className="ml-3 text-sm font-normal">{toastMessage}</div>
        <Toast.Toggle onClick={() => setShowToast(false)} />
      </Toast>
    )}
    <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen"> 
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
    
    </>
  );
}
