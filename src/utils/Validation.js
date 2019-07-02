import Error from "./Error";
import {calculateScore} from "./Password";
import currentAppLocale from "../../../../src/locales";
import {IntlProvider} from 'react-intl';
import * as ReactDOM from "react-dom";
const intlProvider = new IntlProvider(currentAppLocale);
const { intl } = intlProvider.getChildContext();

/**
 * Default Validation class
 */
export class Validation {

	value = null;
	validationCallbacks = [];
	errorMessages = [];

	addValidation(callback) {
		this.validationCallbacks.push(callback);
	}

	clearValidations() {
		this.validationCallbacks.splice(0, this.validationCallbacks.length);
	}

	addError(message) {
		if(message instanceof Error) {
			this.errorMessages.push(message);
		}
	}

	getErrors() {
		return this.errorMessages;
	}

	getErrorMessages() {

		let messages = [];
		this.getErrors().forEach(error => {
			messages.push(error.getMessage());
		});

		return messages;
	}

	getRenderedErrorMessages() {

		let messages = [];
		let dom = document.createElement('div');
		this.getErrorMessages().forEach(message => {
			ReactDOM.render(message, dom);
			messages.push(dom.innerHTML);
		});
		return messages;
	}

	clearErrorMessages() {
		this.errorMessages.splice(0, this.errorMessages.length);
	}

	setValue(value) {
		this.value = value;
	}

	isValid() {

		this.clearErrorMessages();

		for (let i = 0; i < this.validationCallbacks.length; i++) {
			const validation = this.validationCallbacks[i];
			try {
				validation(this.value);
			}
			catch(err) {
				this.addError(err);
			}
		}

		return this.errorMessages.length === 0;
	}
}





/**
 * EMAIL
 * @type {Validation}
 */
let email = new Validation();
email.addValidation(value => {

	/**
	 * https://gist.github.com/badsyntax/719800
	 */
	let isValid = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(value);

	if(!isValid && (typeof value === 'string' && value.length > 0)) {
		throw new Error(intl.formatMessage({id: 'validation.emailErr'}));
	}
});

/**
 * NOT EMPTY
 * @type {Validation}
 */
let notEmpty = new Validation();
notEmpty.addValidation(value => {
	let isValid = typeof value === 'string' && value.length > 0;
	if (!isValid) {
		throw new Error(intl.formatMessage({id: 'validation.notEmptyErr'}));
	}
});

/**
 * COMPARE PASSWORD
 * @type {React.Component}
 */
let comparePassword = (reference) => {

	let validation = new Validation();

	validation.addValidation(value => {

		if(!reference || !reference.current) {
			return;
		}

		let isValid = !reference.current._hasBlurred || (
			reference.current && value === reference.current.inputRef.current.value
		);

		if(!reference.current._hasUpdatedByRef) {
			setTimeout(() => {
				reference.current.forceUpdate();
				reference.current._hasUpdatedByRef = true;
				setTimeout(() => {
					reference.current._hasUpdatedByRef = false;
				});
			});
		}

		if(!isValid) {
			throw new Error(intl.formatMessage({id: 'validation.comparePasswordErr'}));
		}
	});

	return validation;
};

/**
 * PASSWORD SCORE
 * @type {React.Component}
 */
let passwordScore = (minScore) => {

	let validation = new Validation();

	validation.addValidation(value => {

		let score = calculateScore(value);

		if(minScore > score) {
			throw new Error(intl.formatMessage({id: 'validation.passwordScoreErr'}));
		}
	});

	return validation;
};


/**
 * IS_INTEGER
 * @type {Validation}
 */
let isInteger = new Validation();
isInteger.addValidation(value => {
	let isValid = Number.isInteger(value);
	if(!isValid) {
		throw new Error(intl.formatMessage({id: 'validation.isIntegerErr'}));
	}
});

/**
 * IS_DATE
 * @type {Validation}
 */
let isDate = new Validation();
isDate.addValidation(value => {
	let isValid = false;
	if(!isValid) {
		throw new Error(intl.formatMessage({id: 'validation.isDateErr'}));
	}
});

/**
 * URL
 * @type {Validation}
 */
let url = new Validation();
url.addValidation(value => {
	let isValid = false;
	if(!isValid) {
		throw new Error(intl.formatMessage({id: 'validation.urlErr'}));
	}
});

/**
 * IS_BOOLEAN
 * @type {Validation}
 */
let isBoolean = new Validation();
isBoolean.addValidation(value => {
	let isValid = value === true || value === false;
	if(!isValid) {
		throw new Error(intl.formatMessage({id: 'validation.isBooleanErr'}));
	}
});





/**
 * DEFAULT VALIDATIONS
 */
export const ZmDefaultValidation = {
	REQUIRED: notEmpty,
	NOT_EMPTY: notEmpty,
	EMAIL: email,
	COMPARE_PASSWORD: comparePassword,
	PASSWORD_SCORE: passwordScore,
	URL: url,
	IS_INTEGER: isInteger,
	IS_DATE: isDate,
	IS_BOOLEAN: isBoolean,
};
