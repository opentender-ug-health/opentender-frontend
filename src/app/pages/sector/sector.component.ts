import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand, SearchCommandFilter} from '../../model/search';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {ISector, IStats, IStatsCounts, IStatsPcCpvs, IStatsLotsInYears, IStatsPrices, IStatsAuthorities, IStatsCompanies, ISectorStats, IStatsPcPricesLotsInYears} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'sector',
	templateUrl: 'sector.template.html'
})
export class SectorPage implements OnInit, OnDestroy {
	private sector: ISector;
	private parent_sectors: Array<ISector> = [];
	private loading: number = 0;
	private search_cmd: SearchCommand;
	private columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name'];
	private subscription: any;
	private viz: {
		subsectors: Array<{ sector: ISector; stats: IStats }>,
		top_companies: { absolute: IStatsCompanies, volume: IStatsCompanies },
		top_authorities: { absolute: IStatsAuthorities, volume: IStatsAuthorities },
		sums_finalPrice: IStatsPrices,
		histogram: IStatsPcPricesLotsInYears,
		cpvs_codes: IStatsPcCpvs,
		counts: IStatsCounts
	} = {
		subsectors: [],
		top_companies: null,
		top_authorities: null,
		sums_finalPrice: null,
		histogram: null,
		cpvs_codes: null,
		counts: null
	};
	private filter: {
		time?: {
			startYear: number;
			endYear: number;
			selectedStartYear: number;
			selectedEndYear: number;
		}
	} = {
		time: null
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private notify: NotifyService) {
	}

	ngOnInit(): void {
		let state = this.state.get('sector');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.api.getSectorStats({id: id}).subscribe(
				(result) => {
					this.display(result.data);
				},
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
				});
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.state.put('sector', {
			columnIds: this.columnIds
		});
	}

	onSliderChange(event) {
		if (!this.filter.time) {
			return;
		}
		this.filter.time.selectedStartYear = event.startValue;
		this.filter.time.selectedEndYear = event.endValue;
		this.visualize();
		this.search();
	}

	buildFilters() {
		let filters = [];
		if (this.filter.time && this.filter.time.selectedStartYear > 0 && this.filter.time.selectedEndYear > 0) {
			let yearFilter: SearchCommandFilter = {
				field: 'lots.awardDecisionDate',
				type: 'range',
				value: [this.filter.time.selectedStartYear, this.filter.time.selectedEndYear + 1],
			};
			filters.push(yearFilter);
		}
		return filters;
	}

	visualize() {
		if (!this.sector) {
			return;
		}
		let filters = this.buildFilters();
		this.loading++;
		this.api.getSectorStats({id: this.sector.id, filters: filters}).subscribe(
			(result) => this.displayStats(result.data.stats),
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	display(data: ISectorStats): void {
		this.sector = null;
		this.parent_sectors = [];
		if (!data) {
			return;
		}
		this.sector = data.sector;
		this.parent_sectors = data.parents || [];
		if (data.sector) {
			this.titleService.set(data.sector.name);
		}

		this.displayStats(data.stats);
		this.search();
	}

	displayStats(stats: IStats): void {
		if (!this.filter.time && stats.histogram_pc_lots_awardDecisionDate_finalPrices) {
			let startYear = 0;
			let endYear = 0;
			Object.keys(stats.histogram_pc_lots_awardDecisionDate_finalPrices).forEach((key) => {
				let year = parseInt(key, 10);
				startYear = startYear === 0 ? year : Math.min(year, startYear);
				endYear = endYear === 0 ? year : Math.max(year, endYear);
			});
			this.filter.time = {
				startYear, endYear,
				selectedStartYear: startYear,
				selectedEndYear: endYear
			};
		}
		let viz = {
			subsectors: null,
			top_authorities: null,
			top_companies: null,
			sums_finalPrice: null,
			cpvs_codes: null,
			histogram: null,
			counts: null
		};
		if (!stats) {
			this.viz = viz;
			return;
		}
		viz.cpvs_codes = null;
		viz.histogram = stats.histogram_pc_lots_awardDecisionDate_finalPrices;
		viz.counts = stats.count_lots_bids;
		viz.sums_finalPrice = stats.sums_finalPrice;
		viz.top_companies = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.top_authorities = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		viz.subsectors = stats.sectors_stats;

		if (viz.subsectors) {
			viz.cpvs_codes = {};
			viz.subsectors.forEach(sub => {
				viz.cpvs_codes[sub.sector.id] = {
					name: sub.sector.name, value: sub.sector.value, percent: 5, total: 100
				};
			});
		}

		this.viz = viz;
	}

	search() {
		if (!this.sector) {
			return;
		}
		let filters = this.buildFilters();
		let subfilter: SearchCommandFilter = {
			field: 'cpvs.isMain',
			type: 'term',
			value: [true]
		};
		let filter: SearchCommandFilter = {
			field: this.sector.level ? 'cpvs.code.' + this.sector.level : 'cpvs.code',
			type: 'term',
			value: [this.sector.id],
			and: [subfilter]
		};
		filters.push(filter);
		let search_cmd = new SearchCommand();
		search_cmd.filters = filters;
		this.search_cmd = search_cmd;
	}

	searchChange(data) {
	}

}
