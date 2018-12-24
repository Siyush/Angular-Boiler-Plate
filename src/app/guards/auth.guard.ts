import { ToastrService } from './../services/toastr.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router:Router,
        public afAuth:AngularFireAuth,
        public toastrServ:ToastrService
    ){}

    canActivate(): Observable<boolean> {
        return this.afAuth.authState.pipe(map(auth => {
            if(!auth){
                this.router.navigate(['/home']);
                this.toastrServ.error(`You are not authorized to visit this page.`)
                return false;
            }else{
                return true;
            }
        }));
    }
}
