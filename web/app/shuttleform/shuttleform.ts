import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ShuttleFormModule } from './shuttleform.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(ShuttleFormModule);
