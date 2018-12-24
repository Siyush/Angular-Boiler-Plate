import { Subscription } from 'rxjs';
import { InvoiceService } from './../../services/invoice.service';
import { Invoice } from './../../models/Interfaces';
import { Component, OnInit, OnDestroy , ViewChild, ElementRef  } from '@angular/core';
declare var $;


@Component({
  selector: 'app-performa-invoices',
  templateUrl: './performa-invoices.component.html',
  styleUrls: ['./performa-invoices.component.css']
})
export class PerformaInvoicesComponent implements OnInit, OnDestroy {
  @ViewChild('dataTable') table;
  dataTable:any;

  performaInvoices:Invoice[];
  performaInvoiceSub:Subscription
  isLoading:boolean = true;
  constructor(public invoiceServ:InvoiceService) { 

  }

  ngOnInit() {

    
    this.dataTable = $(this.table.nativeElement);

    this.performaInvoiceSub = this.invoiceServ.getPInvoices().subscribe(invoices => { this.performaInvoices = invoices; this.isLoading = false;setTimeout(()=>{ this.dataTables();},500);});
  }

  ngOnDestroy(): void {
    this.performaInvoiceSub.unsubscribe();  
  }
  
  dataTables(){
    this.dataTable.DataTable({
      pagingType: "full_numbers",
      lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"]
      ],
      responsive: !0,
      language: { search: "_INPUT_", searchPlaceholder: "Search records" }
  });
}
}
