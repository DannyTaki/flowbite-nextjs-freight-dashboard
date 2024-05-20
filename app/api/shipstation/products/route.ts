import { getMissingSKUs } from "@/app/actions/action"
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
    try { 
        const missingProducts = await getMissingSKUs();
        if(missingProducts) {
            updateProductTable(missingProducts);
        }
        
        return NextResponse.json(missingProducts);
        
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}