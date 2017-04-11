import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {User } from '../dashboard/user';
import {Shuttle} from '../dashboard/shuttle';
import { Headers, RequestOptions } from '@angular/http';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AccountService {
    private baseURL = '/api/';

    constructor(private http: Http) {
        console.log("Made a service");
    }

    getUser(): Promise<User> {
        return this.http.get(this.baseURL + "current-user/")
            .toPromise()
            .then(response => response.json() as User)
            .catch(this.handleError);
    }

    getusershuttles(user:User):Promise<Shuttle[]>{
      return this.http.get(this.baseURL + "get-user-shuttles/")
          .toPromise()
          .then(response => response.json() as Shuttle[] )
          .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
