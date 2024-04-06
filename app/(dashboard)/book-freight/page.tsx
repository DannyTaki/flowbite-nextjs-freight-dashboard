"use client";

import { Button, Card, Label, TextInput, useThemeMode } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import type { IOrderPaginationResult } from "shipstation-node/typings/models";



export default function SignUpPage() {
  const { computedMode } = useThemeMode();
  const [orderData, setOrderData] = useState<IOrderPaginationResult | null>(
    null,
  );
  const [orderNumber, setOrderNumber] = useState(""); // This will trigger the useEffect when changed

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Safely accessing formData using optional chaining
    const orderNumber =
      formData.get("order-number")?.toString() ?? "defaultOrderNumber";
    console.log("Order Number: " + orderNumber);
    setOrderNumber(orderNumber);

    // Fetch logic remains the same
  };

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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          orderData &&
          orderData.orders.length > 0 && (
            <div className="mt-4 rounded border border-gray-200 p-4 shadow-lg">
              <h3 className="text-lg font-semibold">Order Details:</h3>
              <p>Order ID: {orderData.orders[0].orderId.toString()}</p>
              <p>Order Number: {orderData.orders[0].orderNumber}</p>
              <p>Order Date: {orderData.orders[0].orderDate}</p>
              <p>Total Paid: ${orderData.orders[0].amountPaid.toString()}</p>
              <p>Order Status: {orderData.orders[0].orderStatus}</p>
              <p>
                Shipping to: {orderData.orders[0].shipTo.name},{" "}
                {orderData.orders[0].shipTo.city},{" "}
                {orderData.orders[0].shipTo.state}
              </p>
            </div>
          )
        )}
      </Card>
    </div>
  );
}
