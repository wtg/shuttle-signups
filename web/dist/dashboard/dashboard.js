"use strict";
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const dashboard_module_1 = require("./dashboard.module");
require("hammerjs");
const platform = platform_browser_dynamic_1.platformBrowserDynamic();
platform.bootstrapModule(dashboard_module_1.DashboardModule);
