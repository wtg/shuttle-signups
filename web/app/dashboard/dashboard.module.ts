import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {enableDebugTools} from '@angular/platform-browser';

import { DashboardComponent }   from './dashboard.component';
import { ShuttleFormComponent} from '../shuttleform/shuttleform.component';
import { AccountComponent } from '../account/account.component';
@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, JsonpModule],
    declarations: [DashboardComponent, ShuttleFormComponent, AccountComponent],
    bootstrap: [DashboardComponent]
})
export class DashboardModule { }
platformBrowserDynamic().bootstrapModule(DashboardModule);
