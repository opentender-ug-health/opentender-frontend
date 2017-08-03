import {Component, Input, Output, OnChanges, ElementRef, ViewChild, EventEmitter, AfterViewInit, ChangeDetectionStrategy, SimpleChanges} from '@angular/core';
import {trimLabel} from '../../utils/label.helper';
import {reduceTicks} from './ticks.helper';
import {isDate} from '../../utils/date.helper';
import {PlatformService} from '../../../../services/platform.service';

@Component({
	selector: 'g[ngx-charts-y-axis-ticks]',
	template: `
		<svg:g #ticksel>
			<svg:g *ngFor="let tick of ticks" class="tick"
				   [attr.transform]="transform(tick)">
				<title>{{tick}}</title>
				<svg:text
						stroke-width="0.01"
						[attr.dy]="dy"
						[attr.x]="x1"
						[attr.y]="y1"
						[attr.text-anchor]="textAnchor"
						[style.font-size]="'11px'">
					{{trimLabel(tickFormat(tick), trimLabelLength || 16)}}
				</svg:text>
			</svg:g>
		</svg:g>
		<svg:g *ngFor="let tick of ticks"
			   [attr.transform]="transform(tick)">
			<svg:g
					*ngIf="showGridLines"
					[attr.transform]="gridLineTransform()">
				<svg:line
						class="gridline-path gridline-path-horizontal"
						x1="0"
						[attr.x2]="gridLineWidth"/>
			</svg:g>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class YAxisTicksComponent implements OnChanges, AfterViewInit {

	@Input() scale;
	@Input() orient;
	@Input() tickArguments = [5];
	@Input() tickValues;
	@Input() tickStroke = '#ccc';
	@Input() tickFormatting;
	@Input() showGridLines = false;
	@Input() gridLineWidth;
	@Input() height;
	@Input() defaultWidth: number;
	@Input() minInterval: number;
	@Input() trimLabelLength = 16;

	@Output() dimensionsChanged = new EventEmitter();

	innerTickSize: any = 6;
	tickPadding: any = 3;
	tickSpacing: any;
	verticalSpacing: number = 20;
	textAnchor: any = 'middle';
	dy: any;
	x1: any;
	x2: any;
	y1: any;
	y2: any;
	adjustedScale: any;
	transform: any;
	tickFormat: any;
	ticks: any;
	width: number = 0;
	outerTickSize: number = 6;
	rotateLabels: boolean = false;
	trimLabel: any;

	@ViewChild('ticksel') ticksElement: ElementRef;

	constructor(private platform: PlatformService) {
		this.trimLabel = trimLabel;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	ngAfterViewInit(): void {
		this.update();
	}

	updateDims(): void {
		if (!this.ticks || this.ticks.length === 0) {
			this.width = this.defaultWidth;
			if (this.platform.isBrowser) {
				setTimeout(() => {
					this.dimensionsChanged.emit({width: this.width});
				});
			}
			return;
		}
		let width = (this.platform.isBrowser && this.ticks && (this.ticks.length > 0)) ? parseInt(this.ticksElement.nativeElement.getBoundingClientRect().width, 10) : this.defaultWidth;
		if (width === 0) {
			width = this.defaultWidth;
		}
		if (width !== this.width) {
			this.width = width;
			setTimeout(() => {
				this.dimensionsChanged.emit({width: this.width});
			});
			if (this.platform.isBrowser) {
				setTimeout(() => this.updateDims());
			}
		}
	}

	update(): void {
		if (!this.scale) {
			return;
		}

		let sign = this.orient === 'top' || this.orient === 'right' ? -1 : 1;
		this.tickSpacing = Math.max(this.innerTickSize, 0) + this.tickPadding;

		this.ticks = this.getTicks();

		if (this.tickFormatting) {
			this.tickFormat = this.tickFormatting;
		} else if (this.scale.tickFormat) {
			this.tickFormat = this.scale.tickFormat.apply(this.scale, this.tickArguments);
		} else {
			this.tickFormat = function(d) {
				return isDate(d) ? d.toLocaleDateString() : d.toLocaleString();
			};
		}

		this.adjustedScale = this.scale.bandwidth ? function(d) {
			return this.scale(d) + this.scale.bandwidth() * 0.5;
		} : this.scale;

		switch (this.orient) {
			case 'top':
				this.transform = function(tick) {
					return 'translate(' + this.adjustedScale(tick) + ',0)';
				};
				this.textAnchor = 'middle';
				this.y2 = this.innerTickSize * sign;
				this.y1 = this.tickSpacing * sign;
				this.dy = sign < 0 ? '0em' : '.71em';
				break;
			case 'bottom':
				this.transform = function(tick) {
					return 'translate(' + this.adjustedScale(tick) + ',0)';
				};
				this.textAnchor = 'middle';
				this.y2 = this.innerTickSize * sign;
				this.y1 = this.tickSpacing * sign;
				this.dy = sign < 0 ? '0em' : '.71em';
				break;
			case 'left':
				this.transform = function(tick) {
					return 'translate(5,' + this.adjustedScale(tick) + ')';
				};
				this.textAnchor = 'end';
				this.x2 = this.innerTickSize * -sign;
				this.x1 = this.tickSpacing * -sign;
				this.dy = '.32em';
				break;
			case 'right':
				this.transform = function(tick) {
					return 'translate(0,' + this.adjustedScale(tick) + ')';
				};
				this.textAnchor = 'start';
				this.x2 = this.innerTickSize * -sign;
				this.x1 = this.tickSpacing * -sign;
				this.dy = '.32em';
				break;
		}
		this.updateDims();
	}

	getTicks(): any {
		let ticks;
		let maxTicks = this.getMaxTicks();

		if (this.tickValues) {
			ticks = this.tickValues;
		} else if (this.scale.ticks) {
			ticks = this.scale.ticks.apply(this.scale, this.tickArguments);
			if (this.minInterval && ticks.length > 1) {
				let tickInterval = ticks[1] - ticks[0];
				let tickcount = this.tickArguments ? this.tickArguments[0] : maxTicks;
				tickcount--;
				while (tickInterval > 0 && tickInterval < this.minInterval) {
					ticks = this.scale.ticks.apply(this.scale, [tickcount]);
					if (ticks.length < 2) {
						tickInterval = this.minInterval;
					} else {
						tickInterval = ticks[1] - ticks[0];
					}
					tickcount--;
				}
			}
			if (ticks.length > maxTicks) {
				if (this.tickArguments) {
					this.tickArguments[0] = Math.min(this.tickArguments[0], maxTicks);
				} else {
					this.tickArguments = [maxTicks];
				}
				ticks = this.scale.ticks.apply(this.scale, this.tickArguments);
			}
		} else {
			ticks = this.scale.domain();
			ticks = reduceTicks(ticks, maxTicks);
		}
		return ticks;
	}

	getMaxTicks(): number {
		let tickHeight = 20;
		return Math.floor(this.height / tickHeight);
	}

	gridLineTransform(): string {
		return `translate(5,0)`;
	}

}
