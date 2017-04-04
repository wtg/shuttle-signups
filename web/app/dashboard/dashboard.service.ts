import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {User } from './user';
import {Shuttle} from './shuttle';
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
export class DashboardService {
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
    getShuttles(): Promise<Shuttle[]> {
        return this.http.get(this.baseURL + "get-shuttles/")
            .toPromise()
            .then(response => response.json() as Shuttle[])
            .catch(this.handleError);
    }
    getShuttleGroups(): Promise<Shuttle[]> {
        return this.http.get(this.baseURL + "get-shuttle-groups/")
            .toPromise()
            .then(response => response.json() as Shuttle[])
            .catch(this.handleError);
    }
    signup(user:User,shuttle:Shuttle):Promise<void> {
      console.log(user);
        var data = {
          "id":shuttle._id,
          "numGuests":user.numGuests,
          "guestsOnly":user.guestsOnly
        }
        console.log(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseURL + "signup-shuttle/",data,options).toPromise().then(res =>{
          console.log(res);
          shuttle.message = "" + res["_body"];
        } );
    }
    unsignup(user:User,shuttle:Shuttle):Promise<void>{
      console.log(user);
        var data = {
          "id":shuttle._id,
          "numGuests":user.numGuests,
          "guestsOnly":user.guestsOnly
        }
        console.log(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseURL + "unsignup-shuttle/",data,options).toPromise().then(res =>{
          console.log(res);
          shuttle.message = "" + res["_body"];
        } );
    }
    getusershuttles(user:User):Promise<Shuttle[]>{
      return this.http.get(this.baseURL + "get-user-shuttles/")
          .toPromise()
          .then(response => response.json() as Shuttle[] )
          .catch(this.handleError);
    }
    deleteshuttle(shuttle:Shuttle):Promise<Response>{
      var data = {
        "id":shuttle._id,
      }
      console.log(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseURL + "admin/delete-shuttle/",data,options)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
    }
    cancelshuttle(shuttle:Shuttle):Promise<Response>{
      var data = {
        "id":shuttle._id,
      }
      console.log(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseURL + "admin/cancel-shuttle/",data,options)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);

    }
    addshuttle(shuttle:Shuttle){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.post(this.baseURL + "admin/add-shuttle/",shuttle,options)
      .toPromise()
      .then(response => console.log(response))
      .catch(this.handleError);

    }
    //uncomment once implemented on backend
    // modifyshuttle(shuttle:Shuttle):Promise<Response>{
      // var data = {
      //   "id":shuttle._id,
      // }
      // console.log(data);
      // let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });
      // return this.http.post(this.baseURL + "modify-shuttle/",data,options)
      // .toPromise()
      // .then(response => response)
      // .catch(this.handleError);
    // }

    // private extractData(res: Response) {
    //     let body = res.json();
    //     console.log("extracting data");
    //     console.log(body);
    //     return body.data || {};
    // }


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
