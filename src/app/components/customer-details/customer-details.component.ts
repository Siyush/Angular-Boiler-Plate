import { PaymentService } from './../../services/payment.service';
import { InvoiceService } from './../../services/invoice.service';
import { CustomerService } from './../../services/customer.service';
import { Customer, Invoice, Payment } from './../../models/Interfaces';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  id:string;
  invoices:Invoice[];
  payments:Payment[];
  custSub:Subscription;
  customer:Customer;
  custInSub:Subscription;
  custPaySub:Subscription;
  totalSale:number;
  totalReceived:number;
  isLoading:boolean = true;

  constructor(
    public customerServ:CustomerService,
    public invoiceServ:InvoiceService,
    public payServ:PaymentService,
    public router:Router,
    public route:ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.custSub = this.customerServ.getCustomer(this.id).subscribe(customer => { this.customer = customer; this.getInvoices(this.id);this.getPayments(this.id);});
  }

  getInvoices(id:string){
    this.custInSub = this.invoiceServ.getCustomerInvoices(id).subscribe(invoices => { this.invoices = invoices;this.getTotalSale();});
  }

  getPayments(id:string){
    this.custPaySub = this.payServ.getCustomerPayment(id).subscribe(payments => { this.payments = payments;this.getTotalAmountReceived(); this.isLoading = false;});
  }

  getTotalSale(){
    let totalSale = 0;
    for(let i = 0; i < this.invoices.length; i++){
      totalSale += this.invoices[i].billTotal;
    }
    this.totalSale = totalSale;
    console.log(totalSale);
  }

  getTotalAmountReceived(){
    let totalReceived = 0;
    for(let i = 0; i < this.payments.length;i++){
      totalReceived += this.payments[i].amountReceived;
    }
    this.totalReceived = totalReceived;
    console.log(totalReceived);
  }
}
