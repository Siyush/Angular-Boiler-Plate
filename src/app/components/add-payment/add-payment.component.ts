import { Router } from '@angular/router';
import { ToastrService } from './../../services/toastr.service';
import { CustomerService } from './../../services/customer.service';
import { PaymentService } from './../../services/payment.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Payment, Customer } from './../../models/Interfaces';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit,OnDestroy {
  paymentForm:FormGroup;
  custSub:Subscription;
  customers:Customer[];
  isLoading:boolean = true;

  constructor(
    private frmBuilder: FormBuilder,
    public paymentServ:PaymentService,
    public customerServ:CustomerService,
    public toastrServ:ToastrService,
    public router:Router
    ) { }

    ngOnDestroy(){
      this.custSub.unsubscribe();
    }
  ngOnInit() {
    this.paymentForm =  this.frmBuilder.group({
      customerName: ['', Validators.required],
      customerId:[''],
      paymentType: ['',Validators.required],
      amountReceived: [ ,Validators.required],
      paymentDate: [ ,Validators.required],
      paymentDetails: ['']
  });
  this.custSub = this.customerServ.getAllCustomers().subscribe(customers => { this.customers = customers;this.isLoading = false;});
    // initialize stream on products
    const customerChanges$ = this.paymentForm.controls['customerName'].valueChanges;
    // subscribe to the stream so listen to changes on products
    customerChanges$.subscribe(customer => this.customerChange());
    
  this.paymentServ.getPayments();
  this.paymentForm.controls['paymentDate'].patchValue(Date.now());
  }

  customerChange(){
    let customerName = this.paymentForm.controls['customerName'].value;;
    
    for(let i = 0; i < this.customers.length; i++){
      if(customerName === this.customers[i].customerName){
       this.paymentForm.controls['customerId'].patchValue(this.customers[i].id);
      }
    }
  }
  // -------------------------------Submission Part---------------------------------------
  // After All Process Form Gets Submitted Here
  onSubmit(payment:Payment){
    payment.createdAt = Date.now();
    this.paymentServ.addPayment(payment);
    this.toastrServ.success(`Payment Added Successfully...`);
    // this.router.navigate(['/main/payment-list']);
  }

}
