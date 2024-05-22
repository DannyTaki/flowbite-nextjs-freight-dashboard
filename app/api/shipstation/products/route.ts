import { getMissingSKUs } from "@/app/actions/action";
import { addProduct } from "@/helpers/getData";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const missingProducts = await getMissingSKUs();
    if (missingProducts) {
      addProduct(missingProducts);
    }

    return NextResponse.json(missingProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
