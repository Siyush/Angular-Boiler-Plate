// Category Interface
export interface Category{
    id?:string;
    categoryName?:string;   
}
// Address Interface
export interface Address{
    addLine1?:string;
    addLine2?:string;
    pin?:number;
}
// Customer Info Interface
export interface Customer{
    id?:string;
    customerName?:string;
    address?:Address;
    email?:string;
    phone?:number;
    gstn?:string;
    pan?:string;
    balanceOwed?:number;
    balanceRemained?:number;
    payments?:Payment[];
    createdAt:number;
}
//Product Interface
export interface Product{
    id?:string;
    invoiceNo?:number; //User Defined
    orderNo?:string;
    invoiceDate:number;
    orderDate:number;
    productName?:string;
    category?:string;
    subCategory?:string;
    description?:string;
    unitType?:string;
    hsn?:string;
    imgUrl?:string;
    quantity?:number;
    rate?:number;
    stockQuantity?:number;
    createdAt:number;
}
// Payment Interface
export interface Payment{
    id?:string;
    customerName?:string;
    customerId?:string;
    paymentDate?:Date;
    paymentType?:string;
    paymentDetails?:string;  
    amountReceived?:number;
    createdAt?:number;
}
// Tax Interface
export interface Tax{
    id?:string;
    taxName?:string;
    taxRate?:number;
    isApplied?:boolean;
    taxAmount?:number;
    isActive?:boolean;
    updatedAt?:number;
}
// Invoice Interface
export interface Invoice{
    id?:string;
    invoiceDate?:number;
    dueDate?:number;
    partialPayment?:number;
    invoiceNo?:number;
    pOrderNo?:string;
    customerId?:string;
    customer?:Customer;
    products?:Product[];
    subTotal?:number;
    discount?:number;
    discountType?:string;
    isDiscountApplied?:boolean;
    taxes?:Tax[];
    billTotal?:number;
    dueAmount?:number;
    created_at?:number; 
} 
export interface InDetail{
    id?:string;
    invoiceNo?:number;
    proformaNo?:number;
}