import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { loginreponse, userlogin } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  loginResponse!: loginreponse;
  isProcessing = false;

  constructor(private userservice: UserService, private authservice: AuthService, private toastR: ToastrService,
    private router: Router, private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    localStorage.clear();
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {

    if (this.loginForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      let userLoginObj: userlogin = {
        email: this.loginForm.value.email as string,
        password: this.loginForm.value.password as string
      }

      this.userservice.Login(userLoginObj).subscribe({
        next: (response: any) => {
          this.isProcessing = false;
          this.authservice.saveTokens(response.accessToken, response.refreshToken);
          //Set user details
          this.authservice.setCurrentUser(response.accessToken);
          this.router.navigateByUrl('/home');
        },
        error: (error: HttpErrorResponse) => {
          this.isProcessing = false;
          this.toastR.error(error.error.detail || 'An error occurred while processing your request.');
        }
      })
    }
  }
}
