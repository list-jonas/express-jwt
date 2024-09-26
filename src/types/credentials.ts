export interface Credentials {
    username: string;
    password: string;
}

export function isCredentialsObject(obj: any): obj is Credentials {
    const usernameKey: keyof Credentials = 'username';
    const passwordKey: keyof Credentials = 'password';

    return obj && obj[usernameKey] && obj[passwordKey];
}