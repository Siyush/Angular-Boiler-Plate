import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../models/Interfaces';
import { InvoiceService } from '../../services/invoice.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  id:string;
  invoice:Invoice;
  invoiceSub:Subscription;
  isLoading:boolean = true;
  
  constructor(
    public invoiceServ:InvoiceService,
    public router:Router,
    public route:ActivatedRoute
    ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.invoiceSub = this.invoiceServ.getInvoice(this.id).subscribe(data => { this.invoice = data;this.isLoading = false;});
  }

}
