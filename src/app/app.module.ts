import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { DashboardService } from './services/dashboard.service';
import { PaymentService } from './services/payment.service';
import { InvoiceService } from './services/invoice.service';
import { TaxService } from './services/tax.service';
import { CustomerService } from './services/customer.service';
import { ProductService } from './services/product.service';




import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Route, RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { AddInvoiceComponent } from './components/add-invoice/add-invoice.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { PerformaInvoicesComponent } from './components/performa-invoices/performa-invoices.component';
import { AddPerformaInvoiceComponent } from './components/add-performa-invoice/add-performa-invoice.component';
import { PerformaInvoiceDetailsComponent } from './components/performa-invoice-details/performa-invoice-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { PrintInvoiceComponent } from './components/print-invoice/print-invoice.component';
import { PrintComponent } from './components/print/print.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PrintProformaInvoiceComponent } from './components/print-proforma-invoice/print-proforma-invoice.component';






const routes:Route[] = [
  { path: '', redirectTo :'/home', pathMatch:'full'},
  { path: 'loading',component:LoadingComponent},
  { path:'home', component:HomeComponent},
  { path:'main', component:MainComponent, 
    children:[
      { path: '', redirectTo :'dashboard', pathMatch:'full'},
      { path:'dashboard', component:DashboardComponent },
      { path:'invoice-list', component:InvoiceListComponent },
      { path:'add-invoice', component:AddInvoiceComponent },
      { path:'invoice-details/:id', component:InvoiceDetailsComponent },
      { path:'performa-invoices', component: PerformaInvoicesComponent },
      { path:'add-performa-invoice', component: AddPerformaInvoiceComponent },
      { path:'performa-invoice-details/:id', component: PerformaInvoiceDetailsComponent },
      { path:'product-list', component: ProductListComponent },
      { path:'add-product', component: AddProductComponent },
      { path:'product-details/:id', component: ProductDetailsComponent },
      { path:'customer-list', component: CustomerListComponent },
      { path:'add-customer', component: AddCustomerComponent },
      { path:'customer-details/:id', component: CustomerDetailsComponent },
      { path:'payment-list', component: PaymentListComponent },
      { path:'add-payment', component: AddPaymentComponent },
      { path:'user-setting', component: UserSettingComponent }
  ],
  canActivate:[AuthGuard]},
  { path:'print', component:PrintComponent, 
  children:[
    { path: '', redirectTo :'print', pathMatch:'full'},
    { path: 'print-invoice/:id', component: PrintInvoiceComponent},
    { path: 'print-proforma-invoice/:id', component: PrintProformaInvoiceComponent}
  ],canActivate:[AuthGuard]}

]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    DashboardComponent,
    MainComponent,
    InvoiceListComponent,
    AddInvoiceComponent,
    InvoiceDetailsComponent,
    PerformaInvoicesComponent,
    AddPerformaInvoiceComponent,
    PerformaInvoiceDetailsComponent,
    ProductListComponent,
    AddProductComponent,
    ProductDetailsComponent,
    CustomerListComponent,
    AddCustomerComponent,
    CustomerDetailsComponent,
    PaymentListComponent,
    AddPaymentComponent,
    PrintInvoiceComponent,
    PrintComponent,
    UserSettingComponent,
    LoadingComponent,
    PrintProformaInvoiceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase, 'gaurav-app'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule
  ],
  providers: [
    ProductService,
    CustomerService,
    TaxService,
    InvoiceService,
    PaymentService,
    DashboardService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
