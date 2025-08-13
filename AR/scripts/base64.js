const characters = [
	'0','1','2','3','4','5','6','7','8','9',
	'a','b','c','d','e','f','g','h','i','j',
	'k','l','m','n','o','p','q','r','s','t',
	'u','v','w','x','y','z','A','B','C','D',
	'E','F','G','H','I','J','K','L','M','N',
	'O','P','Q','R','S','T','U','V','W','X',
	'Y','Z','-','_',
];

function encode(number, length) {

	let final = '';

	if (length === undefined) {

		for (let i = 0; i <= 9; i++) {

			if (Math.floor(number/64**i) === 0) {
				length = i;
				break;
			}
		}
	}

	for (let i = 0; i < length; i++) {

		if (i === 0) {
			final += characters[Math.floor(number / 64 ** (length - i - 1))];
		}

		else {
			final += characters[Math.floor(number % 64 ** (length - i) / 64 ** (length - i - 1))];
		}
	}

	return final;
}

function decode(string) {

	let split = string.split('');
	let final = 0;

	for (let i in split) {
		final += characters.indexOf(split[i]) * 64 ** (split.length - i - 1)
	}

	return final;
}