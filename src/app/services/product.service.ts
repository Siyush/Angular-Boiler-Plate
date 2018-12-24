import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Product, Category } from '../models/Interfaces';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ProductService { 
  // ----------------------All Products-------------------------
  productsCollection:AngularFirestoreCollection<Product>;
  products:Observable<Product[]>;

  productDoc:AngularFirestoreDocument<Product>;
  product:Observable<Product>;
  // ---------------Sold Products--------------------------------
  soldProductsCollection:AngularFirestoreCollection<Product>;
  soldProductsIdCollection:AngularFirestoreCollection<Product>;
  soldProducts:Observable<Product[]>;
  soldProductsId:Observable<Product[]>;

  soldProductDoc:AngularFirestoreDocument<Product>;
  soldProduct:Observable<Product>;
  // ---------------- Bought Products------------------------------
  buyProductsCollection:AngularFirestoreCollection<Product>;
  buyProductsIdCollection:AngularFirestoreCollection<Product>;
  buyProducts:Observable<Product[]>;
  buyProductsId:Observable<Product[]>;

  buyProductDoc:AngularFirestoreDocument<Product>;
  buyProduct:Observable<Product>;
  // ----------------- Categories Collection------------------------

  categoriesCollection:AngularFirestoreCollection<Category>;
  categories:Observable<Category[]>;

  categoryDoc:AngularFirestoreDocument<Category>;
  category:Observable<Category>;
  // products:Product[];
  // categories:Category[];

  constructor(
    public afs:AngularFirestore,
    public router:Router
  ) { 
    // ----------------------------------- All Products Collection------------------------------
    this.productsCollection = this.afs.collection('products',ref=>ref.orderBy('createdAt','desc'));
    
    this.products = this.productsCollection.auditTrail().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Product;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));

    // ----------------------------------- All Sold Products Collection------------------------------
    this.soldProductsCollection = this.afs.collection('soldProducts',ref=>ref.orderBy('createdAt','desc'));
    
    this.soldProducts = this.soldProductsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Product;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));

    // ----------------------------------- All Bought Products Collection------------------------------
    this.buyProductsCollection = this.afs.collection('buyProducts',ref=>ref.orderBy('createdAt','desc'));
    
    this.buyProducts = this.buyProductsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Product;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));

    // ----------------------------------- All Categories Collection------------------------------
    this.categoriesCollection = this.afs.collection('categories');

    this.categories = this.categoriesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Category;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));
  }

  // -------------------------------Get All Products------------------
  getProducts(){
    return this.products; 
  }
  // -------------------------------Get All Sold Products------------------
  getSoldProducts(product:Product){
    this.soldProductsIdCollection = this.afs.collection('soldProducts',ref=>ref.where('productName','==',product.productName));

    this.soldProductsId = this.soldProductsIdCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Product;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));

    return this.soldProductsId; 
  }
  // -------------------------------Get All Buy Products------------------
  getBuyProducts(product:Product){
    this.buyProductsIdCollection = this.afs.collection('buyProducts',ref=>ref.where('productName','==',product.productName));

    this.buyProductsId = this.buyProductsIdCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Product;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));
    
    return this.buyProductsId; 
  }
  // ------------------------------ Add New Product--------------------
  addProduct(product:Product){
    this.productsCollection.add(product)
    .then((docRef)=>
    { this.router.navigate([`/main/product-details/${docRef.id}`]);}
    );
  }
  // ------------------------------ Add New Product--------------------
  addSoldProduct(product:Product){
    this.soldProductsCollection.add(product);
  }
  // ------------------------------ Add New Product--------------------
  addBuyProduct(product:Product){
    this.buyProductsCollection.add(product);
  }
  // --------------------------------Update Existing Product----------------------------------
  updateProduct(product:Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    this.productDoc.update(product);
  }
// --------------------------------- Get Specific Product--------------
  getProduct(id:String){
    // console.log(`products/${id}`);
    this.productDoc = this.afs.doc(`products/${id}`);
    this.product = this.productDoc.valueChanges();
    return this.product;
  }
  
  getCategories(){
    return this.categories; 
  }
  // Add Questions to Local
  addCategory(category:Category){
    this.categoriesCollection.add(category);
  }
}
