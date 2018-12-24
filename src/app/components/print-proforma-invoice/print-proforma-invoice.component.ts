import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from './../../services/invoice.service';
import { Subscription } from 'rxjs';
import { Invoice } from './../../models/Interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-proforma-invoice',
  templateUrl: './print-proforma-invoice.component.html',
  styleUrls: ['./print-proforma-invoice.component.css']
})
export class PrintProformaInvoiceComponent implements OnInit {
  id:string;
  invoice:Invoice;
  perInSub:Subscription;
  isLoading:boolean = true;
  emptyRows:any= [];

  constructor(public invoiceServ:InvoiceService,
    public router:Router,
    public route:ActivatedRoute
    ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.perInSub = this.invoiceServ.getPInvoice(this.id)
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
