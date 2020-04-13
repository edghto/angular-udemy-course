import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { User } from './user.model';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user: User) => {
                if (!user) {
                    return next.handle(req);
                }
                const modifedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifedReq);
            })
        );
    }
}