import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { InvoiceService } from './../../services/invoice.service';
import { Invoice } from './../../models/Interfaces';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-performa-invoice-details',
  templateUrl: './performa-invoice-details.component.html',
  styleUrls: ['./performa-invoice-details.component.css']
})
export class PerformaInvoiceDetailsComponent implements OnInit {
  id:string;
  performaInvoice:Invoice;
  perInSub:Subscription;
  isLoading:boolean = true;

  constructor(public invoiceServ:InvoiceService,
    public router:Router,
    public route:ActivatedRoute
    ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.perInSub = this.invoiceServ.getPInvoice(this.id).subscribe(data => { this.performaInvoice = data;this.isLoading = false;});
    // console.log(this.performaInvoice.invoiceNo);
  }

}
