/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/button';

export default React.createClass( {
	render: function() {
		return (
			<div>
				{ this.props.children }

				<Button onClick={ this.onClick }>Got it!</Button>
			</div>
		);
	},

	onClick: function() {
		if ( this.props.onDismiss ) {
			this.props.onDismiss();
		}
	}
} );
