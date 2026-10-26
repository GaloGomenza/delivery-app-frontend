import { Product } from "./Product";
import { Store } from "./Store";
import { User } from "./User";

export interface Order{
    id : number;
    rider : User;
    consumer : User;
    store : Store;
    customerAddress : string;
    customerLatitude : number;
    customerLongitude : number;
    latitude : number;
    longitude : number;
    products : [Product];
    total : number;
    status : string;
    lastUpdate : Date;
    paymentType : string;
}
