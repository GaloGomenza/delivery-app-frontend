import { Order } from "./Order";
import { Store } from "./Store";

export interface Product{
    id : number;
    name : string;
    price : number;
    description : string;
    imageURL : string;
    status : string;
    store : Store;
}
