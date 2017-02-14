import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { ShuttleFormComponent} from '../shuttleform/shuttleform.component';
@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, JsonpModule],
    declarations: [ShuttleFormComponent],
    bootstrap: [ShuttleFormComponent]
})
export class ShuttleFormModule { }
platformBrowserDynamic().bootstrapModule(ShuttleFormModule);
