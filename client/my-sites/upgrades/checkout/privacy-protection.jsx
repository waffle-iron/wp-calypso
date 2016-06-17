/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var cartItems = require( 'lib/cart-values' ).cartItems,
	PrivacyProtectionDialog = require( './privacy-protection-dialog' ),
	Card = require( 'components/card' ),
	Gridicon = require( 'components/gridicon' ),
	abtest = require( 'lib/abtest' ).abtest;

module.exports = React.createClass( {
	displayName: 'PrivacyProtection',

	handleDialogSelect: function( options, event ) {
		event.preventDefault();
		this.props.onDialogSelect( options );
	},

	handleButtonSelect: function( options, event ) {
		event.preventDefault();
		this.props.onButtonSelect( options );
	},

	handleDialogOpen: function() {
		this.props.onDialogOpen();
	},

	handleDialogClose: function() {
		this.props.onDialogClose();
	},

	getDomainRegistrations: function() {
		return cartItems.getDomainRegistrations( this.props.cart );
	},

	getFirstDomainToRegister: function() {
		var domainRegistration = this.getDomainRegistrations().shift();

		return domainRegistration.meta;
	},

	hasDomainPartOfPlan: function() {
		var cart = this.props.cart;
		return cart.has_bundle_credit || cartItems.hasPlan( cart );
	},

	getNumberOfDomainRegistrations: function() {
		return this.getDomainRegistrations().length;
	},

	getPrivacyProtectionCost: function() {
		var products = this.props.productsList.get();

		return products.private_whois.cost_display;
	},

	render: function() {
		const numberOfDomainRegistrations = this.getNumberOfDomainRegistrations(),
			hasOneFreePrivacy = this.hasDomainPartOfPlan() && numberOfDomainRegistrations === 1;
		let priceForPrivacyText,
			privacyText,
			freeWithPlan;

		priceForPrivacyText = this.translate(
			'%(cost)s per year',
			'%(cost)s per domain per year',
			{
				args: { cost: this.getPrivacyProtectionCost() },
				count: numberOfDomainRegistrations
			}
		);

		freeWithPlan = hasOneFreePrivacy &&
			<span className="checkout__privacy-protection-free-text" ref="subMessage">
				{ this.translate( 'Free with your plan' ) }
			</span>;

		privacyText = this.translate( "Privacy Protection hides your personal information in your domain's public records, to protect your identity and prevent spam." );

		if ( abtest( 'privacyCheckbox' ) === 'checkbox' ) {
			return (
				<div>
					<Card className="checkout__privacy-protection-checkbox">
						<input type="checkbox" onChange={ this.props.onCheckboxChange } checked={ this.props.isChecked } />
						<div className="privacy-protection-checkbox__description">
							<strong className="checkout__privacy-protection-checkbox-heading">{ this.translate( 'Please keep my information private.', { textOnly: true } ) }</strong>
							<p className={ 'checkout__privacy-protection-price-text' }>
								<span className={ ( hasOneFreePrivacy && 'free-with-plan' ) }>
									{ priceForPrivacyText }
								</span>
								{ freeWithPlan }
							</p>
							<p className="checkout__privacy-protection-checkbox-text">{ privacyText }</p>
							<a href="" onClick={ this.handleDialogOpen }>Learn more about Privacy Protection.</a>
						</div>
						<div>
							<Gridicon icon="lock" size={ 48 } />
						</div>
					</Card>
					<PrivacyProtectionDialog
						disabled={ this.props.disabled }
						domain={ this.getFirstDomainToRegister() }
						cost={ this.getPrivacyProtectionCost() }
						countriesList={ this.props.countriesList }
						fields={ this.props.fields }
						isVisible={ this.props.isDialogVisible }
						onSelect={ this.handleDialogSelect }
						onClose={ this.handleDialogClose } />
				</div>
			);
		}

		return (
			<div className="privacy-protection">
				<h6>{ this.translate(
					'Do you want {{link}}Privacy Protection{{/link}} for this domain?',
					'Do you want {{link}}Privacy Protection{{/link}} for these domains?',
					{
						count: numberOfDomainRegistrations,
						components: {
							link: <a href="" onClick={ this.handleDialogOpen } />
						}
					} ) }</h6>
				<section>
					<label>
						<strong>{ this.translate( 'Please keep my information private.', { textOnly: true } ) }</strong>
						<p>{ priceForPrivacyText }</p>
						<button
							type="submit"
							className="button is-primary"
							disabled={ this.props.disabled }
							onClick={ this.handleButtonSelect.bind( null, { addPrivacy: true } ) }>
							{ this.translate( 'Add Privacy Protection' ) }
						</button>
					</label>
					<label>
						<strong>{ this.translate( 'No thanks, public registration is fine.', { textOnly: true } ) }</strong>
						<p>{ this.translate(
							'Your contact information will be viewable when people make inquires about this domain in the public database.',
							'Your contact information will be viewable when people make inquires about these domains in the public database.',
							{
								count: numberOfDomainRegistrations
							}
						) }</p>
						<button
							className="button"
							disabled={ this.props.disabled }
							onClick={ this.handleButtonSelect.bind( null, { addPrivacy: false, skipPrivacyDialog: hasOneFreePrivacy } ) }>
							{ this.translate( 'Publish My Information' ) }
						</button>
					</label>
				</section>
				<PrivacyProtectionDialog
					disabled={ this.props.disabled }
					domain={ this.getFirstDomainToRegister() }
					cost={ this.getPrivacyProtectionCost() }
					countriesList={ this.props.countriesList }
					fields={ this.props.fields }
					isVisible={ this.props.isDialogVisible }
					onSelect={ this.handleDialogSelect }
					onClose={ this.handleDialogClose } />
			</div>
		);
	}
} );
