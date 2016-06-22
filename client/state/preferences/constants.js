export const USER_SETTING_KEY = 'calypso_preferences';
export const DEFAULT_PREFERENCES = {
	'editor-mode': {
		schema: { 'enum': [ null, 'html', 'tinymce' ] },
		'default': null
	},
	'guided-tours-history': {
		schema: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					tour: { type: 'string' },
					timestamp: { type: 'number', minimum: 0 },
					finished: { type: 'boolean' },
				},
				required: [ 'tour', 'timestamp', 'finished' ],
				additionalProperties: false,
			},
		},
		'default': [],
	},
};
