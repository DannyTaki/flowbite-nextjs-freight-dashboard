import { getMissingSKUs } from "@/app/actions/action"
import { NextRequest, NextResponse } from "next/server";
import { addProduct } from "@/app/actions/action";

export async function POST() {
    try { 
        const missingProducts = await getMissingSKUs();
        if(missingProducts) {
            addProduct(missingProducts);
        }
        
        return NextResponse.json(missingProducts);
        
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}