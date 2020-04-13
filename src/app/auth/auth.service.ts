import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
    registered?: boolean,
}

const API_KEY = 'AIzaSyDwEaJUIDJ83G1xCtfP9EANgzut9npcLyo';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + API_KEY, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap(resData => this.handleAuth(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
            ))
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap(resData => this.handleAuth(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
            )));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An error occured';
        if (!errorRes.error ||
            !errorRes.error.error ||
            !errorRes.error.error.message) {
            throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Unknown user';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid password';
                break;
            case 'USER_DISABLED':
                errorMessage = 'User account disabled';
                break;
            case 'EMAIL_EXISTS':
                errorMessage = 'The email exists already';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Operation not allowed';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'too many attempts, try later';
                break;

        }
        return throwError(errorMessage);
    }

    private handleAuth(
        email: string,
        id: string,
        token: string,
        expiresIn: number) {
        const expirationDate = new Date().getTime() + expiresIn * 1000;
        const user = new User(email, id, token, new Date(expirationDate));
        this.user.next(user);
    }
}
