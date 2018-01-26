import { Directive, DoCheck, OnChanges, Input, TrackByFunction, isDevMode, ChangeDetectorRef, NgIterable, IterableDiffer, ViewContainerRef, TemplateRef, IterableDiffers, SimpleChanges, IterableChanges, EmbeddedViewRef, IterableChangeRecord, ComponentFactory, ComponentFactoryResolver, ViewChild, HostListener } from '@angular/core';
import { NgForOfContext } from '@angular/common';
import { NgForOf } from '@angular/common/src/directives/ng_for_of';
import { VirtualHelper } from './virtual.helper.component';
import { ComponentRef } from '@angular/core/src/linker/component_factory';
import { DisplayContainer } from './display.container';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HVirtualHelper } from './horizontal.virtual.helper.component';

@Directive({selector: '[igVirtFor]'})
export class IgVirtualForOf<T> {

	private hScroll;
	private func;

	dc :ComponentRef<DisplayContainer>;

	@ViewChild(DisplayContainer)
	private displayContiner: DisplayContainer;

	@ViewChild(VirtualHelper)
	private virtualHelper: VirtualHelper;

	@Input() igVirtForOf: Array<any>;
	@Input() igVirtForScrolling: string;
	@Input() igVirtForUseForScroll: any;
	//@Input()
	//set ngForTrackBy(fn: TrackByFunction<T>) {
	//  if (isDevMode() && fn != null && typeof fn !== 'function') {
	//	// TODO(vicb): use a log service once there is a public one available
	//	if (<any>console && <any>console.warn) {
	//	  console.warn(
	//		  `trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
	//		  `See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information.`);
	//	}
	//  }
	//  this._trackByFn = fn;
	//}
  //

	onScroll(event) {
		let scrollTop = event.target.scrollTop;
		let vcHeight = event.target.children[0].scrollHeight;
		let ratio = scrollTop / vcHeight;

		this._currIndex = Math.round(ratio * this.igVirtForOf.length);
		this.dc.instance._vcr.clear();
		let endingIndex = this._pageSize + this._currIndex;
		for(let i = this._currIndex; i < endingIndex && this.igVirtForOf[i] !== undefined; i++) {
			let input = this.igVirtForOf[i];
			this.dc.instance._vcr.createEmbeddedView(this._template, { $implicit: input, index: this.igVirtForOf.indexOf(input) });
		}
		this.dc.changeDetectorRef.detectChanges();
	}

	onHScroll(event) {
		if(!this.dc){return;}
		let scrollLeft = event.target.scrollLeft;
		let hcWidth = event.target.children[0].scrollWidth;
		let ratio = scrollLeft / hcWidth;

		this._currIndex = Math.round(ratio * this.igVirtForOf.length);		
		this.dc.instance._vcr.clear();

		 let endingIndex = this._pageSize + this._currIndex;
		 for(let i = this._currIndex; i < endingIndex && this.igVirtForOf[i] !== undefined; i++) {
		 	let input = this.igVirtForOf[i];
		 	this.dc.instance._vcr.createEmbeddedView(this._template, { $implicit: input, index: this.igVirtForOf.indexOf(input) });
		 }
		this.dc.instance.cdr.markForCheck();
	}

	get ngForTrackBy(): TrackByFunction<T> { return this._trackByFn; }

	private _differ: IterableDiffer<T>|null = null;
	private _trackByFn: TrackByFunction<T>;
	private _pageSize: number = 20;
	private _currIndex: number = 0;

	constructor(
		private _viewContainer: ViewContainerRef, private _template: TemplateRef<NgForOfContext<T>>,
		private _differs: IterableDiffers, private resolver: ComponentFactoryResolver, public cdr: ChangeDetectorRef) {}

	//@Input()
	//set ngForTemplate(value: TemplateRef<NgForOfContext<T>>) {
	//  // TODO(TS2.1): make TemplateRef<Partial<NgForRowOf<T>>> once we move to TS v2.1
	//  // The current type is too restrictive; a template that just uses index, for example,
	//  // should be acceptable.
	//  if (value) {
	//	this._template = value;
	//  }
	//}
  //
	ngOnInit(): void {
		//this._viewContainer.clear();
		const dcFactory: ComponentFactory<DisplayContainer> = this.resolver.resolveComponentFactory(DisplayContainer);
		this.dc = this._viewContainer.createComponent(dcFactory, 0);
		for(let i = 0; i < this._pageSize && this.igVirtForOf[i] !== undefined; i++) {
			let input = this.igVirtForOf[i];
			this.dc.instance._vcr.createEmbeddedView(this._template, { $implicit: input, index: this.igVirtForOf.indexOf(input) });
		}

		 if (this.igVirtForScrolling === "vertical") {
			 
			const factory: ComponentFactory<VirtualHelper> = this.resolver.resolveComponentFactory(VirtualHelper);
			let vh: ComponentRef<VirtualHelper> = this._viewContainer.createComponent(factory, 1);
			vh.instance.itemsLength = this.igVirtForOf.length;
			vh.instance.vhscroll.subscribe(v => this.onScroll(v));
			this.cdr.detectChanges();
			this._pageSize = vh.instance.elementRef.nativeElement.clientHeight / 50;
		 }

		var that = this;
		if (this.igVirtForScrolling === "horizontal") {
			
			var directiveRef = this.igVirtForUseForScroll || this;
			let vc = this.igVirtForUseForScroll ? this.igVirtForUseForScroll._viewContainer : this._viewContainer;
			this.hScroll = this.checkIfExists(vc, "horizontal-virtual-helper");
			if(!this.hScroll){
				const hvFactory: ComponentFactory<HVirtualHelper> = this.resolver.resolveComponentFactory(HVirtualHelper);
				let hvh: ComponentRef<HVirtualHelper> = vc.createComponent(hvFactory);
				hvh.instance.itemsLength = this.igVirtForOf.length;
				hvh.instance.vhscroll.subscribe(v =>{ this.onHScroll(v);});
				this._pageSize = hvh.instance.elementRef.nativeElement.clientWidth / 200;
				//hvh.instance.elementRef.nativeElement.addEventListener('scroll', function (evt) {debugger;that.onHScroll(evt);})
			} else {
				this.func = function (evt) {that.onHScroll(evt);}
				this.hScroll.addEventListener('scroll', this.func)
			}
			
		}
	}
	ngOnDestroy(): void {
		this.dc = null;
		this.hScroll.removeEventListener("scroll", this.func);
		this.cdr.detectChanges();
	}

	checkIfExists(viewref, nodeName) {
		var elem = viewref.element.nativeElement.parentElement.getElementsByTagName(nodeName);
		return elem.length > 0 ? elem[0] : null;
	}
}

class RecordViewTuple<T> {
	constructor(public record: any, public view: EmbeddedViewRef<NgForOfContext<T>>) {}
}

export function getTypeNameForDebugging(type: any): string {
	return type['name'] || typeof type;
}



@NgModule({
    declarations: [	IgVirtualForOf, DisplayContainer, VirtualHelper, HVirtualHelper],
    entryComponents: [	DisplayContainer, VirtualHelper, HVirtualHelper],
	imports: [ CommonModule ],
	exports: [ IgVirtualForOf ]
})
export class IgxVirtForModule {
}
