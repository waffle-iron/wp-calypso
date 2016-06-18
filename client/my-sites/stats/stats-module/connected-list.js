/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ErrorPanel from '../stats-error';
import StatsList from '../stats-list';
import StatsListLegend from '../stats-list/legend';
import DatePicker from '../stats-date-picker';
import Card from 'components/card';
import StatsModulePlaceholder from './placeholder';
import SectionHeader from 'components/section-header';
import QuerySiteStats from 'components/data/query-site-stats';
import { getSelectedSite } from 'state/ui/selectors';
import {
	isRequestingSiteStatsForQuery,
	getSiteStatsParsedData
} from 'state/stats/lists/selectors';

const StatsConnectedModule = React.createClass( {
	propTypes: {
		summary: PropTypes.bool,
		moduleStrings: PropTypes.object,
		period: PropTypes.object,
		path: PropTypes.string,
		siteSlug: PropTypes.string,
		siteId: PropTypes.number,
		date: PropTypes.string,
		data: PropTypes.array,
		query: PropTypes.object,
		statType: PropTypes.string,
		showSummaryLink: PropTypes.bool
	},

	getDefaultProps() {
		return {
			showSummaryLink: false,
			query: {}
		};
	},

	getModuleLabel() {
		if ( ! this.props.summary ) {
			return this.props.moduleStrings.title;
		}

		return ( <DatePicker period={ this.props.period.period } date={ this.props.period.startOf } summary={ true } /> );
	},

	getHref() {
		const { summary, period, path, siteSlug, date } = this.props;

		// Some modules do not have view all abilities
		if ( ! summary && period && path && siteSlug ) {
			return '/stats/' + period.period + '/' + path + '/' + siteSlug + '?startDate=' + date;
		}

		return null;
	},

	renderSummaryLink() {
		const { summary, showSummaryLink } = this.props;
		if ( summary || ! showSummaryLink ) {
			return null;
		}

		return (
			<div key="view-all" className="module-expand">
				<a href={ this.getHref() }>
					{ this.translate( 'View All', { context: 'Stats: Button label to expand a panel' } ) }<span className="right"></span>
				</a>
			</div>
		);
	},

	render() {
		const {
			className,
			summary,
			siteId,
			path,
			data,
			moduleStrings,
			requesting,
			statType,
			query
		} = this.props;

		const noData = (
			data &&
			! requesting &&
			! data.length
		);

		// Only show loading indicators when nothing is in state tree, and request in-flight
		const isLoading = requesting && ! ( data && data.length );

		// TODO: Support error state in redux store
		const hasError = false;

		const cardClasses = classNames(
			'stats-module',
			{
				'is-loading': isLoading,
				'has-no-data': noData,
				'is-showing-error': noData
			}
		);

		return (
			<div>
				{ siteId && statType && <QuerySiteStats statType={ statType } siteId={ siteId } query={ query } /> }
				<SectionHeader label={ this.getModuleLabel() } href={ ! summary ? this.getHref() : null } />
				<Card compact className={ cardClasses }>
					<div className={ className }>
						<div className="module-content">
							{ noData && <ErrorPanel className="is-empty-message" message={ moduleStrings.empty } /> }
							{ hasError && <ErrorPanel className={ 'network-error' } /> }
							<StatsListLegend value={ moduleStrings.value } label={ moduleStrings.item } />
							<StatsModulePlaceholder isLoading={ isLoading } />
							<StatsList moduleName={ path } data={ data } />
						</div>
					</div>
					{ this.renderSummaryLink() }
				</Card>
			</div>

		);
	}
} );

export default connect( ( state, ownProps ) => {
	const site = getSelectedSite( state );
	const siteId = site ? site.ID : 0;
	const { statType, query } = ownProps;

	return {
		requesting: isRequestingSiteStatsForQuery( state, siteId, statType, query ),
		siteSlug: site ? site.slug : '',
		data: getSiteStatsParsedData( state, siteId, statType, query ),
		siteId
	};
} )( StatsConnectedModule );
