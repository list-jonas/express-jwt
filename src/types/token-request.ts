export interface TokenRequest {
    token: string; 
}

export function isTokenRequest(obj: any): obj is TokenRequest {
    const tokenKey: keyof TokenRequest = 'token';

    return obj && obj[tokenKey];
}