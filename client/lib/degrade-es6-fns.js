[ 'keys', 'entries', 'values', 'findIndex', 'fill', 'find' ].map( function( key ) {
	if ( Array.prototype.hasOwnProperty( key ) ) {
		delete Array.prototype[ key ];
	}
} );
[ 'codePointAt', 'normalize', 'repeat', 'startsWith', 'endsWith', 'includes' ].map( function( key ) {
	if ( String.prototype.hasOwnProperty( key ) ) {
		delete String.prototype[ key ];
	}
} );
[ 'flags' ].map( function( key ) {
	if ( RegExp.prototype.hasOwnProperty( key ) ) {
		delete RegExp.prototype[ key ];
	}
} );
