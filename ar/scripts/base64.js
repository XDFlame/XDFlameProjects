"use strict"

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

function encode(number, length) {

	let final = '';

	while (number > 0) {
		let quotient = Math.floor(number/64)
		let remainder = number % 64
		final = characters[remainder] + final
		number = quotient
	}

	if (final.length < length) {
		final = final.padStart(length, '0')
	}

	return final;
}

function decode(string) {

	let split = string.split('');
	let final = 0;

	split.forEach((element, index, array) => {
		final += characters.indexOf(element) * 64 ** (array.length - index - 1)
	})

	return final;
}