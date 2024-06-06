import { getMissingSKUs } from "@/app/actions/action";
import { addProduct, addToProductFreightLinks, findUnsynchronizedProducts, deleteProducts, deleteProductFreightLinks } from "@/helpers/getData";
import { find } from "lodash";
import { NextResponse } from "next/server";


export async function POST() {
  try {
    const missingProducts = await getMissingSKUs();
    console.log("Missing Products:", missingProducts)
    if (missingProducts) {
      const newProducts = await addProduct(missingProducts);
      console.log("New Products:", newProducts)
      const productsForFreightLinks = newProducts ?? [];
      if (productsForFreightLinks.length > 0) {
        await addToProductFreightLinks(productsForFreightLinks);
      }
    }
    const unsynchronizedProducts = await findUnsynchronizedProducts();
    console.log("Unsynchronized Products:", unsynchronizedProducts);  
    if (unsynchronizedProducts) {
      await deleteProducts(unsynchronizedProducts);
      await deleteProductFreightLinks(unsynchronizedProducts);
    } else {
      console.log("No")
    }
    return NextResponse.json(missingProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
