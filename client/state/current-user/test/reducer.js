/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import take from 'lodash/take';

/**
 * Internal dependencies
 */
import { useSandbox, useFakeTimers } from 'test/helpers/use-sinon';
import {
	ACTION_LOG_RECEIVE,
	ACTION_LOG_RESET,
	CURRENT_USER_ID_SET,
	GUIDED_TOUR_UPDATE,
	SET_ROUTE,
	SITE_RECEIVE,
	SITES_RECEIVE,
	DESERIALIZE,
	SERIALIZE
} from 'state/action-types';
import reducer, { id, capabilities, actionLog } from '../reducer';

describe( 'reducer', () => {
	useSandbox( ( sandbox ) => {
		sandbox.stub( console, 'warn' );
	} );

	it( 'should include expected keys in return value', () => {
		expect( reducer( undefined, {} ) ).to.have.keys( [
			'id',
			'capabilities',
			'actionLog',
		] );
	} );

	describe( '#id()', () => {
		it( 'should default to null', () => {
			const state = id( undefined, {} );

			expect( state ).to.be.null;
		} );

		it( 'should set the current user ID', () => {
			const state = id( null, {
				type: CURRENT_USER_ID_SET,
				userId: 73705554
			} );

			expect( state ).to.equal( 73705554 );
		} );

		it( 'should validate ID is positive', () => {
			const state = id( -1, {
				type: DESERIALIZE
			} );

			expect( state ).to.equal( null );
		} );

		it( 'should validate ID is a number', () => {
			const state = id( 'foobar', {
				type: DESERIALIZE
			} );

			expect( state ).to.equal( null );
		} );

		it( 'returns valid ID', () => {
			const state = id( 73705554, {
				type: DESERIALIZE
			} );

			expect( state ).to.equal( 73705554 );
		} );

		it( 'will SERIALIZE current user', () => {
			const state = id( 73705554, {
				type: SERIALIZE
			} );

			expect( state ).to.equal( 73705554 );
		} );
	} );

	describe( 'capabilities()', () => {
		it( 'should default to an empty object', () => {
			const state = capabilities( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should track capabilities by single received site', () => {
			const state = capabilities( undefined, {
				type: SITE_RECEIVE,
				site: {
					ID: 2916284,
					capabilities: {
						manage_options: false
					}
				}
			} );

			expect( state ).to.eql( {
				2916284: {
					manage_options: false
				}
			} );
		} );

		it( 'should accumulate capabilities by received site', () => {
			const original = deepFreeze( {
				2916284: {
					manage_options: false
				}
			} );
			const state = capabilities( original, {
				type: SITE_RECEIVE,
				site: {
					ID: 77203074,
					capabilities: {
						manage_options: true
					}
				}
			} );

			expect( state ).to.eql( {
				2916284: {
					manage_options: false
				},
				77203074: {
					manage_options: true
				}
			} );
		} );

		it( 'should ignore received site if missing capabilities', () => {
			const state = capabilities( undefined, {
				type: SITE_RECEIVE,
				site: {
					ID: 2916284
				}
			} );

			expect( state ).to.eql( {} );
		} );

		it( 'should track capabilities by multiple received sites', () => {
			const state = capabilities( undefined, {
				type: SITES_RECEIVE,
				sites: [ {
					ID: 2916284,
					capabilities: {
						manage_options: false
					}
				} ]
			} );

			expect( state ).to.eql( {
				2916284: {
					manage_options: false
				}
			} );
		} );

		it( 'should ignore received sites if missing capabilities', () => {
			const state = capabilities( undefined, {
				type: SITES_RECEIVE,
				sites: [ {
					ID: 2916284
				} ]
			} );

			expect( state ).to.eql( {} );
		} );

		it( 'should persist state', () => {
			const original = deepFreeze( {
				2916284: {
					manage_options: false
				}
			} );
			const state = capabilities( original, {
				type: SERIALIZE
			} );

			expect( state ).to.equal( original );
		} );

		it( 'should restore valid persisted state', () => {
			const original = deepFreeze( {
				2916284: {
					manage_options: false
				}
			} );
			const state = capabilities( original, {
				type: DESERIALIZE
			} );

			expect( state ).to.equal( original );
		} );

		it( 'should not restore invalid persisted state', () => {
			const original = deepFreeze( {
				BAD2916284: {
					manage_options: false
				}
			} );
			const state = capabilities( original, {
				type: DESERIALIZE
			} );

			expect( state ).to.eql( {} );
		} );
	} );

	describe( 'actionLog()', () => {
		useFakeTimers( 1337 );

		it( 'should default to an object of two empty lists', () => {
			const state = actionLog( undefined, {} );

			expect( state ).to.eql( {
				permanent: [],
				temporary: [],
			} );
		} );

		it( 'should add regular actions only to the temporary queue', () => {
			const action = {
				type: SET_ROUTE,
				path: '/menus/77203074',
			};
			const state = actionLog( undefined, action );

			expect( state ).to.eql( {
				permanent: [],
				temporary: [ { ...action, timestamp: 1337 } ],
			} );
		} );

		it( 'should add specific actions to the permanent queue too', () => {
			const action = {
				type: GUIDED_TOUR_UPDATE,
				shouldShow: false,
				finished: true,
				tour: 'main',
			};
			const state = actionLog( undefined, action );

			expect( state ).to.eql( {
				permanent: [ { ...action, timestamp: 1337 } ],
				temporary: [ { ...action, timestamp: 1337 } ],
			} );
		} );

		it( 'should add a batch of actions only to the permanent queue', () => {
			const actions = [
				{
					type: GUIDED_TOUR_UPDATE,
					shouldShow: false,
					finished: true,
					tour: 'main',
				},
				{
					type: GUIDED_TOUR_UPDATE,
					shouldShow: false,
					finished: false,
					tour: 'themes',
				},
			];
			const state = actionLog( undefined, {
				type: ACTION_LOG_RECEIVE,
				actions: actions,
			} );

			const timestampedActions = actions.map( action => ( {
				...action,
				timestamp: 1337,
			} ) );

			expect( state ).to.eql( {
				permanent: timestampedActions,
				temporary: [],
			} );
		} );

		it( 'should clear the permanent queue', () => {
			const actions = [
				{
					type: GUIDED_TOUR_UPDATE,
					shouldShow: false,
					finished: true,
					tour: 'main',
				},
				{
					type: GUIDED_TOUR_UPDATE,
					shouldShow: false,
					finished: false,
					tour: 'themes',
				},
				{
					type: SET_ROUTE,
					path: '/menus/77203074',
				},
			];
			const initialState = actions.reduce( actionLog, {} );
			const state = actionLog( initialState, {
				type: ACTION_LOG_RESET,
			} );

			const timestampedActions = actions.map( action => ( {
				...action,
				timestamp: 1337,
			} ) );

			expect( state ).to.eql( {
				permanent: [],
				temporary: timestampedActions,
			} );
		} );

		it( 'should persist only the permanent queue', () => {
			const actions = [
				{
					type: GUIDED_TOUR_UPDATE,
					shouldShow: false,
					finished: true,
					tour: 'main',
				},
				{
					type: GUIDED_TOUR_UPDATE,
					shouldShow: false,
					finished: false,
					tour: 'themes',
				},
				{
					type: SET_ROUTE,
					path: '/menus/77203074',
				},
			];
			const initialState = actions.reduce( actionLog, {} );
			const state = actionLog( initialState, {
				type: SERIALIZE,
			} );

			const timestampedActions = actions.map( action => ( {
				...action,
				timestamp: 1337,
			} ) );

			expect( state ).to.eql( {
				permanent: take( timestampedActions, 2 ),
				temporary: [],
			} );
		} );
	} );
} );
