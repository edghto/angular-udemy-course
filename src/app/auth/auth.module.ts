import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { AuthComponent } from './auth.component';

@NgModule({
    declarations: [
        AuthComponent,
    ],
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([
            { path: 'auth', component: AuthComponent }
        ]),
    ],
    exports: [RouterModule],
})
export class AuthModule { }