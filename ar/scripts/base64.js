"use strict"

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

function encode(number, length) {

	let final = '';
	let base = characters.length;

	while (number > 0) {
		let quotient = Math.floor(number/base)
		let remainder = number % base
		final = characters[remainder] + final
		number = quotient
	}

	if (final.length < length) {
		final = final.padStart(length, characters[0])
	}

	return final;
}

function big_encode(number, length) {

	let final = '';
	let base = BigInt(characters.length);

	while (number > 0) {
		let quotient = number/base
		let remainder = number % base
		final = characters[remainder] + final
		number = quotient
	}

	if (final.length < length) {
		final = final.padStart(length, characters[0])
	}

	return final;
}

function decode(string) {

	let split = string.split('');
	let final = 0;
	let base = characters.length

	split.forEach((element, index, array) => {
		final += characters.indexOf(element) * base ** (array.length - index - 1)
	})

	return final;
}

function big_decode(string) {

	let split = string.split('');
	let final = BigInt(0);
	let base = BigInt(characters.length)

	split.forEach((element, index, array) => {
		final += BigInt(characters.indexOf(element)) * base ** BigInt(array.length - index - 1)
	})

	return final;
}

export {encode, big_encode, decode, big_decode}