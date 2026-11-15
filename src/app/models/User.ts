export interface User{
    id : number;
    name : string;
    lastName : string;
    email : string;
    role : string;
}

export interface UserUpdateRequest {
    name : string;
    lastName : string;
    password? : string;
}
