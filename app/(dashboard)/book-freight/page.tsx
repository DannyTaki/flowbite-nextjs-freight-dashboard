"use client";

import { Button, Card, Label, TextInput, useThemeMode, Toast } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { set, z } from "zod";
import { useState, ReactElement } from "react"; 
import { HiX, HiExclamation, HiCheck } from "react-icons/hi";
import { getOrder } from "@/app/actions/action";
import { optsSchema } from "@/types/optsSchema";
import { IOrder, type IOrderPaginationResult } from "shipstation-node/typings/models";



export default function BookFreight()
{
  const { computedMode } = useThemeMode();
  const { pending } = useFormStatus();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [orderData, setOrderData] = useState<IOrderPaginationResult | null>(null);
  const [icon, setIcon] = useState<ReactElement | null>(null);
  const [toastStyle, setToastStyle] = useState<string | null>(null);


  const clientAction = async (formData: FormData) => 
  {
    setOrderData(null);
    setShowToast(false);

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
      setToastStyle("bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200");
      setIcon(<HiX className="h-5 w-5" />);
      return;
    }

    const response = await getOrder(opts);
    if(response !== null && 'error' in response) {
      setShowToast(true);
      setToastMessage(response.error.message);
      setIcon(<HiX className="h-5 w-5" />);
    } else if (response && response.orders && response.orders.length > 0) {
        setOrderData(response);
        setShowToast(true);
        setToastMessage("Order data loaded successfully!");
        setToastStyle("bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200");
        setIcon(<HiCheck className="h-5 w-5" />);
      } else {
        setShowToast(true);
        setToastMessage("No orders found with that order number");
        setToastStyle("bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200");
        setIcon(<HiExclamation className="h-5 w-5" />);
      }
  }  

      return (
        <>
          {showToast && (
            <Toast className="fixed top-30 right-5 mt-6">
              <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastStyle}`}>
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
            <Card className="w-full md:max-w-[1024px] mt-10">
              <div className="order-details">
              {orderData ? (
                <div>
                  <ul>
                  <h3 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">Shipment Details</h3>
                    {orderData.orders.map(order => (
                      <div className="grid grid-col-2">
                        <ul key={order.orderId}>
                          <li className="text-sm font-bold text-gray-900 lg:text-base dark:text-white ">Order Number: {order.orderNumber}</li>
                          <li>Ship To Address</li>
                          <li>{order.shipTo.name}</li>
                          {order.shipTo.company && <li>Company: {order.shipTo.company}</li>}
                          <li>{order.shipTo.street1}, {order.shipTo.street2}, {order.shipTo.street3}</li>                        
                          <li>City: {order.shipTo.city}, {order.shipTo.state}, {order.shipTo.postalCode} </li>                                  
                        </ul>
                        <img className="col-start-2" src={order.items[0].imageUrl} width="150" height="150" />  
                      </div>
                    ))}
                    </ul>
                </div>
              ) : (
                <p>No order details available.</p>
              )}
            </div>
            </Card>
          </div> 
        </>
      );
    }

