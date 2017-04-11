import { Component } from '@angular/core';
import { User } from '../dashboard/user';
import { Shuttle } from '../dashboard/shuttle';
import { AccountService } from './account.service';

@Component({
    selector: 'account',
    templateUrl: 'views/partials/account.component.html',
    providers: [AccountService]
})
export class AccountComponent {
    user: User;
    shuttles: Shuttle[];

    //dashboard constructor, fetch data from server
    constructor(private accountService: AccountService) {
        // Display entertaining blank user while async load
        this.user = new User();

        //async load current user from /current-user
        this.accountService.getUser();

        //async load list of shuttles from /get-shuttles
        this.accountService.getusershuttles(this.user);

        //debug log that the component loaded.
        console.log("Made a Component");
    }

}
