export const PasswordStrengthRanges = {
	BAD: 0,
	GOOD: 60,
	GREAT: 80
};

export const PasswordStrength = {
	BAD: 'bad',
	GOOD: 'good',
	GREAT: 'great'
};

export function getScoreRange(score) {

	if(score >= PasswordStrengthRanges.GREAT) {
		return PasswordStrength.GREAT;
	}
	else if(score >= PasswordStrengthRanges.GOOD) {
		return PasswordStrength.GOOD;
	}

	return PasswordStrength.BAD;
}

export function calculateByte(password) {

	return this.calculateBits(password) / 8;
}

export function calculateBits(password) {

	return Buffer.byteLength(password, 'utf8') * 8;
}

/**
 * Returns a value between -2 and 100 to score
 * the user's password.
 *
 * @param  string password The password to be checked.
 * @param  string field The field set (if options.field).
 * @return int
 */
export function calculateScore(password = null) {

	var score = 0;

	if(password === null) {
		return 0;
	}

	// password length
	score += password.length * 4;
	score += checkRepetition(1, password).length - password.length;
	score += checkRepetition(2, password).length - password.length;
	score += checkRepetition(3, password).length - password.length;
	score += checkRepetition(4, password).length - password.length;

	// password has 3 numbers
	if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
		score += 5;
	}

	// password has at least 2 sybols
	var symbols = '.*[!,@,#,$,%,^,&,*,?,_,~]';
	symbols = new RegExp('(' + symbols + symbols + ')');
	if (password.match(symbols)) {
		score += 5;
	}

	// password has Upper and Lower chars
	if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
		score += 10;
	}

	// password has number and chars
	if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
		score += 15;
	}

	// password has number and symbol
	if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) {
		score += 15;
	}

	// password has char and symbol
	if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) {
		score += 15;
	}

	// password is just numbers or chars
	if (password.match(/^\w+$/) || password.match(/^\d+$/)) {
		score -= 10;
	}

	let bits = calculateBits(password);
	if(score > bits) {
		score = bits;
	}

	if (score > 100) {
		score = 100;
	}

	if (score < 0) {
		score = 0;
	}

	return score;
}

/**
 * Checks for repetition of characters in
 * a string
 *
 * @param int rLen Repetition length.
 * @param string str The string to be checked.
 * @return string
 */
function checkRepetition(rLen, str) {
	var res = "", repeated = false;
	for (var i = 0; i < str.length; i++) {
		repeated = true;
		for (var j = 0; j < rLen && (j + i + rLen) < str.length; j++) {
			repeated = repeated && (str.charAt(j + i) === str.charAt(j + i + rLen));
		}
		if (j < rLen) {
			repeated = false;
		}
		if (repeated) {
			i += rLen - 1;
			repeated = false;
		}
		else {
			res += str.charAt(i);
		}
	}
	return res;
}
