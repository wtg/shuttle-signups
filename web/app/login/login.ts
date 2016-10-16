import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LoginModule } from './login.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(LoginModule);
