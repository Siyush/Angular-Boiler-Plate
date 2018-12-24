import { Invoice, Payment } from './../../models/Interfaces';
import { Subscription } from 'rxjs';
import { InvoiceService } from './../../services/invoice.service';
import { PaymentService } from './../../services/payment.service';
import { ToastrService } from './../../services/toastr.service';

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  isLoading:boolean = true;
  invoiceSub:Subscription;
  paySub:Subscription;
  latPaySub:Subscription;
  latInSub:Subscription;
  latInvoices:Invoice[];
  invoices:Invoice[];
  payments:Payment[];
  latPayments:Payment[];
noOfInvoices:number = 0;
totalSale:number = 0;
amountReceived:number = 0;
amountPending:number = 0;

  constructor(
    public toastrServ:ToastrService,
    public invoiceServ:InvoiceService,
    public paymentServ: PaymentService
    ) { 
    
}

  ngOnInit() {
    this.invoiceSub = this.invoiceServ.getInvoices().subscribe(invoices => { this.invoices = invoices});
    this.latInSub = this.invoiceServ.getLInvoices().subscribe(invoices => { this.latInvoices = invoices});
    this.latPaySub = this.paymentServ.getLatPayments().subscribe(payments => { this.latPayments = payments});
    this.paySub = this.paymentServ.getPayments().subscribe(payments => { this.payments = payments;this.getData(); this.isLoading = false;});

  }

  ngOnDestroy() {
    this.invoiceSub.unsubscribe();
    this.paySub.unsubscribe();
    this.latInSub.unsubscribe();
    this.latPaySub.unsubscribe();
  }


  getTotalSale(){
      let invoices = this.invoices;
      let totalSale = 0;
      for(let i = 0; i < invoices.length; i++){
        totalSale += invoices[i].billTotal;
      }
      return totalSale;
  }

  getAmountReceived(){
    let payments = this.payments;
    let amountReceived = 0;
    for(let i = 0; i < payments.length; i++){
      amountReceived += payments[i].amountReceived;
    }
    return amountReceived;
  }
  
  getData(){
    this.noOfInvoices = this.invoices.length;
    this.totalSale = this.getTotalSale();
    this.amountReceived = this.getAmountReceived();
    this.amountPending =  this.totalSale - this.amountReceived;
  }
  }


