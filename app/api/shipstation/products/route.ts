import { getMissingSKUs } from "@/app/actions/action";
import { addProduct, addToProductFreightLinks } from "@/helpers/getData";
import { NextResponse } from "next/server";


export async function POST() {
  try {
    const missingProducts = await getMissingSKUs();
    if (missingProducts) {
      const newProducts = await addProduct(missingProducts);
      const productsForFreightLinks = newProducts?.map(product => ({
        product_id: product.product_id,
        name: product.name,
      })) || [];
      
      
      addToProductFreightLinks(productsForFreightLinks);

    }

    return NextResponse.json(missingProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
