import {
    Component,
    ElementRef,
    Inject,
    NgModule,
    ViewChild
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AnimationBuilder } from '@angular/animations';
import { BrowserModule, By } from '@angular/platform-browser';
import { IgxOverlayService } from './overlay';
import { IgxOverlayDirective, IgxToggleModule } from './../../directives/toggle/toggle.directive';
import { ConnectedPositioningStrategy } from './position/connected-positioning-strategy';
import { GlobalPositionStrategy } from './position/global-position-strategy';
import { AutoPositionStrategy } from './position/auto-position-strategy';
import { PositionSettings } from './utilities';
import { OverlaySettings } from './utilities';

describe('igxOverlay', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [IgxToggleModule, DynamicModule],
            declarations: DIRECTIVE_COMPONENTS,
            providers: [IgxOverlayService, AnimationBuilder],
        }).compileComponents();
    });

    xit('Unit - OverlayElement should return a div attached to Document\'s body', () => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();

        fixture.componentInstance.buttonElement.nativeElement.click();
        fixture.whenStable().then(() => {
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('visible');
            expect(overlayDiv.classList.contains('overlay')).toBeTruthy();
            fixture.componentInstance.overlay.hideAll();
        });
    });

    xit('Unit - Should show component passed to overlay', () => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();

        fixture.componentInstance.buttonElement.nativeElement.click();
        fixture.whenStable().then(() => {
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('visible');
            expect(overlayDiv.children.length).toEqual(1);
            expect(overlayDiv.children[0].localName).toEqual('div');

            fixture.componentInstance.overlay.hideAll();
        });
    });

    xit('Unit - Hide() should hide component and overlay', () => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();

        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1');
        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_2');
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('visible');
            expect(overlayDiv.children.length).toEqual(2);
            expect(overlayDiv.children[0].localName).toEqual('div');
            expect(overlayDiv.children[1].localName).toEqual('div');

            fixture.componentInstance.overlay.hide('id_1');
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('visible');
            expect(overlayDiv.children.length).toEqual(1);
            expect(overlayDiv.children[0].localName).toEqual('div');

            fixture.componentInstance.overlay.hide('id_2');
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('hidden');
            expect(overlayDiv.children.length).toEqual(0);
        });

    });

    xit('Unit - HideAll() should hide all components and overlay', () => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();
        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1');
        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_2');
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('visible');
            expect(overlayDiv.children.length).toEqual(2);
            expect(overlayDiv.children[0].localName).toEqual('div');
            expect(overlayDiv.children[1].localName).toEqual('div');

            fixture.componentInstance.overlay.hideAll();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('hidden');
            expect(overlayDiv.children.length).toEqual(0);
        });
    });

    xit('Unit - Should show and hide component via directive', () => {
        // tslint:disable-next-line:no-debugger
        debugger;
        const fixture = TestBed.createComponent(SimpleDynamicWithDirectiveComponent);
        fixture.detectChanges();
        fixture.componentInstance.show();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('visible');
            expect(overlayDiv.children.length).toEqual(1);
            expect(overlayDiv.children[0].localName).toEqual('div');

            fixture.componentInstance.hide();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.style.visibility).toEqual('hidden');
            expect(overlayDiv.children.length).toEqual(0);
        });
    });

    // 1. Positioning Strategies
    // 1.1 Global (show components in the window center - default).
    xit('igx-overlay is rendered on top of all other views/components (any previously existing html on the page) etc.', () => {
        // TO DO
    });

    xit('igx-overlay covers the whole window 100% width and height', () => {
        // TO DO
    });

    xit('The shown component is inside the igx-overlay wrapper as a content last child.', () => {
        // in progress
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();
        const overlaySettings = new OverlaySettings();
        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1', overlaySettings);
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const wrapper = fixture.debugElement.nativeElement.parentElement.lastChild.firstChild;
            const content = wrapper.firstChild;
            const componentEl = content.lastChild;

            expect(wrapper.localName).toEqual('div');
            expect(wrapper.firstChild.localName).toEqual('div');
            expect(componentEl.localName === 'ng-component').toBeTruthy();
        });
    });

    xit('The shown component is in the center of igx-overlay (visible window) - default.', () => {
        // TO DO
    });

    xit('When adding a new instance of a component with the same options, it is rendered exactly on top of the previous one.', () => {
        // TO DO
    });
    // adding more than one component to show in igx-overlay:
    xit('When adding a component near the window borders(left,right,up,down), it should be rendered in the igx-overlay center ' +
    '- default', () => {
        // TO DO
    });

    xit('If the shown component is bigger than the visible window, than it should be centered and scrollbars should appear.', () => {
        // TO DO
    });
    // 1.1.1 Global Css
    xit('css class should be applied on igx-overlay component div wrapper.' +
    'Test defaults: When no positionStrategy is passed use GlobalPositionStrategy with default PositionSettings and css class', () => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();
        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1');
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const wrapper = fixture.debugElement.nativeElement.parentElement.lastChild.firstChild;
            expect(wrapper.classList.contains('igx-overlay__wrapper')).toBeTruthy();
            expect(wrapper.localName).toEqual('div');
        });
    });

    it('css class should be applied on igx-overlay component div wrapper' +
    'Test defaults: When positionStrategy is passed with default PositionSettings', () => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();
        const overlaySettings = new OverlaySettings();
        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1', overlaySettings);
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const wrapper = fixture.debugElement.nativeElement.parentElement.lastChild.firstChild;
            expect(wrapper.classList.contains('global-show-center-middle')).toBeTruthy();
            expect(wrapper.localName).toEqual('div');
        });
    });
    // 1.2 ConnectedPositioningStrategy(show components based on a specified position base point, horizontal and vertical alignment)
    xit('igx-overlay is rendered on top of all other views/components (any previously existing html on the page) etc.', () => {
        // TO DO
    });

    xit('igx-overlay covers the whole window 100% width and height.', () => {
        // TO DO
    });

    it('The shown component is inside the igx-overlay wrapper as a last child.', () => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();
        const positionSettings = new PositionSettings();
        const overlaySettings = new OverlaySettings();
        overlaySettings.positionStrategy = new ConnectedPositioningStrategy(positionSettings);

        fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1', overlaySettings);
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const wrapper = fixture.debugElement.nativeElement.parentElement.lastChild.firstChild;
            const componentEl = wrapper.lastChild;
            expect(componentEl.localName === 'ng-component').toBeTruthy();
            expect(wrapper.localName).toEqual('div');
        });
    });

    xit('The shown component is positioned according to the options passed (base point/Left, Center, Right/Top, Middle, Bottom).', () => {
        // TO DO
    });

    xit('If using a ConnectedPositioningStrategy without passing options, the omitted ones default to ' +
        '(Window center point, Center, Middle).', () => {
            // TO DO
        });

    xit('When adding a new component it should be rendered where expected based on the options passed.', () => {
        // TO DO
    });

    // adding more than one component to show in igx-overlay:
    xit('When adding a new instance of component with the same options, it is rendered exactly on top of the previous one.', () => {
        // TO DO
    });

    // If adding a component near the visible window borders(left,right,up,down) it should be partially hidden and based on scroll strategy:
    xit('Scroll Strategy None: no scrolling possible.', () => {
        // TO DO
    });

    xit('closingScrollStrategy: no scrolling possible. The component changes ' +
        'state to closed when reaching the threshold (example: expanded DropDown collapses).', () => {
            // TO DO
        });

    xit('Scroll Strategy Fixed: it should be partially hidden. When scrolling, the component stays static. ' +
        'Component state remains the same (example: expanded DropDown remains expanded).', () => {
            // TO DO
        });

    xit('Scroll Strategy Absolute: can scroll it into view. Component persist state. ' +
        '(example: expanded DropDown remains expanded)', () => {
            // TO DO
        });
    // 1.2.1 Connected Css
        it('css class should be applied on igx-overlay component div wrapper', () => {
            const fixture = TestBed.createComponent(EmptyPageComponent);
            fixture.detectChanges();
            const positionSettings = new PositionSettings();
            const overlaySettings = new OverlaySettings();
            overlaySettings.positionStrategy = new ConnectedPositioningStrategy(positionSettings);

            fixture.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1', overlaySettings);
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const wrapper = fixture.debugElement.nativeElement.parentElement.lastChild.firstChild;
                expect(wrapper.classList.contains('connected-show')).toBeTruthy();
                expect(wrapper.localName).toEqual('div');
            });
        });
    // 1.3 AutoPosition (fit the shown component into the visible window.)
    xit('igx-overlay is rendered on top of all other views/components (any previously existing html on the page) etc.', () => {
        const fix = TestBed.createComponent(EmptyPageComponent);
        fix.detectChanges();
        // const overlaySettings = new OverlaySettings();
        // const positionSettings = new PositionSettings();
        // overlaySettings.positionStrategy = new AutoPositionStrategy(positionSettings);
        // fix.componentInstance.overlay.show(SimpleDynamicComponent, 'id_1', overlaySettings);
        expect(1).toEqual(2);
        // fix.whenStable().then(() => {
        //     fix.detectChanges();
        //     const wrapper = fix.debugElement.nativeElement.parentElement.lastChild as HTMLElement;
        //     expect(wrapper.clientHeight).toEqual(fix.debugElement.nativeElement.parentElement.parentElement.clientHeight);
        //     expect(wrapper.clientWidth).toEqual(fix.debugElement.nativeElement.parentElement.parentElement.clientWidth);
        // });
    });

    xit('igx-overlay covers the whole window 100% width and height', () => {
        // TO DO
    });

    xit('The shown component is inside the igx-overlay as a last child.', () => {
        // TO DO
    });

    xit('igx-overlay displays each shown component based on the options specified if the component fits into the visible window.', () => {
        // TO DO
    });

    xit('The component is repositioned and rendered correctly in the window, even when the rendering options passed ' +
        ' should result in otherwise a partially hidden component. No scrollbars should appear.', () => {
            // TO DO
        });

    xit('igx-overlay margins should be rendered correctly', () => {
        // TO DO
    });

    xit('igx-overlay displays each shown component in the browsers visible window and tries to fit it in case of AutoPosition.', () => {
        // TO DO
    });

    // When adding more than one component to show in igx-overlay:
    xit('When the options used fit the component in the window - adding a new instance of the component with the ' +
        ' same options will render it on top of the previous one.', () => {
            // TO DO
        });

    // When adding more than one component to show in igx-overlay and the options used will not fit the component in the
    // window, so AutoPosition is used.
    xit('adding a new instance of the component with the same options, will render it on top of the previous one.', () => {
        // TO DO
    });

    // When adding a component like Menu that has a sub-menu near the visible window, upon opening the sub-menu,
    // no scrollbar will appear but the sub-menus are rearranged in order to fit in the visible window.
    xit('If the width/height allows, the sub-menu should be shown in the window. If not, it should be AutoPositioned', () => {
        // TO DO
    });

    // 2. Scroll Strategy
    // 2.1. Scroll Strategy - None
    xit('The component do not scroll with the window. The event is canceled. No scrolling happens.', () => {
        // TO DO
    });

    xit('The component shown in igx-overlay do not close.(example: expanded DropDown stays expanded during a scrolling attempt.)', () => {
        // TO DO
    });

    // 2.2 Scroll Strategy - Closing. (Uses a tolerance and closes an expanded component upon scrolling if the tolerance is exceeded.)
    // (example: DropDown or Dialog component collapse/closes after scrolling 10px.)
    xit('Until the set tolerance is exceeded scrolling is possible.', () => {
        // TO DO
    });

    xit('The component shown in igx-overlay do not change its state until it exceeds the scrolling tolerance set.', () => {
        // TO DO
    });

    xit('The component shown in igx-overlay changes its state when it exceeds the scrolling tolerance set ' +
        '(an expanded DropDown, Menu, DatePicker, etc. collapses).', () => {
            // TO DO
        });

    // 2.3 Scroll Strategy - Fixed.
    xit('When scrolling, the component stays static and only the background scrolls', () => {
        // TO DO
    });

    xit('Component persist open state (expanded DropDown remains expanded)', () => {
        // TO DO
    });

    // 2.4. Scroll Strategy - Absolute.
    xit('Scrolls everything.', () => {
        // TO DO
    });

    xit('Components persist open state.', () => {
        // TO DO
    });

    // 3. Interaction
    // 3.1 Modal
    xit('igx-overlay applies a greyed our mask layers', () => {
        // TO DO
    });

    xit('Interaction is allowed only for the shown modal dialog component', () => {
        // TO DO
    });

    xit('Esc key closes the dialog.', () => {
        // TO DO
    });

    xit('Enter selects', () => {
        // TO DO
    });

    xit('Clicking outside the dialog does not close it', () => {
        // TO DO
    });

    // 3.2 Non - Modal
    xit('igx-overlay do not apply a greyed our mask layer', () => {
        // TO DO
    });

    xit('Tab allows changing focus to other components/elements on the window which are not shown via the igx-overlay', () => {
        // TO DO
    });

    xit('Clicking outside the component it collapses/closes (DropDown, DatePicker, NavBar etc.)', () => {
        // TO DO
    });

    xit('Escape - closes (DropDown, Dialog, etc.).', () => {
        // TO DO
    });

    // 4. Css
    xit('All appropriate css classes should be applied on igx-overlay initialization. ' +
        '(class overlay, incl. position, width, height, etc.)', () => {
            // TO DO
        });

    xit('All css properties set should be actually applied.', () => {
        // TO DO
    });

    xit('Css should not leak: From igx-overlay to the inner components (greyed out modal).', () => {
        // TO DO
    });

    xit('Css should not leak: From shown components to igx-overlay.', () => {
        // TO DO
    });

});

