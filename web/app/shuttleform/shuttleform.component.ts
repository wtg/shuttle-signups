import { Component } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { Shuttle }    from '../dashboard/shuttle';

// NOTE: moduleId does not belong in our project, omit it.
//https://stackoverflow.com/questions/34844206/templateurl-does-not-work-for-me
// It resets the path resolution, we want it to be served from app as root
@Component({
    selector: 'shuttle-form',
    templateUrl: 'views/partials/shuttleform.html',
    styleUrls: ['assets/css/dashboard.css'],
})
export class ShuttleFormComponent {
  constructor(private dashboardService: DashboardService){};
    model = new Shuttle();
    submitted = false;
    booleans = [
        { value: true, display: 'True' },
        { value: false, display: 'False' }
    ];
    onSubmit() {
      this.submitted = true;
      this.dashboardService.addshuttle(this.model);
     }
    newShuttle() {
        this.model = null;
        this.model = new Shuttle();
    }
    get diagnostic() { return JSON.stringify(this.model, null, 2); }
}
