import { inject, Injectable, signal } from "@angular/core";
import { TokenService } from "./token-service";
import { HttpClient } from "@angular/common/http";
import { AuthSuccessResponse } from "../dtos/authSuccessResponse";
import { LoginRequest } from "../dtos/loginRequest";
import { RegisterRequest } from "../dtos/registerRequest";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private tokenService = inject(TokenService);
    private http = inject(HttpClient);
    private apiUrl = "http://localhost:8447/api/v1/auth/register";

    public readonly isUserLogged = signal<boolean>(false);
    public readonly loggedUser = null;
    public readonly error = signal<string|null>(null);

    login(loginData: LoginRequest){
        this.http.post<AuthSuccessResponse>(this.apiUrl, loginData).subscribe({
            next: (data) => {
                this.tokenService.setToken(data.token);
                this.isUserLogged.set(true);
            },
            error: (err) => {
                console.log(err);
                this.error.set("No se pudo autenticar usuario");
            }
        })
    }

    register(registerData: RegisterRequest){
        this.http.post<AuthSuccessResponse>(this.apiUrl, registerData).subscribe({
            next: (data) => {
                this.tokenService.setToken(data.token);
                this.isUserLogged.set(true);
                console.log(data);
            },
            error: (err) => {
                console.log(err);
                this.error.set("No se pudo registrar usuario");
            }
        })

    }






  
}