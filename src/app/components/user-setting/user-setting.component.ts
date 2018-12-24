import { ToastrService } from './../../services/toastr.service';
import { TaxService } from './../../services/tax.service';
import { Tax } from './../../models/Interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit,OnDestroy{
  taxesForm:FormGroup;
  taxes:Tax[];
  ataxes:Tax[];

  subscription:Subscription;
  subscription1:Subscription;

  constructor(
    private frmBuilder: FormBuilder,
    public taxServ:TaxService,
    public toastrServ:ToastrService
    ) { }

  ngOnInit() {
    
    this.taxesForm =  this.frmBuilder.group({
      taxName: ['', Validators.required],
      taxRate: [ ,Validators.required],
      isActive: false
    });
    this.subscription = this.taxServ.getAllTaxes().subscribe(taxes => {
      this.taxes = taxes;
    });
    
    this.subscription1 = this.taxServ.getActiveTaxes().subscribe(taxes => {
      this.ataxes = taxes;
    });
  }
  ngOnDestroy() {  
    this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
  }
  
deleteTax(event,tax:Tax){
  this.taxServ.deleteTax(tax);
  this.toastrServ.error(`Tax Removed Successfully`);
}
  
  // -------------------------------Submission Part---------------------------------------
  // After All Process Form Gets Submitted Here
  onSubmit(tax:Tax){
      this.taxServ.addTax(tax);
      tax.taxName = '';
      tax.taxRate = null;
      this.toastrServ.success(`Tax Added Successfully`);
  }

  updateTax(event,tax:Tax){
    tax.updatedAt = Date.now();
    this.taxServ.updateTax(tax);
    this.toastrServ.info(`Tax Status Updated Successfully`);
  }

}
