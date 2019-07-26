import { Component, ElementRef, HostBinding, Input, ViewChild, ViewContainerRef } from '@angular/core';

/**
 * @hidden
 */
@Component({
    selector: 'igx-horizontal-virtual-helper',
    template: '<div #horizontal_container class="igx-vhelper__placeholder-content" [style.width.px]="width"></div>'
})
export class HVirtualHelperComponent {
    @ViewChild('horizontal_container', { read: ViewContainerRef, static: true }) public _vcr;
    @Input() public width: number;
    @HostBinding('class')
    public cssClasses = 'igx-vhelper--horizontal';

    constructor(public elementRef: ElementRef) { }

    private _scrollPosition = null;

    /**
     * @hidden
     * @internal
     */
    public get scrollPosition(): number {
        if (this._scrollPosition === null) {
            this._scrollPosition = this.elementRef.nativeElement.scrollLeft;
        }
        return this._scrollPosition;
    }
    /**
     * @hidden
     * @internal
     */
    public set scrollPosition(val: number) {
        this._scrollPosition = val;
        this.elementRef.nativeElement.scrollLeft = val;
    }

    public updateScroll(val: number) {
        this._scrollPosition = val;
    }

}
