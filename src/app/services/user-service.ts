import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { User } from '../models/User';

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
}
