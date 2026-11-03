import { LoggedUser } from './../models/LoggedUser';
import { inject, Injectable, OnInit, signal } from "@angular/core";
import { TokenService } from "./token-service";
import { HttpClient } from "@angular/common/http";
import { AuthSuccessResponse } from "../dtos/authSuccessResponse";
import { LoginRequest } from "../dtos/loginRequest";
import { RegisterRequest } from "../dtos/registerRequest";
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private tokenService = inject(TokenService);
    private http = inject(HttpClient);
    private apiRegisterUrl = "api/v1/auth/register";
    private apiLoginUrl = "api/v1/auth/login"
    private router = inject(Router);

    public isUserLogged = signal<boolean>(false);
    public loggedUser = signal<LoggedUser | null>(null);
    public error = signal<string | null>(null);

    constructor(){
        const token = this.tokenService.getToken();
        if (token != null) {
            this.logUser(token);
        } 
    }


    login(loginData: LoginRequest) {
        this.http.post<AuthSuccessResponse>(this.apiLoginUrl, loginData).subscribe({
            next: (data) => {
                this.tokenService.setToken(data.token);
                let token = this.tokenService.getToken();
                if (token != null) {
                    this.logUser(token);
                    this.router.navigateByUrl('home');
                } else {
                    this.error.set("Error leyendo token");
                }
                
            },
            error: (err) => {
                console.log(err);
                this.error.set("No se pudo autenticar usuario");
            }
        })
    }

    register(registerData: RegisterRequest) {
        this.http.post<AuthSuccessResponse>(this.apiRegisterUrl, registerData).subscribe({
            next: (data) => {
                this.tokenService.setToken(data.token);
                let token = this.tokenService.getToken();
                if (token != null) {
                    this.logUser(token);
                    this.router.navigateByUrl('home');
                } else {
                    this.error.set("Error leyendo token");
                }

            },
            error: (err) => {
                console.log(err);
                this.error.set("No se pudo registrar usuario");
            }
        })

    }

    logout(){
        this.removeUserFromStorage();
        this.tokenService.removeToken();
        this.isUserLogged.set(false);
        this.router.navigateByUrl('');
    }

    public getLoggedUser() {
        return this.loggedUser;
    }

    private getUserFromStorage(): LoggedUser | null {
        let storedValue = sessionStorage.getItem('loggedUser');
        if (storedValue == null) {
            return null;
        }
        return JSON.parse(storedValue);
    }

    private setUserIntoStorage(loggedUser: LoggedUser) {
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
    }

    private removeUserFromStorage(){
        sessionStorage.removeItem('loggedUser');
    }


    private logUser(token: string) {
        let decodedToken = this.tokenService.decodeToken(token);
        if (decodedToken != null) {
            let loggedUser: LoggedUser = {
                email: decodedToken.sub,
                role: decodedToken.authorities[0]
            }
            this.setUserIntoStorage(loggedUser);
            this.loggedUser.set(this.getUserFromStorage());
            this.isUserLogged.set(true);
        }
    }



}