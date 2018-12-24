import { ToastrService } from './../../services/toastr.service';
import { InvoiceService } from './../../services/invoice.service';
import { Subscription } from 'rxjs';
import { TaxService } from './../../services/tax.service';
import { CustomerService } from './../../services/customer.service';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Invoice, Customer, Product, Tax, InDetail } from '../../models/Interfaces';
import { Router } from '@angular/router';



@Component({
    selector: 'app-add-performa-invoice',
    templateUrl: './add-performa-invoice.component.html',
    styleUrls: ['./add-performa-invoice.component.css']
})
export class AddPerformaInvoiceComponent implements OnInit {
  taxSub:Subscription;
  indetailSub:Subscription;
  prodSub:Subscription;
  custSub:Subscription;
  invoiceSub:Subscription;
    // ------------------------------------Declaration Part------------------------------------
    invoices:Invoice[];
   inDetails:InDetail;
   inDetail:InDetail = {
     invoiceNo:null,
     proformaNo:null
   };

   isLoading:boolean = true;
    // Form Variables
    date: number;
    dueDate: number;
    products: Product[];
    customers: Customer[];
    taxes: Tax[];
    // Declaring required variables
    subTotal: number = 0;
    discount: number = 0;
    totalTaxAmount: number;
    billTotal: number = 0;
    billingTotal: number = 0
    partialPayAmount: number = 0;
    partialPayment: number = 0;
    dueAmount: number = 0;
    isInvoiceNo:boolean = false;
    invoiceForm: FormGroup;

    constructor(
        private frmBuilder: FormBuilder,
        public productServ: ProductService,
        public customerServ: CustomerService,
        public taxServ: TaxService,
        public invoiceServ:InvoiceService,
        public router:Router,
        public toastrServ:ToastrService
    ) {}

    ngOnDestroy() {
      this.taxSub.unsubscribe();
      this.indetailSub.unsubscribe();
      this.prodSub.unsubscribe();
      this.custSub.unsubscribe();
      this.invoiceSub.unsubscribe();
    }

    ngOnInit() {
        // ------------------------------Initialization & Validation Part----------------------------------
        // Initializing variables & Applying Required Validations
        this.invoiceForm = this.frmBuilder.group({
            invoiceDate: [, Validators.required],
            dueDate: [, Validators.required],
            invoiceNo: [, Validators.required],
            pOrderNo: [''],
            partialPayment: [],
            // Customer Form-Group Here
            customer: this.frmBuilder.group({
                customerName: ['', Validators.required],
                address: this.frmBuilder.group({
                    addLine1: [''],
                    addLine2: [''],
                    pin: []
                }),
                email: [''],
                phone: [],
                gstn: [''],
                pan: ['']
            }),
            // Products Row Form-Group Here
            products: this.frmBuilder.array([this.initProductRow()]),
            subTotal: [0, Validators.required],
            discount: [],
            discountType: [''],
            isDiscountApplied: false,
            // Taxes Form-Group Here
            taxes: this.frmBuilder.array([]),
            billTotal: [, Validators.required],
            dueAmount: [, Validators.required],
            created_at: [, Validators.required]
        });

        // ----------------------------------Getting Required Things From Services Here----------  
        
        this.invoiceSub = this.invoiceServ.getPInvoices().subscribe(invoices => { this.invoices = invoices});
        this.custSub = this.customerServ.getAllCustomers().subscribe(customers => { this.customers = customers});
        this.taxSub = this.taxServ.getActiveTaxes().subscribe(taxes => { this.taxes = taxes; });
        this.indetailSub = this.taxServ.getInvoiceDetail().subscribe(details => {this.inDetails = details;this.getInitialValues(); this.isLoading = false;}); 
        this.prodSub = this.productServ.getProducts().subscribe(products => { this.products = products});
        // -------------------------------------------Initialization of Variables Ends Here--------------------------

        // initialize stream on products
        const invoiceCustomerChanges$ = this.invoiceForm.controls['customer'].valueChanges;
        // subscribe to the stream so listen to changes on products
        invoiceCustomerChanges$.subscribe(customer => this.customerChange(customer));
        // initialize stream on products
        const invoiceProductsChanges$ = this.invoiceForm.controls['products'].valueChanges;
        // subscribe to the stream so listen to changes on products
        invoiceProductsChanges$.subscribe(products => this.rateChange(products));
        // initialize stream on products
        const invoiceTaxesChanges$ = this.invoiceForm.controls['taxes'].valueChanges;
        // subscribe to the stream so listen to changes on products
        invoiceTaxesChanges$.subscribe(taxes => this.taxesChange(taxes));
        // initialize stream on discount type
        const invoiceDiscountTypeChanges$ = this.invoiceForm.controls['discountType'].valueChanges;
        // subscribe to the stream so listen to changes on discount type
        invoiceDiscountTypeChanges$.subscribe(discountType => this.discountTypeChange(discountType));
        // initialize stream on products
        const invoicePartialPayChanges$ = this.invoiceForm.controls['partialPayment'].valueChanges;
        // subscribe to the stream so listen to changes on products
        invoicePartialPayChanges$.subscribe(partialPayment => this.partialPayChange(partialPayment));
        // initialize stream on products
        const invoiceDiscountValueChanges$ = this.invoiceForm.controls['discount'].valueChanges;
        // subscribe to the stream so listen to changes on products
        invoiceDiscountValueChanges$.subscribe(discount => this.discountValueChange(discount));
        // initialize stream on products
        const invoiceDiscountChanges$ = this.invoiceForm.controls['isDiscountApplied'].valueChanges;
        // subscribe to the stream so listen to changes on products
        invoiceDiscountChanges$.subscribe(discount => this.discountChange());


    }
    // -------------------------------Partial Initalization----------------------------------------
    // New Product Row Get Initialized By This Function
    getInitialValues() {
      this.invoiceForm.controls['invoiceDate'].patchValue(Date.now());
      this.invoiceForm.controls['dueDate'].patchValue(Date.now() + (60 * 60 * 24 * 7 * 1000));
      this.invoiceForm.controls['invoiceNo'].patchValue(101);
      this.invoiceForm.controls['created_at'].patchValue(Date.now());
      this.date = Date.now();
      this.dueDate = Date.now() + (60 * 60 * 24 * 7 * 1000);
      this.initTaxRow();
      this.invoiceForm.controls['invoiceNo'].patchValue((this.inDetails.proformaNo) + 1);
      this.isInvoiceNo = true;
    }

