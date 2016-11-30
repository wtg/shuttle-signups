import { Component } from '@angular/core';
import { DashboardService } from './dashboard.service';
import {User} from './user';
@Component({
    selector: 'shuttle-dashboard',
    templateUrl: 'views/partials/dashboard.html'
})

export class DashboardComponent {
  public user: User;
  constructor(){
    this.user = new User("Lucien","brulel");
  }
}
