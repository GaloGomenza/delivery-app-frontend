import { User } from "./User";

export interface Store{
    id : number;
    name :  string;
    address : string;
    latitude : number;
    longitude : number;
    owner : User;
}
