import { AuthService } from './../../services/auth.service';

import { Router } from '@angular/router';
import { ToastrService } from './../../services/toastr.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $;





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginForm:FormGroup;
  @ViewChild('cardHidden') div;
  @ViewChild('fullPage') div2;
  cardHidden:any;
  fullPage:any;

  constructor(
    private frmBuilder: FormBuilder,
    private authServ:AuthService,
    private toastrServ:ToastrService,
    private router:Router
  ) { }

  ngOnInit() {

    this.cardHidden = $(this.div.nativeElement);
    this.fullPage = $(this.div2.nativeElement);

    setTimeout(()=>{ this.cardHidden.removeClass('card-hidden');},1000);
    this.checkFullPageBackgroundImage();
    
    
    this.loginForm =  this.frmBuilder.group({
      email: ['', Validators.required],
      password: ['',Validators.required]
    });
  }

  checkFullPageBackgroundImage(){
    
    let image_src = this.fullPage.data('image');

    if(image_src !== undefined){
        let image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
        this.fullPage.append(image_container);
    }
}

  async onSubmit(login:any){

    this.authServ.login(login.email,login.password)
      .then((res) => {
        this.toastrServ.success(`<center>You are logged in.....<br>Welcome Back !!!</center>`);
        this.router.navigate(['/main']);
      })
      .catch((err) =>{
        this.toastrServ.error(err.message);
        this.router.navigate(['/home']);
      })
      

  }
}