    initProductRow() {
        return this.frmBuilder.group({
          productName: ['', Validators.required],
          category: [''],
          unitType: ['', Validators.required],
          hsn: [''],
          quantity: [ , Validators.required],
          rate: [ ,Validators.required]
        })
    }

    initTaxRow() {
        const control = <FormArray>this.invoiceForm.controls['taxes'];
    for(let i = 0; i < this.taxes.length;i++){
      control.push(this.newTaxRow(this.taxes[i]));
    }
  }
  
  newTaxRow(nTax:any){
    return this.frmBuilder.group({
      taxName:nTax.taxName,
      taxRate:nTax.taxRate,
      isApplied:nTax.isApplied,
      taxAmount:nTax.taxAmount
    });
  }
   // New Product Row Get Added By This Function
   addProductRow(){
    const control = <FormArray>this.invoiceForm.controls['products'];
    control.push(this.initProductRow());
  }
  removeProductRow(i:number){
    const control = <FormArray>this.invoiceForm.controls['products'];
    control.removeAt(i);
  }
  getFinalDetails(){
    this.invoiceForm.controls['billTotal'].patchValue(this.billingTotal);
    this.invoiceForm.controls['dueAmount'].patchValue(this.dueAmount);
  }
  // -------------------------------Processor Part---------------------------------------
  rateChange(products:any){
    let subTotal = 0;
    for(let i in products){
      let rate = products[i].rate;
      let quantity = products[i].quantity;
      let lineSubTotal = rate * quantity;
      subTotal += lineSubTotal; 
    }
    this.subTotal = subTotal;
    this.billTotal = subTotal;
    this.billingTotal = this.billTotal + this.totalTaxAmount;
    this.invoiceForm.controls['subTotal'].patchValue(subTotal);
    let discountType:number = this.invoiceForm.controls['discountType'].value;
    this.discountTypeChange(discountType);
    this.getFinalDetails();
  }

