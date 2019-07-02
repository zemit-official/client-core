class Error {

	err = null;

	constructor(err) {
		this.err = err;
	}

	getMessage() {
		return this.err;
	}

	getStackTrace() {
		return this.err.stack;
	}
}

export default Error;
