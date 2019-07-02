export const GOOGLE_IMAGES_INIT_STATE = {
	isLoading: false,
	isLoaded: false,
	hasError: false,
	data: {
		items: []
	},
	errorMessage: null
};

export const googleImagesReducer = (state = GOOGLE_IMAGES_INIT_STATE, action) => {

	switch (action.type) {

		case 'IMAGES/GET':
			return { ...GOOGLE_IMAGES_INIT_STATE, isLoading: true, data: state.data };
		case 'IMAGES/GET/SUCCESS':
			return { ...GOOGLE_IMAGES_INIT_STATE, isLoaded: true, data: action.data };
		case 'IMAGES/GET/ERROR':
			return { ...GOOGLE_IMAGES_INIT_STATE, hasError: true, errorMessage: action.data };

		default:
			return state || {};
	}
};

export const GOOGLE_DEFINITION_INIT_STATE = {
	isLoading: false,
	isLoaded: false,
	hasError: false,
	data: {
		meaning: {}
	},
	errorMessage: null
};

export const googleDefinitionReducer = (state = GOOGLE_DEFINITION_INIT_STATE, action) => {

	switch (action.type) {

		case 'DEFINITION/GET':
			return { ...GOOGLE_DEFINITION_INIT_STATE, isLoading: true, data: state.data };
		case 'DEFINITION/GET/SUCCESS':
			return { ...GOOGLE_DEFINITION_INIT_STATE, isLoaded: true, data: action.data };
		case 'DEFINITION/GET/ERROR':
			return { ...GOOGLE_DEFINITION_INIT_STATE, hasError: true, errorMessage: action.data };

		default:
			return state || {};
	}
};
