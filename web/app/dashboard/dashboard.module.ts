import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent }   from './dashboard.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
@NgModule({
    imports: [BrowserModule, HttpModule, JsonpModule],
    declarations: [DashboardComponent],
    bootstrap: [DashboardComponent]
})
export class DashboardModule { }
platformBrowserDynamic().bootstrapModule(DashboardModule);
