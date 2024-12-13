import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { product, productstatus, RecordStatusEnum } from '../../models/product.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  imports: [MaterialModule, RouterLink,CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  productlist!: product[];
  displayedColumns: string[] = ["code","name", "description", "price", "status", "action"];
  datasource: any; 
  isLoading = false; // Spinner visibility

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private service: ProductService, private userservice: UserService, private toastr: ToastrService,
    private router: Router,private dialog: MatDialog) {

  }

  ngOnInit(): void {
   this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true; // Show spinner
    this.service.GetAllProducts().subscribe({
      next: (item) => {
        this.productlist = item;
        this.datasource = new MatTableDataSource<product>(this.productlist);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
        this.isLoading = false; // Hide spinner
      },
      error: (error :HttpErrorResponse) => {
        this.toastr.error(error.error.detail || 'An error occurred while processing your request.');
        this.isLoading = false; // Hide spinner
       }
    })
  }
  
  edit(id: string) {
    this.router.navigateByUrl(`/product/${id}`);
  }

  openDeleteDialog(id : string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteProduct(id); // Perform the delete action
      }
    });
  }

  deleteProduct(id: string) {
    this.service.DeleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Deleted successfully', 'Success');
        this.loadProducts();
      }, error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error.detail || 'An error occurred while processing your request.');
      }
    })
  }

  toggleStatus(product: productstatus) {
    const newStatus =
      product.status === RecordStatusEnum.Active
        ? RecordStatusEnum.InActive
        : RecordStatusEnum.Active;

    const requestObj = {
      id: product.id,
      status: newStatus,
    };
    this.service.UpdateStatus(requestObj).subscribe({
      next: () => {
        this.toastr.success('Update Status successfully', 'Success');
        product.status = newStatus;
      }, error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error.detail || 'An error occurred while processing your request.');
      }
    });
  }
}
