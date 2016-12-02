import { Component ,OnInit} from '@angular/core';

import { Observable }       from 'rxjs/Observable';
import { DashboardService } from './dashboard.service';
import {User} from './user';
import {Shuttle} from './shuttle'
@Component({
    selector: 'shuttle-dashboard',
    templateUrl: 'views/partials/dashboard.html',
    providers: [DashboardService]
})

export class DashboardComponent implements OnInit{

  //declare member variables of the dashboard class
  public user: User;
  public shuttles: Shuttle[];
  //dashboard constructor, fetch data from server
  constructor(private dashboardService: DashboardService){
    // Display entertaining blank user while async load
    // this.user = new User("Shirley","001RPI");
    this.user = new User();
    // this.shuttles = new Array<Shuttle>();

    //async load current user from /current_user
    this.dashboardService.getUser().then(user =>this.user = new User(user));
      //async load list of shuttles from /get_shuttles
        this.dashboardService.getShuttles().then(shuttles => console.log(this.shuttles = shuttles));

        //debug log that the component loaded.
        console.log("Made a Component");
  }

  //called after construcotr, the promises should be resolved by now.
  ngOnInit(){
    console.log("called init");
    console.log(this.shuttles);
  }
  signup(shuttle:Shuttle){
    this.dashboardService.signup(this.user,shuttle);
  }
  unsignup(shuttle:Shuttle){
    this.dashboardService.unsignup(this.user,shuttle);

  }

}
