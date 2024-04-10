"use client";

import { getOrder } from "@/app/actions/action";
import { optsSchema } from "@/types/optsSchema";
import {
  Button,
  Card,
  Label,
  TextInput,
  Toast,
  useThemeMode,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  HiCheck,
  HiChevronDown,
  HiChevronRight,
  HiExclamation,
  HiMail,
  HiPhone,
  HiX,
} from "react-icons/hi";
import { type IOrderPaginationResult } from "shipstation-node/typings/models";
import titleize from "titleize";

export default function BookFreight() {
  const { computedMode } = useThemeMode();
  const { pending } = useFormStatus();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [orderData, setOrderData] = useState<IOrderPaginationResult | null>(
    null,
  );
  const [icon, setIcon] = useState<ReactElement | null>(null);
  const [toastStyle, setToastStyle] = useState<string | null>(null);
  const [chevronRight, setChevronRight] = useState<boolean | null>(true);
  const [disableFreightBtn, setDisableFreightBtn] = useState<
    boolean | undefined
  >(true);
  const [chevronItemRight, setChevronItemRight] = useState<boolean | null>(
    true,
  );

  function handleChevronClick(section: string) {
    if (section === "shipment") {
      setChevronRight((prev) => !prev);
    }
    if (section === "item") {
      setChevronItemRight((prev) => !prev);
    }
  }

  const clientAction = async (formData: FormData) => {
    setOrderData(null);
    setShowToast(false);
    setDisableFreightBtn(true);

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
      setToastStyle(
        "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200",
      );
      setIcon(<HiX className="size-5" />);
      return;
    }

    const response = await getOrder(opts);
    if (response !== null && "error" in response) {
      setShowToast(true);
      setToastMessage(response.error.message);
      setIcon(<HiX className="size-5" />);
    } else if (response && response.orders && response.orders.length > 0) {
      setOrderData(response);
      setShowToast(true);
      setToastMessage("Order data loaded successfully!");
      setToastStyle(
        "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
      );
      setIcon(<HiCheck className="size-5" />);
      setDisableFreightBtn(false);
    } else {
      setShowToast(true);
      setToastMessage("No orders found with that order number");
      setToastStyle(
        "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200",
      );
      setIcon(<HiExclamation className="size-5" />);
    }
  };

  return (
    <>
      {showToast && (
        <Toast className="fixed right-5 top-28 mt-6">
          <div
            className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${toastStyle}`}
          >
            {icon}
          </div>
          <div className="ml-3 text-sm font-normal">{toastMessage}</div>
          <Toast.Toggle onClick={() => setShowToast(false)} />
        </Toast>
      )}
      <div className="flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center text-2xl font-semibold dark:text-white lg:mb-10"
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
        <Card horizontal className="w-full md:max-w-screen-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
            Book Freight
          </h2>
          <form className="mt-8 space-y-6" action={clientAction}>
            <Label htmlFor="order-number">
              Enter a Shipstation Order Number
            </Label>
            <TextInput
              id="order-number"
              name="order-number"
              placeholder="Order Number"
              type="text"
              required
            />
            <div className="flex flex-row gap-3">
              <Button type="submit" size="lg" color="blue" disabled={pending}>
                Submit
              </Button>
              <Button
                type="submit"
                size="lg"
                color="success"
                disabled={disableFreightBtn}
              >
                Book Freight
              </Button>
            </div>
          </form>
        </Card>
        <Card className="mt-10 w-full md:max-w-screen-lg overflow-y-scroll max-h-80">
          {orderData ? (
            <ul>
              <div className="flex flex-row">
                <button
                  onClick={() => handleChevronClick("shipment")}
                  className="focus:outline-none"
                >
                  {chevronRight ? (
                    <HiChevronRight className="size-7 dark:text-white" />
                  ) : (
                    <HiChevronDown className="size-7 dark:text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleChevronClick("shipment")}
                  className="focus:outline-none"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white lg:text-2xl">
                    Shipment Details
                  </h3>
                </button>
              </div>
              {!chevronRight &&
                orderData.orders.map((order) => (
                  <div key={order.orderId} className="grid grid-cols-2">
                    <ul className="flex flex-col gap-1">
                      <li className="mt-3 text-sm font-bold text-gray-900 dark:text-white lg:text-base">
                        Order Number: {order.orderNumber}
                      </li>
                      <li className="text-sm font-bold text-gray-900 dark:text-white lg:text-base">
                        Ship To Address
                      </li>
                      <li className="text-sm text-gray-900 dark:text-white lg:text-base">
                        {order.shipTo.name}
                      </li>
                      {order.shipTo.company && (
                        <li className="text-sm  text-gray-900 dark:text-white lg:text-base">
                          {order.shipTo.company}
                        </li>
                      )}
                      <li className="text-sm  text-gray-900 dark:text-white lg:text-base">
                        {titleize(order.shipTo.street1)}{" "}
                        {order.shipTo.street2
                          ? titleize(order.shipTo.street2)
                          : ""}{" "}
                        {order.shipTo.street3
                          ? titleize(order.shipTo.street3)
                          : ""}
                      </li>
                      <li className="text-sm  text-gray-900 dark:text-white lg:text-base">
                        {titleize(order.shipTo.city)}, {order.shipTo.state},{" "}
                        {titleize(order.shipTo.postalCode)}
                      </li>
                      <div className="flex flex-row">
                        <HiPhone className="mr-2 size-5 dark:text-white" />
                        <li className="text-sm  text-gray-900 dark:text-white lg:text-base">
                          {order.shipTo.phone}
                        </li>
                      </div>
                      <div className="flex flex-row">
                        <HiMail className="mr-2 size-5 dark:text-white" />
                        <li className="text-sm  text-gray-900 dark:text-white lg:text-base">
                          {order.customerEmail}
                        </li>
                      </div>
                    </ul>
                    <img
                      className="col-start-2"
                      src={order.items[0]?.imageUrl || ""}
                      width="150"
                      height="150"
                      alt="Order Item"
                    />
                  </div>
                ))}
            </ul>
          ) : (
            <p>No order details available.</p>
          )}
        </Card>
        {orderData ? (
          <Card className="mt-10 w-full md:max-w-screen-lg overflow-y-scroll max-h-80">
            <div className="flex flex-row">
              <button
                onClick={() => handleChevronClick("item")}
                className="focus:outline-none"
              >
                {chevronItemRight ? (
                  <HiChevronRight className="size-7 dark:text-white" />
                ) : (
                  <HiChevronDown className="size-7 dark:text-white" />
                )}
              </button>
              <button
                onClick={() => handleChevronClick("item")}
                className="focus:outline-none"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white lg:text-2xl">
                  Item Details
                </h3>
              </button>
            </div>
            {!chevronItemRight && (
              <>
                <ul className="mt-4 grid grid-cols-5 bg-gradient-to-r from-green-400 to-blue-500 text-center ">
                  <li className="font-bold">Item Name</li>
                  <li className="font-bold">Image</li>
                  <li className="font-bold">Unit Cost</li>
                  <li className="font-bold">Quantity</li>
                  <li className="font-bold">Total</li>
                </ul>
                {orderData.orders.map((order) =>
                  order.items.map((item, index) => (
                    <ul
                      key={index}
                      className="grid grid-cols-5 items-center border-b bg-white text-center"
                    >
                      <li className="py-2">{item.name}</li>
                      <li>
                        <img
                          src={item.imageUrl || ""}
                          className="mx-auto size-10"
                          alt="Order Item"
                        />
                      </li>
                      <li>${item.unitPrice?.toFixed(2)}</li>
                      <li>{item.quantity}</li>
                      <li>
                        ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                      </li>
                    </ul>
                  )),
                )}
              </>
            )}
          </Card>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
