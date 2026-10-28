import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

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

    public decodeToken(token: string){
        try{
            const decodedPayload = jwtDecode(token);
            return decodedPayload;
        }catch(error){
            console.error('Token invalido', error);
            return null;
        }
    }

}