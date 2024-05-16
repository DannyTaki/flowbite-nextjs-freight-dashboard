import ShipStationAPI from "shipstation-node";
import type { IShipstationOptions } from "shipstation-node/typings/shipstation";
import { Product } from "./Products"; // Adjust the path according to your project structure
import Shipstation from "shipstation-node/src/shipstation";

export default class CustomShipStationAPI extends ShipStationAPI {
    public products: Product;
    protected shipstation: Shipstation;

    constructor(options?: IShipstationOptions) {
        super(options);
        this.shipstation = new Shipstation(options);
        this.products = new Product(this.shipstation); // Pass 'this' to the Product constructor
    }
}
