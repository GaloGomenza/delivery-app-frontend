export interface RegisterRequest {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: 'ROLE_CONSUMER' | 'ROLE_MERCHANT' | 'ROLE_RIDER';
}