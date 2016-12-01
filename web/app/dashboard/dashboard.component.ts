import { Component } from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import { DashboardService } from './dashboard.service';
import {User} from './user';
@Component({
    selector: 'shuttle-dashboard',
    templateUrl: 'views/partials/dashboard.html',
    providers: [DashboardService]
})

export class DashboardComponent {
  public user: User;
  public data: any;
  public d_user: any;
  public d_error: any;
  constructor(private dashboardService: DashboardService){
    this.user = new User("Shirley","001RPI");
    this.dashboardService.getUser().then(user =>this.user = user);
    this.data = this.dashboardService.getUser();
    console.log("Made a Component");
  }
}
