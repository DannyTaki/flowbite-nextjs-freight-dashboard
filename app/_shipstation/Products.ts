import { RequestMethod } from "shipstation-node"; 
import ShipStation  from "shipstation-node/src/shipstation";
import { BaseResource } from "shipstation-node/src/resources/Base";



export interface IProduct {
    productId: number;                 // The system-generated identifier for the product. Read Only field.
    sku: string;                       // Stock Keeping Unit (SKU). A user-defined value for a product to help identify the product. Each product should contain a unique SKU.
    name: string;                      // Name or description of the product.
    price: number;                     // The unit price of the product.
    defaultCost: number;               // The seller's cost for this product.
    length: number;                    // The length of the product. Unit of Measurement (UOM) is User Interface (UI)-dependent. No conversions will be made from one UOM to another.
    width: number;                     // The width of the product. Unit of Measurement (UOM) is User Interface (UI)-dependent. No conversions will be made from one UOM to another.
    height: number;                    // The height of the product. Unit of Measurement (UOM) is User Interface (UI)-dependent. No conversions will be made from one UOM to another.
    weightOz: number;                  // The weight of a single item in ounces.
    internalNotes: string;             // Seller's private notes for the product.
    fulfillmentSku: string;            // Stock Keeping Unit (SKU) for the fulfillment of that product by a 3rd party.
    createDate: string;                // The timestamp for when the product record was created in ShipStation's database. Read Only field.
    modifyDate: string;                // The timestamp for when the product record was modified in ShipStation. Read Only field.
    active: boolean;                   // Specifies whether or not the product is an active record.
    productCategory: object;           // The Product Category used to organize and report on similar products.
    productType: object;               // Specifies which Preset Group the product belongs to.
    warehouseLocation: string;         // The warehouse location associated with the product record.
    defaultCarrierCode: string;        // The default domestic shipping carrier for this product.
    defaultServiceCode: string;        // The default domestic shipping service for this product.
    defaultPackageCode: string;        // The default domestic packageType for this product.
    defaultIntlCarrierCode: string;    // The default international shipping carrier for this product.
    defaultIntlServiceCode: string;    // The default international shipping service for this product.
    defaultIntlPackageCode: string;    // The default international packageType for this product.
    defaultConfirmation: string;       // The default domestic Confirmation type for this Product.
    defaultIntlConfirmation: string;   // The default international Confirmation type for this Product.
    customsDescription: string;        // The default customs Description for the product.
    customsValue: number;              // The default customs Declared Value for the product.
    customsTariffNo: string;           // The default Harmonized Code for the Product.
    customsCountryCode: string;        // The default two-letter ISO Origin Country code for the Product.
    noCustoms: boolean;                // If true, this product will not be included on international customs forms.
    tags: object;                      // The ProductTag helps to organize and visually identify products.
  }
  

export interface IProductList {

}

export interface IProductUpdate {

}

export class Product extends BaseResource<IProduct> {
    constructor(shipstation: ShipStation) {
        super(shipstation, "products");
    }

    public async list(params?: object): Promise<IProduct[]> {
        const query = this.buildQueryStringFromParams(params);
        const url = `${this.baseUrl}/products` + query;
        const response = await this.shipstation.request({
            url,
            method: RequestMethod.GET
        });
        return response.data as IProduct[];
    }
}