import { getMissingSKUs } from "@/app/actions/action";
import {
  addProduct,
  deleteProducts,
  findUnsynchronizedProducts,
} from "@/helpers/getData";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const missingProducts = await getMissingSKUs();
    console.log("Missing Products:", missingProducts);
    if (missingProducts) {
      const newProducts = await addProduct(missingProducts);
      console.log("New Products:", newProducts);
    }
    const unsynchronizedProducts = await findUnsynchronizedProducts();
    console.log(
      `Extra products in database but in shipstation.  Delete these products: ${JSON.stringify(unsynchronizedProducts)}`,
    );
    if (unsynchronizedProducts) {
      // await deleteProductFreightLinks(unsynchronizedProducts);
      await deleteProducts(unsynchronizedProducts);
    } else {
      console.log("No valid Product IDs found to delete");
    }
    return NextResponse.json(missingProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
