import { Subscription } from 'rxjs';
import { Invoice } from './../../models/Interfaces';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
declare var $;

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  @ViewChild('dataTable') table;
  dataTable: any;

  invoices: Invoice[];
  invoiceSub: Subscription;
  isLoading: boolean = true;

  constructor(public invoiceServ: InvoiceService) {}

  ngOnInit() {
    this.dataTable = $(this.table.nativeElement);
    this.invoiceSub = this.invoiceServ.getInvoices().subscribe(invoices => {
      this.invoices = invoices;
      this.isLoading = false;
      setTimeout(() => {
        this.dataTables();
      }, 500);
    });
  }

  ngOnDestroy(): void {
    this.invoiceSub.unsubscribe();
  }
  dataTables() {
    this.dataTable.DataTable({
      pagingType: 'full_numbers',
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
      responsive: !0,
      language: { search: '_INPUT_', searchPlaceholder: 'Search records' }
    });
  }
}
