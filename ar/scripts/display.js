"use strict"

import {stat_index, stat_display, selected, selected_enchantments} from './initialize.js';
import {selected_variants} from './calculate.js';

function number_format(n) {
	return Intl.NumberFormat(navigator.language).format(n)
}

function sign_check(n) {
	return n <= 0? `${n}` : `+${n}`;
}

function display(piece) {

	let final_string = [];
	let final_list = document.createElement('ul');

	stat_index.forEach((stat, index) => {

		if (!piece[stat]) {piece[stat] = 0}

		if (index <= 1) {
			final_string[index] = `${stat_display[index]}: ${number_format(piece[stat])}`
		}

		if (index == 2) {
			final_string[index] = `${stat_display[index]}: ${piece[stat]}%`
		}

		if (index == 3 || index >= 5) {
			final_string[index] = `${stat_display[index]}: ${sign_check(piece[stat])}%`
		}

		if (index == 4) {
			final_string[index] = `${stat_display[index]}: ${sign_check(piece[stat])} HP/s`;
		}
	})

	for (let i in final_string) {

		let final_list_li = document.createElement('li');
		final_list_li.append(final_string[i]);
		final_list.appendChild(final_list_li);
	}

	return final_list;
}


function update_images() {

	const gear_strings = [
		'hats',
		'shirts',
		'pants',
		'accessories',
		'accessories',
	];

	for (let i = 0; i < 5; i++) {
		document.querySelectorAll('.gear_image')[i].style.backgroundImage = `
			url("images/overlays/${selected_enchantments[i].name}.png"),
			url("images/${gear_strings[i]}/${selected[i].name}.png"),
			url(images/background.png)
		`

		if (selected[i].variants) {
			document.querySelectorAll('.gear_image')[i].style.backgroundImage = `
				url("images/overlays/${selected_enchantments[i].name}.png"),
				url("images/${gear_strings[i]}/${selected[i].name}/${selected_variants[i].name}.png"),
				url(images/background.png)
			`
		}

		document.querySelectorAll('.gear_image')[i].src = `images/frames/${selected[i].rarity}.png`

		document.querySelectorAll('.charm_image')[i].style.backgroundImage = `url("images/charms/${selected_enchantments[i].name}.png"), url(images/background.png)`
		document.querySelectorAll('.charm_image')[i].src = `images/frames/${selected_enchantments[i].rarity}.png`
	}
}

export {number_format, display, update_images}