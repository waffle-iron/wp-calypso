/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import SectionHeader from 'components/section-header';

class AccountInfo extends Component {
	render() {
		return (
			<div>
				<SectionHeader label={ this.props.translate( 'Account Info' ) } />
				<Card>
					Account info goes here!
				</Card>
			</div>
		);
	}
}

export default AccountInfo;
