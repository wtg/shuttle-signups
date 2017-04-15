import { Component, OnInit} from '@angular/core';

import { Observable }       from 'rxjs/Observable';
import { DashboardService } from './dashboard.service';
import {User} from './user';
import {Shuttle} from './shuttle';
import {ShuttleGroup} from './shuttle-group';
@Component({
    selector: 'shuttle-dashboard',
    templateUrl: 'views/partials/dashboard.html',
    styleUrls: ['assets/css/dashboard.css'],
    providers: [DashboardService]
})

export class DashboardComponent implements OnInit {

    //declare member variables of the dashboard class
    public user: User;
    public shuttles: Shuttle[];
    public shuttleGroups: ShuttleGroup[];
    public usershuttles: Shuttle[];
    private godmode: boolean;
    private searchquery: string;

    //dashboard constructor, fetch data from server
    constructor(private dashboardService: DashboardService) {
        this.searchquery = "Rensselaer Union to Crossgates 09/12/16";
        this.godmode = false;
        // Display entertaining blank user while async load
        this.user = new User();
        this.shuttles = [];
        this.shuttleGroups = [];

        //async load current user from /current-user
        this.getuser();

        //async load list of shuttles from /get-shuttles
        // and shuttle groups from /get-shuttle-groups
        this.getShuttles();
        this.getShuttleGroups();

        //debug log that the component loaded.
        console.log("Made a Component");
        console.log('this.shuttles:', this.shuttles);
    }

    //called after construcotr, the promises should be resolved by now.
    ngOnInit() {
        console.log("called init");
    }
    showShuttles(shuttleGroup: ShuttleGroup){
      // Collapse other groups' cards
      this.shuttleGroups.forEach(group => {
        if (group._id != shuttleGroup._id) {
          group.showMore = false;
        }
      });

      // Expand this group's cards
      shuttleGroup.showMore = !shuttleGroup.showMore;
    }
    getuser() {
        this.dashboardService.getUser().then(user => this.user = new User(user));
    }
    getShuttles() {
        this.dashboardService.getShuttles().then(shuttles => {
            // console.log(this.shuttles = shuttles);
            this.dashboardService.getusershuttles(this.user).then(data => {
                this.usershuttles = data;
                //now diff user shuttles and availible shuttles
                console.log("diff:");
                var s = new Map();
                var s_buf = [];
                for(var i = 0;i < this.usershuttles.length;i++){
                  s.set(this.usershuttles[i]._id,this.usershuttles[i]);
                }
                console.log(s);
                for(var i = 0; i < shuttles.length;i++){
                  console.log(shuttles[i]._id,s.has(shuttles[i]._id));
                  if(! s.has(shuttles[i]._id)){
                    s_buf.push(shuttles[i]);
                  }
                }
                this.shuttles=s_buf;
                console.log(s_buf);
                // console.log(this.shuttles.filter(shuttle => this.usershuttles.indexOf(shuttle, 0) < 0));

            }
            )
        });
    }
    getShuttleGroups() {
        this.dashboardService.getShuttleGroups().then(shuttleGroups => {
            console.log('getShuttleGroups:', shuttleGroups);
            shuttleGroups.forEach(shuttleGroup => this.shuttleGroups.push(new ShuttleGroup(shuttleGroup)), this);
            console.log('this.shuttleGroups:', this.shuttleGroups);
        });
    }
    signup(shuttle: Shuttle) {
        this.dashboardService.signup(this.user, shuttle).then(data => {
            this.usershuttles.push(shuttle);
            var index: number = this.shuttles.indexOf(shuttle, 0);
            if (index > -1) {
                this.shuttles.splice(index, 1);
            }
            this.getShuttles();
        }
        )
    }
    unsignup(shuttle: Shuttle) {
        this.dashboardService.unsignup(this.user, shuttle).then(data => {
            this.shuttles.push(shuttle);
            var index: number = this.usershuttles.indexOf(shuttle, 0);
            if (index > -1) {
                this.usershuttles.splice(index, 1);
            }
            this.getShuttles();
        });
    }
    getusershuttles() {
        this.dashboardService.getusershuttles(this.user).then(shuttles =>
            console.log(this.usershuttles = shuttles));
    }
    togglegodmode() {
        this.godmode = !this.godmode;
        // console.log("godmode: " + this.godmode)
    }
    deleteshuttle(shuttle: Shuttle) {
        this.dashboardService.deleteshuttle(shuttle).then(dataa =>
          this.getShuttles()
        )
    }
    cancelshuttle(shuttle: Shuttle) {
        this.dashboardService.cancelshuttle(shuttle).then(data => this.getShuttles());

    }
    addshuttle(shuttle: Shuttle) {
        this.dashboardService.addshuttle(shuttle);
    }
    getriders(shuttle:Shuttle){
      return JSON.stringify(shuttle.riders);
    }
    // modifyshuttle(shuttle:Shuttle){
    //   this.dashboardService.modifyshuttle(shuttle);
    //
    // }

}
