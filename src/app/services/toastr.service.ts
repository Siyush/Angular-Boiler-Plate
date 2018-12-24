import { Injectable } from '@angular/core';
declare var toastr;

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor() { 
    
  }
  success(message?:string){
    toastr.success(message); 
  }

  error(message?:string){
    toastr.error(message); 
  }

  info(message?:string){
    toastr.info(message); 
  }
  
}
