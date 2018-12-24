import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from './../../services/invoice.service';
import { Subscription } from 'rxjs';
import { Invoice } from './../../models/Interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.css']
})
export class PrintInvoiceComponent implements OnInit {
  id:string;
  invoice:Invoice;
  invoiceSub:Subscription;
  isLoading:boolean = true;
  emptyRows:any = [];
  
  constructor(
    public invoiceServ:InvoiceService,
    public router:Router,
    public route:ActivatedRoute
    ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.invoiceSub = this.invoiceServ.getInvoice(this.id)
    .subscribe(data => {
       this.invoice = data;
       this.isLoading = false;
       this.getEmptyRows(data.products);
       setTimeout(()=>{window.print();},500);
      });
  }

  getEmptyRows(products:any){
    let rows:number = 12 - products.length;
    for(let i = 0; i<rows ;i++){
      this.emptyRows.push('');
    }
  }

}
