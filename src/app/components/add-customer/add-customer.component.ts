import { ToastrService } from './../../services/toastr.service';
import { CustomerService } from './../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  Customer } from '../../models/Interfaces';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  customerForm: FormGroup;
  isLoading:boolean = true;
  customers:Customer[];
  constructor(
    private frmBuilder: FormBuilder,
    public customerServ: CustomerService,
    public toastrServ:ToastrService,
    public router:Router,
    ) { }

  ngOnInit() {
    this.customerForm =  this.frmBuilder.group({
          customerName: ['', Validators.required],
          address: this.frmBuilder.group({
              addLine1: ['',Validators.required],
              addLine2: [''],
              pin: [ ,Validators.required]
          }),
          email: [''],
          phone: [],
          gstn: [''],
          pan: ['']
      });
      this.isLoading = false; 
  }


  // -------------------------------Submission Part---------------------------------------
  // After All Process Form Gets Submitted Here
  onSubmit(customer:Customer){
    customer.createdAt = Date.now();
    this.customerServ.addCustomer(customer);
    this.toastrServ.success(`Customer Added Successfully...`);
  }
}
