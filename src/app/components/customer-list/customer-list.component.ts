import { Customer } from './../../models/Interfaces';
import { CustomerService } from './../../services/customer.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
declare var $;

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit,OnDestroy {
  @ViewChild('dataTable') table;
  dataTable:any;

  custSub:Subscription;
  customers:Customer[];
  isLoading:boolean = true;
  constructor(public customerServ:CustomerService) { }

  ngOnInit() {

    this.dataTable = $(this.table.nativeElement);

    this.custSub = this.customerServ.getAllCustomers().subscribe(customers => { this.customers = customers; this.isLoading = false;setTimeout(()=>{ this.dataTables();},500);}
      );
  }

  ngOnDestroy(){
    this.custSub.unsubscribe();
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
