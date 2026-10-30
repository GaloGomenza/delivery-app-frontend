import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { TokenDecoded } from "../models/TokenDecoded";

@Injectable({
  providedIn: 'root',
})
export class TokenService {

    private jwtToken = 'accessToken';

    public setToken(token: string): void {
        sessionStorage.setItem(this.jwtToken, token);
    }

    public getToken(): string | null {
        return sessionStorage.getItem(this.jwtToken);
    }

    public removeToken(): void {
        sessionStorage.removeItem(this.jwtToken);
    }

    public decodeToken(token: string) : TokenDecoded | null {
        try{
            const tokenDecoded :TokenDecoded = jwtDecode(token);
            return tokenDecoded;
        }catch(error){
            console.error('Token invalido', error);
            return null;
        }
    }

}