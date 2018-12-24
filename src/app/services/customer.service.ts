import { Router } from '@angular/router';
import { Customer } from './../models/Interfaces';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customer:Observable<Customer>;
  customers:Observable<Customer[]>;
  customersCollection:AngularFirestoreCollection<Customer>;
  customerDoc:AngularFirestoreDocument<Customer>;


  constructor(
    public afs:AngularFirestore,
    public router:Router
    ) { 
      // ------------------------------All customers Collection-------------------------------
    this.customersCollection = this.afs.collection('customers');
    
    this.customers = this.customersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Customer;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));   
  }

  // -------------------------------Get All Available customers -----------------------------
  getAllCustomers(){    
    return this.customers;
  }
// -------------------------------------Add New Tax-------------------------------------
  addCustomer(customer:Customer){
    this.customersCollection.add(customer)
    .then((docRef) => {
      this.router.navigate([`/main/customer-details/${docRef.id}`]);
    });
  }
  // --------------------------------- Get Specific Product--------------
  getCustomer(id:String){
    this.customerDoc = this.afs.doc(`customers/${id}`);
    this.customer = this.customerDoc.valueChanges();
    return this.customer;
  }
// --------------------------------Update Existing Tax----------------------------------
  updateCustomer(customer:Customer){
    this.customerDoc = this.afs.doc(`customers/${customer.id}`);
    this.customerDoc.update(customer);
  }
}
