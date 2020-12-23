import {Utils} from './utils';
import {ISearchFilterDef, ISearchFilterDefType} from '../app.interfaces';

export const TenderFilterDefs: Array<ISearchFilterDef> = [
	{
		id: 'buyers.name',
		name: 'Name',
		group: 'Buyer',
		field: 'buyers.name',
		type: ISearchFilterDefType.text,
		aggregation_field: 'buyers.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'buyers.address.city',
		name: 'City',
		group: 'Buyer',
		field: 'buyers.address.city',
		type: ISearchFilterDefType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'buyers.address.country',
		name: 'Country',
		group: 'Buyer',
		field: 'buyers.address.country',
		type: ISearchFilterDefType.select,
		valueTranslater: (value, i18n) => {
			return i18n.expandCountry(value);
		},
		size: 30
	},
	{
		id: 'buyers.buyerType',
		name: 'Type',
		group: 'Buyer',
		field: 'buyers.buyerType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined
	},
	{
		id: 'lots.bids.bidders.name',
		name: 'Name',
		group: 'Supplier',
		field: 'lots.bids.bidders.name',
		type: ISearchFilterDefType.text,
		aggregation_field: 'lots.bids.bidders.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'lots.bids.bidders.address.country',
		name: 'Country',
		group: 'Supplier',
		field: 'lots.bids.bidders.address.country',
		type: ISearchFilterDefType.select,
		valueTranslater: (value, i18n) => {
			return i18n.expandCountry(value);
		},
		size: 30
	},
	{
		id: 'lots.bidsCount',
		name: 'Bids Count',
		group: 'Lots',
		field: 'lots.bidsCount',
		type: ISearchFilterDefType.value
	},
	{
		id: 'title',
		name: 'Title',
		group: 'Tender',
		field: 'title',
		type: ISearchFilterDefType.text,
		aggregation_field: 'title.stopped',
		aggregation_type: ISearchFilterDefType.term,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'country',
		name: 'Country',
		group: 'Tender',
		field: 'country',
		type: ISearchFilterDefType.select,
		valueTranslater: (value, i18n) => {
			return i18n.expandCountry(value);
		},
		size: 30
	},

	{
		id: 'procedureType',
		name: 'Procedure Type',
		group: 'Tender',
		field: 'procedureType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'supplyType',
		name: 'Supply Type',
		group: 'Tender',
		field: 'supplyType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined
	},
	{
		id: 'publications.source',
		name: 'Source',
		group: 'Tender Meta Data',
		field: 'publications.source',
		type: ISearchFilterDefType.select,
		size: 30
	},
	{
		id: 'ot.cpv',
		name: 'Main CPV',
		group: 'Sector',
		field: 'ot.cpv',
		type: ISearchFilterDefType.text,
	},
	{
		id: 'cpvs.code',
		name: 'CPV Codes',
		group: 'Sector',
		field: 'cpvs.code',
		type: ISearchFilterDefType.text,
	},
	{
		id: 'ot.cpv.divisions',
		name: 'Main CPV (Divisions)',
		group: 'Sector',
		field: 'ot.cpv.divisions',
		type: ISearchFilterDefType.select
	},
	{
		id: 'ot.cpv.groups',
		name: 'Main CPV (Groups)',
		group: 'Sector',
		field: 'ot.cpv.groups',
		type: ISearchFilterDefType.select
	},
	{
		id: 'ot.cpv.categories',
		name: 'Main CPV (Categories)',
		group: 'Sector',
		field: 'ot.cpv.categories',
		type: ISearchFilterDefType.select
	},
	{
		id: 'ot.cpv.full',
		name: 'Main CPV (Full)',
		group: 'Sector',
		field: 'ot.cpv',
		type: ISearchFilterDefType.select
	},
	{
		id: 'indicators.score_co',
		name: 'Good Procurement',
		group: 'Score',
		field: 'ot.scores.value',
		subrequest: {
			'ot.scores.type': 'TENDER'
		},
		type: ISearchFilterDefType.range,
	},
	{
		id: 'indicators.score_pi',
		name: 'Integrity',
		group: 'Score',
		field: 'ot.scores.value',
		subrequest: {
			'ot.scores.type': 'INTEGRITY'
		},
		type: ISearchFilterDefType.range,
	},
	{
		id: 'indicators.score_ti',
		name: 'Transparency',
		group: 'Score',
		field: 'ot.scores.value',
		subrequest: {
			'ot.scores.type': 'TRANSPARENCY'
		},
		type: ISearchFilterDefType.range,
	},
	{
		id: 'estimatedPrice.netAmountEur',
		name: 'Estimated Price UGX',
		group: 'Prices',
		field: 'estimatedPrice.netAmountEur',
		type: ISearchFilterDefType.value
	},
	{
		id: 'lots.bids.price.netAmountEur',
		name: 'Bid Price UGX',
		group: 'Prices',
		field: 'lots.bids.price.netAmountEur',
		type: ISearchFilterDefType.value
	},
	{
		id: 'lots.awardDecisionDate.year',
		name: 'Award Decision Year',
		group: 'Dates',
		field: 'lots.awardDecisionDate',
		type: ISearchFilterDefType.years,
	},
	{
		id: 'lots.awardDecisionDate',
		name: 'Award Decision Date',
		group: 'Dates',
		field: 'lots.awardDecisionDate',
		type: ISearchFilterDefType.date,
	},
	{
		id: 'estimatedCompletionDate.year',
		name: 'Estimated Completion Year',
		group: 'Dates',
		field: 'estimatedCompletionDate',
		type: ISearchFilterDefType.years,
	},
	{
		id: 'estimatedCompletionDate',
		name: 'Estimated Completion Date',
		group: 'Dates',
		field: 'estimatedCompletionDate',
		type: ISearchFilterDefType.date,
	},
	{
		id: 'estimatedStartDate.year',
		name: 'Estimated Start Year',
		group: 'Dates',
		field: 'estimatedStartDate',
		type: ISearchFilterDefType.years,
	},
	{
		id: 'estimatedStartDate',
		name: 'Estimated Start Date',
		group: 'Dates',
		field: 'estimatedStartDate',
		type: ISearchFilterDefType.date,
	},
	{
		id: 'publications.publicationDate',
		name: 'Call for tender date',
		group: 'Dates',
		field: 'publications.publicationDate',
		type: ISearchFilterDefType.date,
	},
	{
		id: 'bidDeadline',
		name: 'Bid deadline',
		group: 'Dates',
		field: 'bidDeadline',
		type: ISearchFilterDefType.date,
	},
];

