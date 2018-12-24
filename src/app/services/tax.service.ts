import { Tax, InDetail } from './../models/Interfaces';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxService {


detailsCollection:AngularFirestoreCollection<InDetail>;
taxesCollection:AngularFirestoreCollection<Tax>;
activeTaxesCollection:AngularFirestoreCollection<Tax>;

taxes:Observable<Tax[]>;
activeTaxes:Observable<Tax[]>;
details:Observable<InDetail[]>;
detail:Observable<InDetail>

taxesDoc:AngularFirestoreDocument<Tax>;
detailDoc:AngularFirestoreDocument<InDetail>;


  constructor(
    public afs:AngularFirestore
    ) {
    // ------------------------------All Taxes Collection-------------------------------
    this.taxesCollection = this.afs.collection('taxes');
    
    this.taxes = this.taxesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Tax;
      const id = a.payload.doc.id;
      return { id, ...data };
    })));
    // ------------------------------Active Taxes Collection----------------------------
    this.activeTaxesCollection = this.afs.collection('taxes',ref => ref.where('isActive', '==', true));
    this.activeTaxes = this.activeTaxesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a =>{
          const data = a.payload.doc.data() as Tax;
          const id = a.payload.doc.id;
          return { id, ...data};
        })));
    // ------------------------------Details Collection----------------------------------
    this.detailsCollection = this.afs.collection('invoiceDetails');
    this.details = this.detailsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as InDetail;
        const id = a.payload.doc.id;
        return {id, ...data};
      })))

  }
// -------------------------------Get All Available Taxes -----------------------------
   getAllTaxes(){    
    return this.taxes;
  }
// -------------------------------Get Active Taxes--------------------------------------

  getActiveTaxes(){
    return this.activeTaxes;
  }
// -------------------------------------Add New Tax-------------------------------------
  addTax(tax:Tax){
    this.taxesCollection.add(tax);
  }
// --------------------------------Update Existing Tax----------------------------------
  updateTax(tax:Tax){
    this.taxesDoc = this.afs.doc(`taxes/${tax.id}`);
    this.taxesDoc.update(tax);
  }
// --------------------------------Delete Tax ------------------------------------------
  deleteTax(tax:Tax){
    this.taxesDoc = this.afs.doc(`taxes/${tax.id}`);
    this.taxesDoc.delete();
  }
// ---------------------------------Get Invoice Details --------------------------------
  getInvoiceDetails(){
    // console.log(this.details);
    return this.details;
  }

  getInvoiceDetail(){
    this.detailDoc = this.afs.doc(`invoiceDetails/blXwWLbZsthfPJgyC40s`);
    this.detail = this.detailDoc.valueChanges();
    return this.detail;
  }

  updateInvoiceDetails(inDetail:InDetail){
    this.detailDoc = this.afs.doc(`invoiceDetails/blXwWLbZsthfPJgyC40s`);
    this.detailDoc.update(inDetail);
  }
}
