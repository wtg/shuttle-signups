import { Component } from '@angular/core';
import { User } from '../dashboard/user';
import { Shuttle } from '../dashboard/shuttle';
import { AccountService } from './account.service';

@Component({
    selector: 'account',
    styleUrls: ['assets/css/account.css'],
    templateUrl: 'views/partials/account.component.html',
    providers: [AccountService]
})
export class AccountComponent {
    user: User;
    shuttles: Shuttle[];
    optionsShown: boolean;
    words:String;
    //dashboard constructor, fetch data from server
    constructor(private accountService: AccountService) {
        // Display entertaining blank user while async load
        this.user = new User();
        this.user.numGuests = 0;
        this.optionsShown = false;
        this.words = "hello world";
        //async load current user from /current-user
        // this.accountService.getUser();
        this.getUser();
        //async load list of shuttles from /get-shuttles
        this.accountService.getusershuttles(this.user);

        //debug log that the component loaded.
        console.log("Made a Component");
    }
    getUser() {
        this.accountService.getUser().then((user) => {
          this.user = new User(user);
          console.log("ACCOUNT USER" + user);
        });
    }
    toggleOptions(){
      alert("toggled!");
      this.words = "so lit";
      console.log("this.words: " + this.words )
    }

}
