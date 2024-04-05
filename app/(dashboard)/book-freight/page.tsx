"use client";

import { Button, Card, Label, TextInput, useThemeMode } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const orderNumber = formData.get("order-number");
  console.log("Order Number: " + orderNumber);

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/getOrder",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderNumber }),
    },
  );

  if (response.ok) {
    alert("Order Fetched Successfully!");
  } else {
    alert("Failed to fetch order");
  }
};

export default function SignUpPage() {
  const { computedMode } = useThemeMode();
  return (
    <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
      <Link
        href="/"
        className="mb-8 flex items-center justify-center text-2xl font-semibold lg:mb-10 dark:text-white"
      >
        <Image
          alt=""
          src={
            computedMode == "light"
              ? "/images/alliancechemical.svg"
              : "/images/alliancechemical_dark.svg"
          }
          width={150}
          height={150}
          className="mr-4 h-11"
        />
      </Link>
      <Card
        horizontal
        // imgSrc="/images/authentication/create-account.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px]"
        theme={{
          root: {
            children: "my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16",
          },
          img: {
            horizontal: {
              on: "hidden rounded-l-lg md:w-96 md:p-0 lg:block",
            },
          },
        }}
      >
        <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
          Book Freight
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2">
            <Label>Enter a Shipstation Order Number</Label>
            <TextInput
              id="order-number"
              name="order-number"
              placeholder="Order Number"
              type="text"
            />
          </div>
          <div className="mb-7">
            <Button
              size="lg"
              color="blue"
              type="submit"
              theme={{ inner: { base: "px-5 py-3" } }}
              className="w-full px-0 py-[1px] sm:w-auto"
            >
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
