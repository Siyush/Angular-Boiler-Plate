import { PaymentService } from './payment.service';
import { InvoiceService } from './invoice.service';
import { Invoice, Payment } from './../models/Interfaces';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  invoiceSub:Subscription;
invoices:Invoice[];
payments:Payment[];
paySub:Subscription;

  constructor(
    public invoiceServ:InvoiceService,
    public paymentServ:PaymentService
    ) { }

    getInvoices(){
      this.invoiceSub = this.invoiceServ.getInvoices().subscribe(invoices => { this.invoices = invoices});
      return this.invoices;
    }

    getPayments(){
      this.paySub = this.paymentServ.getPayments().subscribe(payments => { this.payments = payments});
      return this.payments;
    }

    getTotalSale(){
        let invoices = this.getInvoices();
        let totalSale = 0;
        for(let i = 0; i < invoices.length; i++){
          totalSale += invoices[i].billTotal;
        }
        return totalSale;
    }

    getAmountReceived(){
      let payments = this.getPayments();
      let amountReceived = 0;
      for(let i = 0; i < payments.length; i++){
        amountReceived += payments[i].amountReceived;
      }
      return amountReceived;
    }
}
