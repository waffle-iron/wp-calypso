/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	getSiteStatsMaxPostsByDay,
	getSiteStatsForQuery,
	getSiteStatsParsedData,
	getSiteStatsPostStreakData,
	getSiteStatsPostsCountByDay,
	isRequestingSiteStatsForQuery
} from '../selectors';

describe( 'selectors', () => {
	beforeEach( () => {
		getSiteStatsPostStreakData.memoizedSelector.cache.clear();
		getSiteStatsMaxPostsByDay.memoizedSelector.cache.clear();
		getSiteStatsParsedData.memoizedSelector.cache.clear();
	} );

	describe( 'getSiteStatsParsedData()', () => {
		it( 'should return empty array if no data exists', () => {
			const data = getSiteStatsParsedData( {
				stats: {
					lists: {
						items: {}
					}
				}
			}, 2916284, 'statsPublicize', {} );

			expect( data ).to.eql( [] );
		} );

		it( 'should return the exact state data if no parser exists', () => {
			const data = getSiteStatsParsedData( {
				stats: {
					lists: {
						items: {
							2916284: {
								statsPublicizeNotReallyALegitName: {
									'[]': {
										fake: 'data'
									}
								}
							}
						}
					}
				}
			}, 2916284, 'statsPublicizeNotReallyALegitName', {} );

			expect( data ).to.eql( { fake: 'data' } );
		} );

		it( 'should utilize parser utility if it exists', () => {
			const data = getSiteStatsParsedData( {
				stats: {
					lists: {
						items: {
							2916284: {
								statsPublicize: {
									'[]': {
										services: [ {
											service: 'twitter',
											followers: 528
										}, {
											service: 'facebook',
											followers: 282
										} ]
									}
								}
							}
						}
					}
				}
			}, 2916284, 'statsPublicize', {} );

			expect( data ).to.eql( [
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

	describe( 'isRequestingSiteStatsForQuery()', () => {
		it( 'should return false if no request exists', () => {
			const requesting = isRequestingSiteStatsForQuery( {
				stats: {
					lists: {
						requesting: {}
					}
				}
			}, 2916284, 'statsStreak', {} );

			expect( requesting ).to.be.false;
		} );

		it( 'should return false if query is not requesting', () => {
			const requesting = isRequestingSiteStatsForQuery( {
				stats: {
					lists: {
						requesting: {
							2916284: {
								statsStreak: {
									'[["endDate","2016-06-01"],["startDate","2015-06-01"]]': false
								}
							}
						}
					}
				}
			}, 2916284, 'statsStreak', { startDate: '2015-06-01', endDate: '2016-06-01' } );

			expect( requesting ).to.be.false;
		} );

		it( 'should return true if query is in progress', () => {
			const requesting = isRequestingSiteStatsForQuery( {
				stats: {
					lists: {
						requesting: {
							2916284: {
								statsStreak: {
									'[["endDate","2016-06-01"],["startDate","2015-06-01"]]': true
								}
							}
						}
					}
				}
			}, 2916284, 'statsStreak', { startDate: '2015-06-01', endDate: '2016-06-01' } );

			expect( requesting ).to.be.true;
		} );
	} );

	describe( 'getSiteStatsForQuery()', () => {
		it( 'should return null if no matching query results exist', () => {
			const stats = getSiteStatsForQuery( {
				stats: {
					lists: {
						items: {}
					}
				}
			}, 2916284, 'statsStreak', {} );

			expect( stats ).to.be.null;
		} );

		it( 'should return matching stats', () => {
			const stats = getSiteStatsForQuery( {
				stats: {
					lists: {
						items: {
							2916284: {
								statsStreak: {
									'[["endDate","2016-06-01"],["startDate","2015-06-01"]]': {
										1461961382: 1,
										1464110402: 1,
										1464110448: 1
									}
								}
							}
						}
					}
				}
			}, 2916284, 'statsStreak', { startDate: '2015-06-01', endDate: '2016-06-01' } );

			expect( stats ).to.eql( {
				1461961382: 1,
				1464110402: 1,
				1464110448: 1
			} );
		} );
	} );

	describe( 'getSiteStatsPostStreakData()', () => {
		it( 'should return an empty object if no matching query results exist', () => {
			const stats = getSiteStatsPostStreakData( {
				stats: {
					lists: {
						items: {}
					}
				}
			}, 2916284, {} );

			expect( stats ).to.eql( {} );
		} );

		it( 'should return properly formatted data if matching data for query exists', () => {
			const stats = getSiteStatsPostStreakData( {
				stats: {
					lists: {
						items: {
							2916284: {
								statsStreak: {
									'[["endDate","2016-06-01"],["startDate","2015-06-01"]]': {
										streak: {},
										data: {
											1461961382: 1,
											1464110402: 1,
											1464110448: 1
										}
									}
								}
							}
						}
					}
				}
			}, 2916284, { startDate: '2015-06-01', endDate: '2016-06-01' } );

			expect( stats ).to.eql( {
				'2016-04-29': 1,
				'2016-05-24': 2
			} );
		} );
	} );

	describe( 'getSiteStatsMaxPostsByDay()', () => {
		it( 'should return null if no matching query results exist', () => {
			const stats = getSiteStatsMaxPostsByDay( {
				stats: {
					lists: {
						items: {}
					}
				}
			}, 2916284, {} );

			expect( stats ).to.be.null;
		} );

		it( 'should properly correct number of max posts grouped by day', () => {
			const stats = getSiteStatsMaxPostsByDay( {
				stats: {
					lists: {
						items: {
							2916284: {
								statsStreak: {
									'[["endDate","2016-06-01"],["startDate","2015-06-01"]]': {
										data: {
											1461961382: 1,
											1464110402: 1,
											1464110448: 1
										}
									}
								}
							}
						}
					}
				}
			}, 2916284, { startDate: '2015-06-01', endDate: '2016-06-01' } );

			expect( stats ).to.eql( 2 );
		} );

		it( 'should compare numerically rather than lexically', () => {
			const stats = getSiteStatsMaxPostsByDay( {
				stats: {
					lists: {
						items: {
							2916284: {
								statsStreak: {
									'[["endDate","2016-06-01"],["startDate","2015-06-01"]]': {
										data: {
											1461961382: 12,
											1464110402: 2
										}
									}
								}
							}
						}
					}
				}
			}, 2916284, { startDate: '2015-06-01', endDate: '2016-06-01' } );

			expect( stats ).to.eql( 12 );
		} );
	} );

	describe( 'getSiteStatsPostsCountByDay()', () => {
		it( 'should return null if no matching query results exist', () => {
			const stats = getSiteStatsPostsCountByDay( {
				stats: {
					lists: {
						items: {}
					}
				}
			}, 2916284, {}, '2016-06-01' );

			expect( stats ).to.be.null;
		} );

		it( 'should properly correct number of max posts for a day', () => {
			const stats = getSiteStatsPostsCountByDay( {
				stats: {
					lists: {
						items: {
							2916284: {
								statsStreak: {
									'[["endDate","2016-06-01"],["startDate","2015-06-01"]]': {
										data: {
											1461961382: 1,
											1464110402: 1,
											1464110448: 1
										}
									}
								}
							}
						}
					}
				}
			}, 2916284, { startDate: '2015-06-01', endDate: '2016-06-01' }, '2016-05-24' );

			expect( stats ).to.eql( 2 );
		} );
	} );
} );
