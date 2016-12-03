import { Component, OnInit} from '@angular/core';

import { Observable }       from 'rxjs/Observable';
import { DashboardService } from './dashboard.service';
import {User} from './user';
import {Shuttle} from './shuttle'
@Component({
    selector: 'shuttle-dashboard',
    templateUrl: 'views/partials/dashboard.html',
    providers: [DashboardService]
})

export class DashboardComponent implements OnInit {

    //declare member variables of the dashboard class
    public user: User;
    public shuttles: Shuttle[];
    public usershuttles: Shuttle[];
    private godmode:boolean;
    //dashboard constructor, fetch data from server
    constructor(private dashboardService: DashboardService) {
      this.godmode = false;
        // Display entertaining blank user while async load
        this.user = new User();
        // this.shuttles = new Array<Shuttle>();

        //async load current user from /current_user
        this.dashboardService.getUser().then(user => this.user = new User(user));
        //async load list of shuttles from /get_shuttles
        this.dashboardService.getShuttles().then(shuttles => {
            console.log(this.shuttles = shuttles);
            this.dashboardService.getusershuttles(this.user).then(data => this.usershuttles = data
            )
        });

        //debug log that the component loaded.
        console.log("Made a Component");
    }

    //called after construcotr, the promises should be resolved by now.
    ngOnInit() {
        console.log("called init");
    }
    signup(shuttle: Shuttle) {
        this.dashboardService.signup(this.user, shuttle).then(data => {
          this.usershuttles.push(shuttle);
          var index: number = this.shuttles.indexOf(shuttle,0);
          if(index > -1){
            this.shuttles.splice(index,1);
          }
        }
        )
    }
    unsignup(shuttle: Shuttle) {
        var res: any = this.dashboardService.unsignup(this.user, shuttle).then(data => this.usershuttles.pop());
        res.then(d => console.log("d is" + d,d));
    }
    getusershuttles() {
        this.dashboardService.getusershuttles(this.user).then(shuttles =>
          console.log(this.usershuttles = shuttles));
    }
    togglegodmode(){
      this.godmode = !this.godmode;
      // console.log("godmode: " + this.godmode)
    }
    deleteshuttle(shuttle:Shuttle){
      this.dashboardService.deleteshuttle(shuttle);
    }
    cancelshuttle(shuttle:Shuttle){
      this.dashboardService.cancelshuttle(shuttle);

    }
    addshuttle(shuttle:Shuttle){
      this.dashboardService.addshuttle(shuttle);
    }
    // modifyshuttle(shuttle:Shuttle){
    //   this.dashboardService.modifyshuttle(shuttle);
    //
    // }

}
