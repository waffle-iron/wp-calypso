/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	getCurrentUser,
	getCurrentUserLocale,
	canCurrentUser,
	getActionLog,
} from '../selectors';
import {
	GUIDED_TOUR_UPDATE,
	SET_ROUTE,
} from 'state/action-types';

describe( 'selectors', () => {
	describe( '#getCurrentUser()', () => {
		it( 'should return null if no current user', () => {
			const selected = getCurrentUser( {
				currentUser: {
					id: null
				}
			} );

			expect( selected ).to.be.null;
		} );

		it( 'should return the object for the current user', () => {
			const selected = getCurrentUser( {
				users: {
					items: {
						73705554: { ID: 73705554, login: 'testonesite2014' }
					}
				},
				currentUser: {
					id: 73705554
				}
			} );

			expect( selected ).to.eql( { ID: 73705554, login: 'testonesite2014' } );
		} );
	} );

	describe( '#getCurrentUserLocale', () => {
		it( 'should return null if the current user is not set', () => {
			const locale = getCurrentUserLocale( {
				currentUser: {
					id: null
				}
			} );

			expect( locale ).to.be.null;
		} );

		it( 'should return null if the current user locale slug is not set', () => {
			const locale = getCurrentUserLocale( {
				users: {
					items: {
						73705554: { ID: 73705554, login: 'testonesite2014' }
					}
				},
				currentUser: {
					id: 73705554
				}
			} );

			expect( locale ).to.be.null;
		} );

		it( 'should return the current user locale slug', () => {
			const locale = getCurrentUserLocale( {
				users: {
					items: {
						73705554: { ID: 73705554, login: 'testonesite2014', localeSlug: 'fr' }
					}
				},
				currentUser: {
					id: 73705554
				}
			} );

			expect( locale ).to.equal( 'fr' );
		} );
	} );

	describe( 'canCurrentUser', () => {
		it( 'should return null if the site is not known', () => {
			const isCapable = canCurrentUser( {
				currentUser: {
					capabilities: {}
				}
			}, 2916284, 'manage_options' );

			expect( isCapable ).to.be.null;
		} );

		it( 'should return the value for the specified capability', () => {
			const isCapable = canCurrentUser( {
				currentUser: {
					capabilities: {
						2916284: {
							manage_options: false
						}
					}
				}
			}, 2916284, 'manage_options' );

			expect( isCapable ).to.be.false;
		} );

		it( 'should return null if the capability is invalid', () => {
			const isCapable = canCurrentUser( {
				currentUser: {
					capabilities: {
						2916284: {
							manage_options: false
						}
					}
				}
			}, 2916284, 'manage_foo' );

			expect( isCapable ).to.be.null;
		} );
	} );

	describe( 'actionLog', () => {
		it( 'should initially return one empty list', () => {
			const log = getActionLog( {
				currentUser: {
					actionLog: {
						permanent: [],
						temporary: [],
					}
				}
			} );

			expect( log ).to.eql( [] );
		} );

		it( 'should merge from both queues', () => {
			const permanent = [
				{
					type: GUIDED_TOUR_UPDATE,
					shouldShow: false,
				},
			];
			const temporary = [
				{
					type: SET_ROUTE,
					path: '/menus/77203074',
				}
			];
			const log = getActionLog( {
				currentUser: {
					actionLog: {
						permanent,
						temporary,
					}
				}
			} );

			expect( log ).to.eql( [ ...permanent, ...temporary ] );
		} );

		it( 'should preserve object references whenever possible', () => {
			const state = {
				currentUser: {
					actionLog: {
						permanent: [],
						temporary: [
							{
								type: SET_ROUTE,
								path: '/menus/77203074',
							}
						],
					}
				}
			};
			const log1 = getActionLog( state );
			const log2 = getActionLog( state );

			expect( log1 ).to.equal( log2 );
		} );
	} );
} );
