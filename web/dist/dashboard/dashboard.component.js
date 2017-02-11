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
const dashboard_service_1 = require("./dashboard.service");
const user_1 = require("./user");
let DashboardComponent = class DashboardComponent {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
        this.searchquery = "Rensselaer Union to Crossgates 09/12/16";
        this.godmode = false;
        this.user = new user_1.User();
        this.getuser();
        this.getshuttles();
    }
    ngOnInit() {
    }
    getuser() {
        this.dashboardService.getUser().then(user => this.user = new user_1.User(user));
    }
    getshuttles() {
        this.dashboardService.getShuttles().then(shuttles => {
            this.dashboardService.getusershuttles(this.user).then(data => {
                this.usershuttles = data;
                var s = new Map();
                var s_buf = [];
                for (var i = 0; i < this.usershuttles.length; i++) {
                    s.set(this.usershuttles[i]._id, this.usershuttles[i]);
                }
                for (var i = 0; i < shuttles.length; i++) {
                    if (!s.has(shuttles[i]._id)) {
                        s_buf.push(shuttles[i]);
                    }
                }
                this.shuttles = s_buf;
            });
        });
    }
    signup(shuttle) {
        this.dashboardService.signup(this.user, shuttle).then(data => {
            this.usershuttles.push(shuttle);
            var index = this.shuttles.indexOf(shuttle, 0);
            if (index > -1) {
                this.shuttles.splice(index, 1);
            }
            this.getshuttles();
        });
    }
    unsignup(shuttle) {
        this.dashboardService.unsignup(this.user, shuttle).then(data => {
            this.shuttles.push(shuttle);
            var index = this.usershuttles.indexOf(shuttle, 0);
            if (index > -1) {
                this.usershuttles.splice(index, 1);
            }
            this.getshuttles();
        });
    }
    getusershuttles() {
        this.dashboardService.getusershuttles(this.user).then(shuttles => console.log(this.usershuttles = shuttles));
    }
    togglegodmode() {
        this.godmode = !this.godmode;
    }
    deleteshuttle(shuttle) {
        this.dashboardService.deleteshuttle(shuttle).then(dataa => this.getshuttles());
    }
    cancelshuttle(shuttle) {
        this.dashboardService.cancelshuttle(shuttle).then(data => this.getshuttles());
    }
    addshuttle(shuttle) {
        this.dashboardService.addshuttle(shuttle);
    }
    getriders(shuttle) {
        return JSON.stringify(shuttle.riders);
    }
};
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'shuttle-dashboard',
        templateUrl: 'views/partials/dashboard.html',
        styleUrls: ['assets/css/dashboard.css'],
        providers: [dashboard_service_1.DashboardService]
    }),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
