import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    private closeSub: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFatoryResolver: ComponentFactoryResolver
    ) { }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm) {
        if (!authForm.valid) {
            return;
        }

        const email = authForm.value.email;
        const password = authForm.value.password;

        this.error = null;
        this.isLoading = true;

        let authObs: Observable<AuthResponseData> = null;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
            resData => {
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                this.isLoading = false;
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
            }
        );

        authForm.reset();
    }

    onHandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {
        const alertCmpFactory = this.componentFatoryResolver
            .resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}