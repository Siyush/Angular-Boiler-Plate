import { ProductService } from './../../services/product.service';
import { Product } from './../../models/Interfaces';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
declare var $;


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('dataTable') table;
  dataTable:any;
  prodSub:Subscription;
  products:Product[];
  isLoading:boolean = true;
  constructor(public productServ:ProductService) { }

  ngOnDestroy(){
    this.prodSub.unsubscribe();
  }
  ngOnInit() {
    // this.prodSub.unsubscribe();
    this.dataTable = $(this.table.nativeElement);
    this.prodSub = this.productServ.getProducts().subscribe(products => { this.products = products; this.isLoading = false;setTimeout(()=>{ this.dataTables();},1000);});
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