export const CompanyFilterDefs: Array<ISearchFilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		field: 'body.name',
		group: 'Company',
		type: ISearchFilterDefType.text,
		aggregation_field: 'body.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'lots.bids.bidders.bidderType',
		name: 'Supplier Type',
		group: 'Supplier',
		field: 'body.bidderType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined
	},
];

export const AuthorityFilterDefs: Array<ISearchFilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		group: 'Authority',
		field: 'body.name',
		type: ISearchFilterDefType.text,
		aggregation_field: 'body.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'body.address.city',
		name: 'City',
		group: 'Authority',
		field: 'body.address.city',
		type: ISearchFilterDefType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'body.address.country',
		name: 'Country',
		group: 'Authority',
		field: 'body.address.country',
		valueTranslater: (value, i18n) => {
			return i18n.expandCountry(value);
		},
		type: ISearchFilterDefType.select,
		size: 30
	},
	{
		id: 'body.buyerType',
		name: 'Buyer Type',
		group: 'Authority',
		field: 'body.buyerType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	}
];

export function isSearchDef(filter: ISearchFilterDef) {
	return filter.type === ISearchFilterDefType.text || filter.type === ISearchFilterDefType.value || filter.type === ISearchFilterDefType.term
}

export function isFilterDef(filter: ISearchFilterDef) {
	return filter.type !== ISearchFilterDefType.value;
}
