import { ProductService } from './../../services/product.service';
import { Product } from './../../models/Interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription,Observable } from 'rxjs';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit,OnDestroy {
  id:string;
  prodSub:Subscription;
  bProdSub:Subscription;
  sProdSub:Subscription;
  bProducts:Product[];
  sProducts:Product[];
  product:Product;
  isLoading:boolean = true;

  constructor(public productServ:ProductService,
    public router:Router,
    public route:ActivatedRoute) { }

    ngOnDestroy(){
      this.bProdSub.unsubscribe();
      this.sProdSub.unsubscribe();
      this.prodSub.unsubscribe();
    }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.prodSub = this.productServ.getProduct(this.id).subscribe(data => { this.product = data; this.getDetails();});

    
  }

  getDetails(){
    this.bProdSub = this.productServ.getBuyProducts(this.product).subscribe(data => {this.bProducts = data;})
    this.sProdSub = this.productServ.getSoldProducts(this.product).subscribe(data => {this.sProducts = data; this.isLoading = false;})
  }
}
