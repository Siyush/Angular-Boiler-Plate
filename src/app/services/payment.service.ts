import { Payment } from './../models/Interfaces';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  payment:Observable<Payment>;
  payments:Observable<Payment[]>;
  paymentsCollection:AngularFirestoreCollection<Payment>;

  custPayments:Observable<Payment[]>;
  custPaymentsCollection:AngularFirestoreCollection<Payment>;

  latPayments:Observable<Payment[]>;
  latPaymentsCollection:AngularFirestoreCollection<Payment>;

  paymentDoc:AngularFirestoreDocument<Payment>;
  constructor(
    public afs:AngularFirestore,
    public router:Router
  ) { 
     // ------------------------------All payments Collection-------------------------------
     this.paymentsCollection = this.afs.collection('payments');
    
     this.payments = this.paymentsCollection.snapshotChanges().pipe(
       map(actions => actions.map(a => {
       const data = a.payload.doc.data() as Payment;
       const id = a.payload.doc.id;
       return { id, ...data };
     })));

     // ------------------------------All payments Collection-------------------------------
     this.latPaymentsCollection = this.afs.collection('payments',ref=>ref.orderBy('createdAt','desc').limit(10));
    
     this.latPayments = this.latPaymentsCollection.snapshotChanges().pipe(
       map(actions => actions.map(a => {
       const data = a.payload.doc.data() as Payment;
       const id = a.payload.doc.id;
       return { id, ...data };
     })));
  }


  getPayments(){
    return this.payments;
  }
  getLatPayments(){
    return this.latPayments;
  }

  addPayment(payment:Payment){
    this.paymentsCollection.add(payment)
    .then(() =>{
      this.router.navigate(['/main']);
    });
  }

  addInPayment(payment:Payment){
    this.paymentsCollection.add(payment);
  }
  
  getCustomerPayment(id:string){
    this.custPaymentsCollection = this.afs.collection('payments',ref=>ref.where('customerId','==',id));
      this.custPayments = this.custPaymentsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Payment;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
      return this.custPayments;
  }
}
