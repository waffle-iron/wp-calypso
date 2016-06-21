import React, { Component, PropTypes } from 'react';
import compact from 'lodash/compact';
import get from 'lodash/get';
import has from 'lodash/has';
import identity from 'lodash/identity';
import isString from 'lodash/isString';
import split from 'lodash/split';
import { connect } from 'react-redux';

import SegmentedControl from 'components/segmented-control';
import TokenField from 'components/token-field';
import { localize } from 'i18n-calypso';

const titleTypes = translate => [
	{ value: 'frontPage', label: translate( 'Front Page' ) },
	{ value: 'posts', label: translate( 'Posts' ) },
	{ value: 'pages', label: translate( 'Pages' ) },
	{ value: 'groups', label: translate( 'Categories & Tags' ) },
	{ value: 'archives', label: translate( 'Archives' ) }
];

const tokenMap = {
	frontPage: translate => ( {
		[ translate( 'Site Name' ) ]: '%site_name%',
		[ translate( 'Tagline' ) ]: '%tagline%'
	} ),
	posts: translate => ( {
		[ translate( 'Site Name' ) ]: '%site_name%',
		[ translate( 'Tagline' ) ]: '%tagline%',
		[ translate( 'Post Title' ) ]: '%post_title%'
	} ),
	pages: translate => ( {
		[ translate( 'Site Name' ) ]: '%site_name%',
		[ translate( 'Tagline' ) ]: '%tagline%',
		[ translate( 'Page Title' ) ]: '%page_title%'
	} ),
	groups: translate => ( {
		[ translate( 'Site Name' )]: '%site_name%',
		[ translate( 'Tagline' ) ]: '%tagline%',
		[ translate( 'Category/Tag Name' ) ]: '%group_title%'
	} ),
	archives: translate => ( {
		[ translate( 'Site Name' ) ]: '%site_name%',
		[ translate( 'Tagline' ) ]: '%tagline%',
		[ translate( 'Date' ) ]: '%date%'
	} )
};

const formatToValues = format => compact( split( format, /(%[a-zA-Z_]+%)/ ) );

const tokensToString = tokens =>
	tokens
		.map( t => get( tokenMap, t, t.value ) )
		.join( '' );

const rawToValues = ( tokenMap, rawValues ) =>
	rawValues.map( v =>  ! isString( v ) || has( tokenMap, v ) ? v : { value: v, isBorderless: true } );

export class MetaTitleEditor extends Component {
	constructor() {
		super();

		this.state = {
			type: 'frontPage',
			values: []
		};

		this.switchType = this.switchType.bind( this );
		this.update = this.update.bind( this );
	}

	switchType( { value: type } ) {
		this.setState( { type } );
	}

	update( rawValues ) {
		const { saveMetaTitle } = this.props;
		const { type } = this.state;
		const values = rawToValues( tokenMap[ type ]( identity ), rawValues );

		saveMetaTitle( tokensToString( values ) );
		this.setState( { values } );
	}

	render() {
		const {
			disabled = false,
			translate = identity
		} = this.props;
		const {
			type,
			values
		} = this.state;

		Object.keys( this.props.titleFormats )
			.map( k => this.props.titleFormats[ k ] )
			.forEach( f => console.log( rawToValues( tokenMap[ type ]( identity ), formatToValues( f ) ) ) );

		return (
			<div>
				<SegmentedControl options={ titleTypes( translate ) } onSelect={ this.switchType } />
				<TokenField
					disabled={ disabled }
					onChange={ this.update }
					suggestions={ Object.keys( tokenMap[ type ]( translate ) ) }
					value={ values }
				/>
			</div>
		);
	}
}

MetaTitleEditor.propTypes = {
	disabled: PropTypes.bool
};

const mapStateToProps = state => ( {
	titleFormats: {
		frontPage: '%site_name% | %tagline%',
		posts: '%post_title% - %site_name%',
		pages: '%page_title% - %site_name%',
		groups: '%site_name% > %group_title%',
		archives: '%site_name% (%date%)'
	}
} );

const mapDispatchToProps = dispatch => ( {
	saveMetaTitle: title => console.log( { type: 'SEO_SET_META_TITLE', title } )
} );

export default connect( mapStateToProps, mapDispatchToProps )( localize( MetaTitleEditor ) );
