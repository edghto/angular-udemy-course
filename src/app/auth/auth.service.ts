import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

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
    tokenExpirationtimer = null;

    constructor(private http: HttpClient, private router: Router) { }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationtimer = setTimeout(() => {
            if (this.tokenExpirationtimer) {
                clearTimeout(this.tokenExpirationtimer);
            }
            this.logout();
        }, expirationDuration);
    }

    logout() {
        localStorage.removeItem('userData');
        this.user.next(null);
        this.router.navigate(['/auth']);
    }

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
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}
