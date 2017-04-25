import { Directive, AfterViewChecked } from '@angular/core';

declare var componentHandler: any;

@Directive({
  selector: '[mdl]'
})

// http://stackoverflow.com/a/39040342/6432160
export class MDL implements AfterViewChecked {
  ngAfterViewChecked() {
    componentHandler.upgradeAllRegistered();
  }
}
