import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { User, UserUpdateRequest } from '../models/User';

@Service()
export class UserService {
    private http = inject(HttpClient);
    private apiMyProfileUrl = "api/v1/users/me";

    public user = signal<User | null>(null);

    getMyProfile(){
        this.http.get<User>(this.apiMyProfileUrl).subscribe({
            next: (data) => {
                this.user.set(data);
            },
            error: (err) => {
                console.log("error en my profile");
            }

        })
    }

    updateMyProfile(data: UserUpdateRequest, onSaved: () => void, onError: (mensaje: string) => void){
        this.http.patch<User>(this.apiMyProfileUrl, data).subscribe({
            next: (user) => {
                this.user.set(user);
                onSaved();
            },
            error: (err) => {
                onError(this.getErrorMessage(err.status));
            }
        })
    }

    getErrorMessage(status: number): string {
        switch (status) {
            case 400:
                return 'Revisa los datos ingresados.';
            case 401:
            case 403:
                return 'La sesión expiró, vuelve a iniciar sesión.';
            case 404:
                return 'No se encontró el usuario.';
            default:
                return 'No se pudo guardar el perfil.';
        }
    }
}
