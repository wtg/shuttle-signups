import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { MDL } from './MaterialDesignLiteUpgradeElement';
import { DashboardComponent }   from './dashboard.component';
import { ShuttleFormComponent} from '../shuttleform/shuttleform.component';
@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, JsonpModule],
    declarations: [DashboardComponent, ShuttleFormComponent, MDL],
    bootstrap: [DashboardComponent]
})
export class DashboardModule { }
platformBrowserDynamic().bootstrapModule(DashboardModule);
