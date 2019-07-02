export class String {

	/**
	 * GUID generator
	 */
	s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

	guid() {
		return this.s4() + this.s4() + this.s4() + this.s4();
	}

	/**
	 * Convert string to camel cases
	 */
	camelize(str, firstUpper) {
		var strCamel = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
			return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		}).replace(/\s+/g, '');

		return firstUpper === true
			? (strCamel.charAt(0).toUpperCase() + strCamel.slice(1))
			: strCamel;
	}

	/**
	 * Convert camelized strings to dashed
	 */
	snakeCase(str) {
		return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
	}

	isValidDomain(string) {
		return string && (/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9](:[0-9]+)?$/.test(string));
	}

	isValidHost(string) {
		return string && (/^([a-z0-9-.]*)?[a-z0-9](:[0-9]+)?$/.test(string));
	}
}
