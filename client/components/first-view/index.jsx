/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import RootChild from 'components/root-child';

export default React.createClass( {
	componentDidMount() {
		if ( this.props.active ) {
			document.documentElement.classList.add( 'no-scroll' );
		}
	},

	componentDidUpdate( prevProps ) {
		if ( this.props.active ) {
			document.documentElement.classList.add( 'no-scroll' );
		} else {
			document.documentElement.classList.remove( 'no-scroll' );
		}
	},

	componentWillUnmount() {
		document.documentElement.classList.remove( 'no-scroll' );
	},

	render: function() {
		const classes = classNames( 'wp-content', 'first-view', {
			active: this.props.active
		} );

		return (
			<RootChild className={ classes }>
				<div className="first-view__content">
					<div>
						{ this.props.children }
					</div>

					<Button onClick={ this.onClick }>Got it!</Button>
				</div>
			</RootChild>
		);
	},

	onClick: function() {
		if ( this.props.onDismiss ) {
			this.props.onDismiss();
		}
	}
} );
