import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appUserHasRole]',
  standalone: true, 
})
export class UserHasRoleDirective {
  @Input() set appUserHasRole(role: string) {
    const userRoles = this.authService.getUserRole();
    if (userRoles.includes(role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}

