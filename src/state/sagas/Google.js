import { put, takeLatest, all } from 'redux-saga/effects';
import Error from "../../util/zemit/Error";

let apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
let searchEngineId = process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;

function* fetchGoogleImages(action) {

	let keywords = action.query.trim().split(' ').join('+');
	const url = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + searchEngineId + '&searchType=image&q=' + keywords;
	const response = yield fetch(url)
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

	yield put({
		type: "IMAGES/GET/" + (response instanceof Error ? 'ERROR' : 'SUCCESS'),
		data: response
	});
}

function* fetchGoogleDefinition(action) {

	let keywords = action.query.trim().split(' ').join('+');
	const url = 'https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + keywords + '&lang=' + action.lang;
	const response = yield fetch(url)
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

	yield put({
		type: "DEFINITION/GET/" + (response instanceof Error ? 'ERROR' : 'SUCCESS'),
		data: response
	});
}

function* actionWatcher() {
	yield takeLatest('IMAGES/GET', fetchGoogleImages);
	yield takeLatest('DEFINITION/GET', fetchGoogleDefinition);
}

export default function* googleSaga() {
	yield all([actionWatcher()]);
}
