"use client";

import { Button, Card, Label, TextInput, useThemeMode } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { getOrder } from "@/app/actions/action";



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
        <form className="mt-8 space-y-6" action={getOrder}>
          <Label htmlFor="order-number">Enter a Shipstation Order Number</Label>
          <TextInput
            id="order-number"
            name="order-number"
            placeholder="Order Number"
            type="text"
          />
          <Button type="submit" size="lg" color="blue">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
