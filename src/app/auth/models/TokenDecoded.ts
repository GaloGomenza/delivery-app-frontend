export interface TokenDecoded {
    authorities: string[],
    sub: string,
    iat: number,
    exp: number
}