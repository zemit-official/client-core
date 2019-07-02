import Error from "./Error";

export class Google {

	_apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
	_searchEngineId = process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;

	/**
	 * https://cse.google.com/cse/create/new
	 */
	searchImages(query) {

		let keywords = query.trim().split(' ').join('+');

		let promise = fetch('https://www.googleapis.com/customsearch/v1?key=' + this._apiKey + '&cx=' + this._searchEngineId + '&searchType=image&q=' + keywords)
			.then(res => {

				try {

					if(!res.ok) {
						throw new Error(res);
					}

					return res.json();
				}
				catch(e) {
					throw new Error(res);
				}
			})
			.catch(err => {
				return err;
			});

		return promise;
	}

	getDefinition(query, lang = 'en') {

		let keywords = query.trim().split(' ').join('+');

		let promise = fetch('https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + keywords + '&lang=' + lang)
			.then(res => {

				try {

					if(!res.ok) {
						throw new Error(res);
					}

					return res.json();
				}
				catch(e) {
					throw new Error(res);
				}
			})
			.catch(err => {
				return err;
			});

		return promise;
	}
}
