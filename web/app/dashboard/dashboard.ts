import {enableProdMode} from "@angular/core";
enableProdMode();
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DashboardModule } from './dashboard.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(DashboardModule);