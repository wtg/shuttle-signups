"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
const material_1 = require("@angular/material");
require("hammerjs");
const dashboard_component_1 = require("./dashboard.component");
const shuttle_form_component_1 = require("./shuttle-form.component");
let DashboardModule = class DashboardModule {
};
DashboardModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule, http_1.JsonpModule, material_1.MaterialModule.forRoot()],
        declarations: [dashboard_component_1.DashboardComponent, shuttle_form_component_1.ShuttleFormComponent],
        bootstrap: [dashboard_component_1.DashboardComponent]
    })
], DashboardModule);
exports.DashboardModule = DashboardModule;
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(DashboardModule);
