import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserHasRoleDirective } from '../../directives/user-has-role.directive';

@Component({
  selector: 'app-layout',
  imports: [MaterialModule, RouterOutlet, RouterLink, CommonModule,UserHasRoleDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, DoCheck, OnDestroy {
  showMenu = false;
  username = "";
  private userSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUserSubject$.subscribe((data) => {
      this.username = data?.name || ""
    });
  }

  ngDoCheck(): void {
    this.setAccess();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  setAccess() {
    let currentUrl = this.router.url;
    if (currentUrl === '/login') {
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }
  }

  logout() {
    this.authService.logout();
  }
}
