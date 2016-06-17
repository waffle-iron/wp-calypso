/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Accordion from 'components/accordion';
import AccordionSection from 'components/accordion/section';
import CountedTextarea from 'components/forms/counted-textarea';
import Gridicon from 'components/gridicon';
import InfoPopover from 'components/info-popover';
import TokenField from 'components/token-field';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSiteSlug } from 'state/sites/selectors';

class EditorSeoAccordion extends Component {
	render() {
		const { translate } = this.props;
		// Temporary placeholder chips for design review
		const sampleChips = [ 'Post Title', 'Site Title' ];

		return (
			<Accordion
				title={ translate( 'Advanced SEO' ) }
				icon={ <Gridicon icon="search" /> }
				className="editor-seo-accordion"
			>
				<AccordionSection>
					<span className="editor-drawer__label-text">
						{ translate( 'Meta Title' ) }
						<InfoPopover position="top left">
							{ translate(
								'The format for the title as it will appear in search engines. ' +
								'{{a}}Edit{{/a}}',
								{
									components: {
										a: <a target="_blank" href={ this.props.siteSlug } />
									}
								}
							) }
						</InfoPopover>
					</span>
					<TokenField value={ sampleChips } disabled />
				</AccordionSection>
				<AccordionSection>
					<span className="editor-drawer__label-text">
						{ translate( 'Meta Description' ) }
						<InfoPopover position="top left">
							{ translate(
								'Craft a description of your post in about 160 characters. ' +
								'This description can be used in search engine results.'
							) }
						</InfoPopover>
					</span>
					<CountedTextarea
						maxLength="300"
						acceptableLength={ 159 }
						placeholder={ translate( 'Write a description…' ) }
						aria-label={ translate( 'Write a description…' ) }
					/>
				</AccordionSection>
			</Accordion>
		);
	}
}

EditorSeoAccordion.propTypes = {
	translate: PropTypes.func,
	siteSlug: PropTypes.string
};

const mapStateToProps = ( state ) => ( {
	siteSlug: getSiteSlug( state, getSelectedSiteId( state ) )
} );

export default connect( mapStateToProps )( localize( EditorSeoAccordion ) );
