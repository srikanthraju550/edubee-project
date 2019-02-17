
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[myNumberOnly]'
})
export class NumberOnlyDirective {
    // Allow decimal numbers and negative values
    private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[alphabetsOnly]'
})

export class AlphabetsOnly {
    // Allow decimal numbers and negative values
    private regex: RegExp = new RegExp(/^[a-zA-Z ]*$/);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    // private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'space'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        // if (this.specialKeys.indexOf(event.key) !== -1) {
        //     return;
        // }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[alphanumericOnly]'
})

export class AlphaNumericOnly {
    // Allow decimal numbers and negative values
    private regex: RegExp = new RegExp(/^[0-9a-zA-Z]+$/);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    // private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'space'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        // if (this.specialKeys.indexOf(event.key) !== -1) {
        //     return;
        // }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}
