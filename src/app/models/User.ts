import { Order } from "./Order";
import { Store } from "./Store";

export interface User{
    id : number;
    name : string;
    lastName : string;
    email : string;
    password : string;
    role : string;
    /* TIENE SENTIDO ESTO ? NO ENTIENDO LA RELACIÓN
    orderRiders ?: [Order];
    orderCostumers ?: [Order];
    stores : [Store];
    */


}