@Component({
    template: '<div style=\'position: absolute; width:100px; height: 100px; background-color: red\'></div>'
})
export class SimpleDynamicComponent { }

@Component({
    template: `
        <div igxOverlay>
            <div *ngIf='visible' style=\'position: absolute; width:100px; height: 100px; background-color: red\'></div>
        </div>`
})
export class SimpleDynamicWithDirectiveComponent {
    public visible = false;

    @ViewChild(IgxOverlayDirective)
    private overlay: IgxOverlayDirective;
    show() {
        this.overlay.open();
        this.visible = true;
    }

    hide() {
        this.overlay.close();
        this.visible = false;
    }
}

@Component({
    template: `<button #button (click)=\'click($event)\'>Show Overlay</button>`
})
export class EmptyPageComponent {
    constructor(@Inject(IgxOverlayService) public overlay: IgxOverlayService) { }

    @ViewChild('button') buttonElement: ElementRef;

    click(event) {
        this.overlay.show(SimpleDynamicComponent, 'id_1');
    }
}

const DYNAMIC_COMPONENTS = [
    EmptyPageComponent,
    SimpleDynamicComponent
];

const DIRECTIVE_COMPONENTS = [
    SimpleDynamicWithDirectiveComponent
];

@NgModule({
    imports: [BrowserModule],
    declarations: [DYNAMIC_COMPONENTS],
    exports: [DYNAMIC_COMPONENTS],
    entryComponents: [DYNAMIC_COMPONENTS]
})
export class DynamicModule { }
