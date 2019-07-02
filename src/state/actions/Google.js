export const getGoogleImages = (query) => ({
	type: 'IMAGES/GET',
	query
});

export const getGoogleDefinition = (query, lang = 'en') => ({
	type: 'DEFINITION/GET',
	query,
	lang
});
