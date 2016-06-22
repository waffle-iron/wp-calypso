/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */

export default React.createClass( {
	render: function() {
		const classes = classNames( 'first-viewable', {
			'first-view-active': this.props.firstViewActive
		} );

		return (
			<div className={ classes }>
				{ this.props.children }
			</div>
		);
	}
} );