  discountTypeChange(discountType:any){
    let discountValue:number = this.invoiceForm.controls['discount'].value;
    let discountApplied:boolean = this.invoiceForm.controls['isDiscountApplied'].value;
    let partialPayment:number = this.invoiceForm.controls['partialPayment'].value;
    let taxes:any = this.invoiceForm.controls['taxes'].value;
    let discountAmount:number;
    if(discountApplied === true){
      if(discountType == 'Percent'){
        discountAmount = this.subTotal * discountValue / 100;
        this.discount = discountAmount;
        this.partialPayAmount = this.subTotal - discountAmount;
        this.billTotal = this.partialPayAmount;
        this.billingTotal = this.billTotal + this.totalTaxAmount;
     }
     if(discountType == 'Amount'){
       discountAmount = discountValue;
       this.discount = discountAmount;
       this.partialPayAmount = this.subTotal - discountAmount;
       this.billTotal = this.partialPayAmount;
       this.billingTotal = this.billTotal + this.totalTaxAmount;
    }
    this.partialPayChange(partialPayment);
    this.taxesChange(taxes);
    }else{
      this.discount = 0;
      this.partialPayAmount = this.subTotal;
      this.billTotal = this.subTotal;
      this.billingTotal = this.billTotal + this.totalTaxAmount;
      this.partialPayChange(partialPayment);
      this.taxesChange(taxes);
    }
  //  this.invoiceForm.controls['subTotal'].patchValue(subTotal);
  this.getFinalDetails();
  }
  discountValueChange(discount:number){
    let discountType:number = this.invoiceForm.controls['discountType'].value;
    this.discountTypeChange(discountType);
    this.getFinalDetails();
  }
  discountChange(){
    let discountValue:number = this.invoiceForm.controls['discount'].value;
    this.discountValueChange(discountValue);
    this.getFinalDetails();
  }

  partialPayChange(partialPayment:number){
    this.billingTotal = this.billTotal + this.totalTaxAmount;
    this.dueAmount = this.billingTotal - partialPayment;
    this.getFinalDetails();
  }

  taxesChange(taxes:any){
    let localTaxAmount:number = 0;
    for(let i in taxes){
      let rate = taxes[i].taxRate;
      if(taxes[i].isApplied){
        let lineTaxAmount = this.partialPayAmount * rate / 100;
        taxes[i].taxAmount = lineTaxAmount;
        localTaxAmount += lineTaxAmount;
        this.totalTaxAmount = localTaxAmount;
      }else{
        this.totalTaxAmount = 0;
        this.totalTaxAmount +=localTaxAmount;
      }
    }
    let partialPayment:number = this.invoiceForm.controls['partialPayment'].value;
    this.partialPayChange(partialPayment);
    this.getFinalDetails();
  }
  // ------------------Customer Change---------------------------------------
  customerChange(customer:any){
    let customerName = customer.customerName;
    for(let i = 0; i < this.customers.length; i++ ){
      if(this.customers[i].customerName === customerName){
        this.invoiceForm.patchValue({customer:{address:{addLine1: this.customers[i].address.addLine1 }}});
        this.invoiceForm.patchValue({customer:{address:{addLine2: this.customers[i].address.addLine2 }}});
        this.invoiceForm.patchValue({customer:{address:{pin: this.customers[i].address.pin }}});
        this.invoiceForm.patchValue({customer:{email: this.customers[i].email}});
        this.invoiceForm.patchValue({customer:{phone: this.customers[i].phone}});
        this.invoiceForm.patchValue({customer:{gstn: this.customers[i].gstn}});
        this.invoiceForm.patchValue({customer:{pan: this.customers[i].pan}});        
      }
    }
  }

  // -----------------------Service Functionality Part------------------------------------
  

  // -------------------------------Submission Part---------------------------------------
  // After All Process Form Gets Submitted Here
  onSubmit(invoice:Invoice){
    this.inDetail.invoiceNo = this.inDetails.invoiceNo;
    this.inDetail.proformaNo = this.inDetails.proformaNo + 1;


    if(invoice.customer.customerName !== ''){
      let products = invoice.products;
      let count:number = 0;
      for(let i = 0 ; i< products.length;i++){
          if(products[i].productName !== '' && products[i].rate !== null && products[i].quantity !== null){
            count++;
          }
      }
      if(count === products.length){
        this.taxServ.updateInvoiceDetails(this.inDetail);
        this.invoiceServ.addPInvoice(invoice);
        this.toastrServ.success(`Proforma-Invoice Added Succefully`);
        // this.router.navigate(['/main/performa-invoices']);
      }else{
        this.toastrServ.error(`One Or More Product Property is Empty`);
      }
    }else{
    this.toastrServ.error(`Customer Name Can't Be Empty`);
  }
  }
}