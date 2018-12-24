import { ToastrService } from './../../services/toastr.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authServ:AuthService,
    public router:Router,
    
public toastrServ:ToastrService) { }

  ngOnInit() {
  }

  logout(){
    this.authServ.logout();
    this.toastrServ.success('You have been logged out Successfully');
    this.router.navigate(['/home']);
  }
}
