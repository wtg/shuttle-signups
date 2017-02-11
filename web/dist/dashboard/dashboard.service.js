"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
const http_2 = require("@angular/http");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/map");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/toPromise");
let DashboardService = class DashboardService {
    constructor(http) {
        this.http = http;
        this.baseURL = '/api/';
    }
    getUser() {
        return this.http.get(this.baseURL + "current-user/")
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    getShuttles() {
        return this.http.get(this.baseURL + "get-shuttles/")
            .toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }
    signup(user, shuttle) {
        var data = {
            "id": shuttle._id,
            "numGuests": user.numGuests,
            "guestsOnly": user.guestsOnly
        };
        let headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        let options = new http_2.RequestOptions({ headers: headers });
        return this.http.post(this.baseURL + "signup_shuttle/", data, options).toPromise().then(res => {
            shuttle.message = "" + res["_body"];
        });
    }
    unsignup(user, shuttle) {
        var data = {
            "id": shuttle._id,
            "numGuests": user.numGuests,
            "guestsOnly": user.guestsOnly
        };
        let headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        let options = new http_2.RequestOptions({ headers: headers });
        return this.http.post(this.baseURL + "unsignup_shuttle/", data, options).toPromise().then(res => {
            shuttle.message = "" + res["_body"];
        });
    }
    getusershuttles(user) {
        return this.http.get(this.baseURL + "get-user-shuttles/")
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    deleteshuttle(shuttle) {
        var data = {
            "id": shuttle._id,
        };
        let headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        let options = new http_2.RequestOptions({ headers: headers });
        return this.http.post(this.baseURL + "delete-shuttle/", data, options)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    cancelshuttle(shuttle) {
        var data = {
            "id": shuttle._id,
        };
        let headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        let options = new http_2.RequestOptions({ headers: headers });
        return this.http.post(this.baseURL + "cancel-shuttle/", data, options)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    addshuttle(shuttle) {
        let headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        let options = new http_2.RequestOptions({ headers: headers });
        this.http.post(this.baseURL + "add-shuttle/", shuttle, options)
            .toPromise()
            .then(response => console.log(response))
            .catch(this.handleError);
    }
    handleError(error) {
        let errMsg;
        if (error instanceof http_1.Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    }
};
DashboardService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], DashboardService);
exports.DashboardService = DashboardService;
