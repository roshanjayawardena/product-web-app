export interface userlogin {
    email: string,
    password: string;
}

export interface loginreponse {
    token: string,
    refreshtoken: string,
    userRole: string
}

export interface RefreshToken {
    accesstoken: string,
    refreshtoken: string
}

export interface CurrentUser {
    name: string;
    role: string;
    email: string;
}