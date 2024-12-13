import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { createproduct, product } from '../../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { priceValidator } from '../../validators/validators';

@Component({
  selector: 'app-product-create-edit',
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-create-edit.component.html',
  styleUrl: './product-create-edit.component.css'
})
export class ProductCreateEditComponent {

  productForm!: FormGroup  
  isProcessing = false;
  _response: any;
  title = 'Add Product';
  editId = '';
  isEdit = false;
  editdata!: product;

  constructor(private builder: FormBuilder, private service: ProductService,
    private toastr: ToastrService, private router: Router,private act: ActivatedRoute) { }

  ngOnInit(): void {

    this.editId = this.act.snapshot.paramMap.get('id') as string;
    if (this.editId != '' && this.editId != null) {
      this.isEdit = true
      this.title = 'Edit Product';
      this.service.GetProductById(this.editId).subscribe({
        next: (item: product) => {
          this.editdata = item;
          this.productForm.patchValue({
            code: this.editdata.code, name: this.editdata.name, description: this.editdata.description,
            price: this.editdata.price, status: this.editdata.isActive
          });
          this.productForm.controls['code'].disable();
        }
      })
    }
    this.initializedCreateProductForm();
  }

  initializedCreateProductForm() {
    this.productForm = this.builder.group(
      {
        code: ['', Validators.required],
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', [Validators.required, priceValidator()]],
      }
    );
  }

  SaveProduct() {
    if (this.productForm.valid) {
      this.isProcessing = true;
      let _obj: createproduct = {
        code: this.productForm.value.code as string,
        name: this.productForm.value.name as string,
        description: this.productForm.value.description as string,
        price: this.productForm.value.price as number
      }

      if (!this.isEdit) {
        this.service.CreateProduct(_obj).subscribe({
          next: () => {
            this.isProcessing = false;
            this.toastr.success('Created successfully', 'Success');
            this.router.navigateByUrl('/');

          }, error: (error: HttpErrorResponse) => {
            this.isProcessing = false;
            this.toastr.error(error.error.detail || 'An error occurred while processing your request.');
          }
        })
      } else {
        this.isProcessing = true;
        _obj.id = this.editId;
        this.service.UpdateProduct(_obj).subscribe({
          next: () => {
            this.isProcessing = false;
            this.toastr.success('Updated successfully', 'Success');
            this.router.navigateByUrl('/');
          }, error: (error: HttpErrorResponse) => {
            this.isProcessing = false;
            this.toastr.error(error.error.detail || 'An error occurred while processing your request.');
          }
        })
      }
    }
  }
}
