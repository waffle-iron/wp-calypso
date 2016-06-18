/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	getSerializedStatsQuery,
	statsPublicize
} from '../utils';

describe( 'utils', () => {
	describe( 'getSerializedStatsQuery()', () => {
		it( 'should return a JSON string of a query', () => {
			const serializedQuery = getSerializedStatsQuery( {
				startDate: '2016-06-01',
				endDate: '2016-07-01'
			} );

			expect( serializedQuery ).to.equal( '[["endDate","2016-07-01"],["startDate","2016-06-01"]]' );
		} );

		it( 'should return the same JSON string of a query regardless of query object order', () => {
			const serializedQuery = getSerializedStatsQuery( {
				startDate: '2016-06-01',
				endDate: '2016-07-01'
			} );

			const serializedQueryTwo = getSerializedStatsQuery( {
				endDate: '2016-07-01',
				startDate: '2016-06-01'
			} );

			expect( serializedQuery ).to.eql( serializedQueryTwo );
		} );
	} );

	describe( 'statsPublicize()', () => {
		it( 'should return an empty array if not data is passed', () => {
			const parsedData = statsPublicize();

			expect( parsedData ).to.eql( [] );
		} );

		it( 'should return an empty array if not data has no services attribute', () => {
			const parsedData = statsPublicize( { bad: [] } );

			expect( parsedData ).to.eql( [] );
		} );

		it( 'should return an a properly parsed services array', () => {
			const parsedData = statsPublicize( {
				services: [ {
					service: 'twitter',
					followers: 528
				}, {
					service: 'facebook',
					followers: 282
				} ]
			} );

			expect( parsedData ).to.eql( [
				{
					label: 'Twitter',
					icon: 'https://secure.gravatar.com/blavatar/7905d1c4e12c54933a44d19fcd5f9356?s=48',
					value: 528
				}, {
					label: 'Facebook',
					icon: 'https://secure.gravatar.com/blavatar/2343ec78a04c6ea9d80806345d31fd78?s=48',
					value: 282
				}
			] );
		} );
	} );
} );
