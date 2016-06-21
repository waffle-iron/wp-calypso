/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import FirstView from './first-view';

export default React.createClass( {
	propTypes: {
		children: function( props, propName, componentName ) {
			const children = React.Children.toArray( props[ propName ] );

			if ( children.length !== 2 ) {
				return new Error( 'TODO: Error:' + componentName );
			}

			if ( children[ 0 ].type !== FirstView ) {
				return new Error( 'TODO: Error: ' + componentName );
			}
		}
	},

	getInitialState: function() {
		return {
			showFirstView: this.props.initialShowFirstView
		};
	},

	render: function() {
		const children = React.Children.toArray( this.props.children );
		const firstView = React.cloneElement( children[ 0 ], {
			onDismiss: ( function() {
				this.showMainView();
			} ).bind( this )
		} );
		const mainView = React.cloneElement( children[ 1 ] );

		const firstViewContainerClasses = classNames( 'first-view', {
			active: this.state.showFirstView
		} );

		const mainViewContainerClasses = classNames( 'first-view-main-view', {
			inactive: this.state.showFirstView
		} );

		return (
			<div className="main main-column first-view-wrapper" role="main">
				<div ref="firstViewContainer" className={ firstViewContainerClasses }>
					{ firstView }
				</div>
				<div ref="mainViewContainer" className={ mainViewContainerClasses }>
					{ mainView }
				</div>
			</div>
		);
	},

	showMainView: function() {
		this.setState( {
			showFirstView: false
		} );
	}
} );
