/**
 * External dependencies
 */
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';

/**
 * Returns a serialized stats query, used as the key in the
 * `state.stats.lists.items` and `state.stats.lists.requesting` state objects.
 *
 * @param  {Object} query    Stats query
 * @return {String}          Serialized stats query
 */
export function getSerializedStatsQuery( query = {} ) {
	return JSON.stringify( sortBy( toPairs( query ), ( pair ) => pair[ 0 ] ) );
}

/**
 * Returns a parsed statsPublicize array, ready for use in stats-module
 *
 * @param  {Object} data Stats query
 * @return {Array}       Parsed publicize data array
 */
export function statsPublicize( data = {} ) {
	let response = [];
	const serviceInfo = {
		twitter: {
			label: 'Twitter',
			icon: 'https://secure.gravatar.com/blavatar/7905d1c4e12c54933a44d19fcd5f9356?s=48'
		},
		facebook: {
			label: 'Facebook',
			icon: 'https://secure.gravatar.com/blavatar/2343ec78a04c6ea9d80806345d31fd78?s=48'
		},
		tumblr: {
			label: 'Tumblr',
			icon: 'https://secure.gravatar.com/blavatar/84314f01e87cb656ba5f382d22d85134?s=48'
		},
		google_plus: {
			label: 'Google+',
			icon: 'https://secure.gravatar.com/blavatar/4a4788c1dfc396b1f86355b274cc26b3?s=48'
		},
		linkedin: {
			label: 'LinkedIn',
			icon: 'https://secure.gravatar.com/blavatar/f54db463750940e0e7f7630fe327845e?s=48'
		},
		path: {
			label: 'Path',
			icon: 'https://secure.gravatar.com/blavatar/3a03c8ce5bf1271fb3760bb6e79b02c1?s=48'
		}
	};

	if ( data && data.services ) {
		response = data.services.map( function( service ) {
			const info = serviceInfo[ service.service ];
			return {
				label: info.label,
				value: service.followers,
				icon: info.icon
			};
		} );
	}

	return response;
}
