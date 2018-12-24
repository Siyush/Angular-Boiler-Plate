import { ToastrService } from './../../services/toastr.service';
import { Router } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product , Category } from '../../models/Interfaces';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit,OnDestroy {
  products:Product[];
  categories:Category[];
  productForm:FormGroup;
  categoryForm:FormGroup;
  prodSub:Subscription;
  catSub:Subscription;
  stock:string;
  productId:string;
  productQuantity:number;
  isLoading:boolean = true;

  constructor(
    private frmBuilder: FormBuilder,
    public productServ:ProductService,
    public router:Router,
    public toastrServ:ToastrService
    ) { }

  ngOnDestroy() {
    this.prodSub.unsubscribe();
    this.catSub.unsubscribe();
  }
  
  ngOnInit() {
    // this.ngOnDestroy();
    this.productForm =  this.frmBuilder.group({
      productName: ['', Validators.required],
      category: [''],
      unitType: ['',Validators.required],
      stockQuantity: [ ,Validators.required],
      orderNo: [''],
      isExisting: false
  });
  this.prodSub = this.productServ.getProducts().subscribe(products => { this.products = products});
  this.catSub = this.productServ.getCategories().subscribe(categories => { this.categories = categories;this.isLoading = false;});
  const invoiceProductsChanges$ = this.productForm.controls['productName'].valueChanges;
  // subscribe to the stream so listen to changes on products
  invoiceProductsChanges$.subscribe(product => this.productChange());

  const invoiceProductStChanges$ = this.productForm.controls['isExisting'].valueChanges;
  // subscribe to the stream so listen to changes on products
  invoiceProductStChanges$.subscribe(product => this.statusChange());


  this.categoryForm =  this.frmBuilder.group({
    categoryName: ['',Validators.required],
  });
  }

productChange(){
  if(this.productForm.controls['isExisting'].value){
    let productName = this.productForm.controls['productName'].value;
    for(let i = 0; i< this.products.length; i++){
      if(productName == this.products[i].productName){
        this.productForm.controls['category'].patchValue(this.products[i].category);
        this.productForm.controls['unitType'].patchValue(this.products[i].unitType);
        this.productId = this.products[i].id;
        this.productQuantity = this.products[i].stockQuantity; 
        this.stock = this.products[i].stockQuantity +' '+ this.products[i].unitType;
      }
    }
  }
}

statusChange(){
  if(!this.productForm.controls['isExisting'].value){
        this.productForm.controls['category'].patchValue('');
        this.productForm.controls['unitType'].patchValue('');
  }else{
    this.productChange();
  }
}

  // -------------------------------Submission Part---------------------------------------
  // After All Process Form Gets Submitted Here
  onSubmit(product:Product){
    if(!this.productForm.controls['isExisting'].value){
      product.createdAt = Date.now();
      let id = this.productServ.addProduct(product);
      // alert(id);
      this.productServ.addBuyProduct(product);
      this.toastrServ.success(`Product Added Successfully...`);
      this.ngOnDestroy();
      
    }else{
      product.id = this.productId;
      let tempQuantity = product.stockQuantity;
      product.createdAt = Date.now();
      product.stockQuantity += this.productQuantity;
      this.productServ.updateProduct(product);
      product.stockQuantity = tempQuantity;
      this.productServ.addBuyProduct(product);
      this.toastrServ.info(`Product Updated Successfully...`);
      this.ngOnDestroy();
      this.router.navigate([`/main/product-details/${product.id}`]);
    }
  }


  onCategorySubmit(category:Category){
      this.productServ.addCategory(category);
      this.toastrServ.success(`Category Added Successfully...`);
  }

}
