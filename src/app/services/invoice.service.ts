import { Invoice, Customer } from './../models/Interfaces';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

invoice:Observable<Invoice>;
invoices:Observable<Invoice[]>;
custInvoices:Observable<Invoice[]>;
latestInvoices:Observable<Invoice[]>;
invoicesCollection:AngularFirestoreCollection<Invoice>;
custInvoicesCollection:AngularFirestoreCollection<Invoice>;
invoiceDoc:AngularFirestoreDocument<Invoice>;

performaInvoice:Observable<Invoice>;
performaInvoices:Observable<Invoice[]>;
performaInvoicesCollection:AngularFirestoreCollection<Invoice>;
performaInvoiceDoc:AngularFirestoreDocument<Invoice>;

  constructor(
    public afs:AngularFirestore,
    public router:Router
  ) {
      // ------------------------------All invoices Collection-------------------------------
      this.invoicesCollection = this.afs.collection('invoices',ref=>ref.orderBy('created_at','desc'));

      this.invoices = this.invoicesCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Invoice;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
      // ------------------------------All invoices Collection-------------------------------
      this.performaInvoicesCollection = this.afs.collection('performaInvoices',ref=>ref.orderBy('created_at','desc'));

      this.performaInvoices = this.performaInvoicesCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Invoice;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
      
      // ------------------------------10 invoices Collection-------------------------------
      this.invoicesCollection = this.afs.collection('invoices',ref=>ref.orderBy('created_at','desc').limit(10));

      this.latestInvoices = this.invoicesCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Invoice;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
   }

  getInvoices(){
    return this.invoices;
  }
  
  getLInvoices(){
    return this.latestInvoices;
  }

  addInvoice(invoice:Invoice){
    this.invoicesCollection.add(invoice).then((docRef) => {
      this.router.navigate([`/main/invoice-details/${docRef.id}`]);
    });
  }

  addPInvoice(invoice:Invoice){
    this.performaInvoicesCollection.add(invoice)
    .then((docRef) => {
      this.router.navigate([`/main/performa-invoice-details/${docRef.id}`]);
    });
  }

  getInvoice(id:string){
    this.invoiceDoc = this.afs.doc(`invoices/${id}`);
    this.invoice = this.invoiceDoc.valueChanges();
    return this.invoice;
  }
  
  
  getPInvoices(){
    return this.performaInvoices;
  }

  getPInvoice(id:string){
    this.performaInvoiceDoc = this.afs.doc(`performaInvoices/${id}`);
    this.performaInvoice = this.performaInvoiceDoc.valueChanges();
    return this.performaInvoice;
  }

  getCustomerInvoices(id:string){
    this.custInvoicesCollection = this.afs.collection('invoices',ref=>ref.where('customerId','==',id));
      this.custInvoices = this.custInvoicesCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Invoice;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
      return this.custInvoices;
  }
  
}
