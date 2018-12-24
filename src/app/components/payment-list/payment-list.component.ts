import { PaymentService } from './../../services/payment.service';
import { Payment } from './../../models/Interfaces';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
declare var $;


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit,OnDestroy {
  @ViewChild('dataTable') table;
  dataTable:any;

  paySub:Subscription;
  payments:Payment[];
  isLoading:boolean = true;
  constructor(public paymentServ:PaymentService) { }

  ngOnInit() {
    
    this.dataTable = $(this.table.nativeElement);
    this.paySub = this.paymentServ.getPayments().subscribe(payments => { this.payments = payments; this.isLoading = false;setTimeout(()=>{ this.dataTables();},500);});
  }

  ngOnDestroy(){
    this.paySub.unsubscribe();
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
