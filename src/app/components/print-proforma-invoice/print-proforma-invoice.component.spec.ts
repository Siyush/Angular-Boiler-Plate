import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProformaInvoiceComponent } from './print-proforma-invoice.component';

describe('PrintProformaInvoiceComponent', () => {
  let component: PrintProformaInvoiceComponent;
  let fixture: ComponentFixture<PrintProformaInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProformaInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
