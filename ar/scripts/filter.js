"use strict"

let filtered_in_gear;
let filtered_in_enchantments;
let filtered_in_gear_ids
let filtered_in_enchantment_ids
const filter_selectors = [
	gear_rarity_filter,
	gear_stat_filter,
	enchantment_rarity_filter,
	enchantment_stat_filter,
];
const gear_copy = structuredClone(Object.values(gear).map(element => Object.values(element)));
const enchantments_copy = structuredClone(Object.values(gear_enchantments).map(element => Object.values(element)));

import {gear, gear_enchantments, selectors, popovers, enchantment_popovers, enchantment_selectors, selected, selected_enchantments, gear_strings} from './initialize.js';
import {calculate, variant_handler} from './calculate.js';
import {update_images} from './display.js';

function filter() {

	let selected_filters = [[],[],[],[]]

	// Stores each value in the selected_filters array

	filter_selectors.forEach((element, index) => {

		[...element.children].forEach(element_2 => {

			let name = element_2.querySelector('input').value;
			let checked = element_2.querySelector('input').checked;

			if (checked === true) {
				selected_filters[index].push(name)
			}
		})
	})


	// Filters the gear and gear_enchantment arrays using selected_filters and stores result in filtered_in

	filtered_in_gear = [];
	filtered_in_enchantments = [];
	filtered_in_gear_ids = []
	filtered_in_enchantment_ids = [];

	for (let i = 0; i < 5; i++) {

		filtered_in_gear[i] = gear_copy[i].filter(
			x => {

				for (let i in selected_filters[1]) {
					if (selected_filters[0].includes(x.rarity) && x[selected_filters[1][i]]) {
						return true
					}
				}
				return false
			}
		)

		filtered_in_gear_ids[i] = filtered_in_gear[i].map(x => x.id)

		filtered_in_enchantments[i] = enchantments_copy[i].filter(
			x => {

				for (let i in selected_filters[3]) {
					if (selected_filters[2].includes(x.rarity) && x[selected_filters[3][i]]) {
						return true
					}
				}
				return false
			}
		)

		filtered_in_enchantment_ids[i] = filtered_in_enchantments[i].map(x => x.id)
	}


	// Hides options based on filter

	for (let i = 0; i < 5; i++) {

		for (let element of popovers[i].querySelectorAll('img')) {
			if (Number(element.getAttribute('data-id')) !== 0) {element.classList.add('hidden-filter')}
		}

		for (let element of enchantment_popovers[i].querySelectorAll('img')) {
			if (Number(element.getAttribute('data-id')) !== 0) {element.classList.add('hidden-filter')}
		}

		if (!filtered_in_gear[i].map(element => element.name).includes(selected[i].name)) {
			selectors[i].setAttribute('data-selected', 0);
		}

		if (!filtered_in_enchantments[i].map(element => element.name).includes(selected_enchantments[i].name)) {
			enchantment_selectors[i].setAttribute('data-selected', 0);
		}
	}

	for (let i = 0; i < 5; i++) {

		for (let element of popovers[i].querySelectorAll('img')) {
			if (filtered_in_gear_ids[i].includes(Number(element.getAttribute('data-id')))) {
				element.classList.remove('hidden-filter')
			}
		}

		for (let element of enchantment_popovers[i].querySelectorAll('img')) {
			if (filtered_in_enchantment_ids[i].includes(Number(element.getAttribute('data-id')))) {
				element.classList.remove('hidden-filter')
			}
		}
	}

	calculate();
	update_images()
}


function sort_gear() {

	let value = sorting_type.value
	let reversed = sorting_method.value;

	if (value === 'stat') {
		sorting_stat.disabled = false;
		value = sorting_stat.value;
	} else {
		sorting_stat.disabled= true;
	}

	let sorted_gear = structuredClone(gear_copy);
	let sorted_enchantments = structuredClone(enchantments_copy);
	
	sorted_gear.forEach((element, index) => {

		let none = element.shift();

		element.forEach(element_2 => {
			if (!element_2[value]) {element_2[value] = 0}
		})

		sorted_enchantments[index].forEach(element_2 => {
			if (!element_2[value]) {element_2[value] = 0}
		})

		element.sort(
			(a, b) => {
				if (a[value] > b[value]) {return 1}
				else if (a[value] < b[value]) {return -1}
				else {return 0}
			}
		);

		if (reversed === 'true') {
			element.reverse();
		}

		element.unshift(none);
		popovers[index].querySelector('.grid-wrapper').replaceChildren();

		for (let element2 of element) {
			if (element2.variants && popovers[index].querySelector('.variants')) {

				element2.variants.forEach(element3 => {
					if (!element3[value]) {element3[value] = 0}
				})

				element2.variants.sort(
					(a, b) => {
						if (a[value] > b[value]) {return 1}
						else if (a[value] < b[value]) {return -1}
						else {return 0}
					}
				);

				if (reversed === 'true') {
					element2.variants.reverse();
				}

				popovers[index].querySelector('.variants').replaceChildren();
				variant_handler(element2.id, index, element2);
			}
		}
	})

	for (let [index, element] of sorted_gear.entries()) {
		for (let element2 of element) {
			let img = document.createElement('img');
			img.src = `/ar/images/frames/${element2.rarity}.png`;
			if (!element2.variants) {
				img.style.backgroundImage = `url("/ar/images/${gear_strings[index]}/${element2.name}.png")`;
			}
			else if (element2.variants) {
				img.style.backgroundImage = `url("/ar/images/${gear_strings[index]}/${element2.name}/${element2.variants[0].name}.png")`;
				img.setAttribute('data-has-variants', true)
			}
			img.style.backgroundImage += `, url(/ar/images/background.png)`
			img.setAttribute('data-id', element2.id);
			popovers[index].querySelector('.grid-wrapper').append(img)
		}
	}


	sorted_enchantments.forEach((element, index) => {

		let none = element.shift();

		element.sort(
			(a,b) => {
				if (a[value] > b[value]) {return 1}
				else if (a[value] < b[value]) {return -1}
				else {return 0}
			}
		);

		if (reversed === 'true') {
			element.reverse();
		}

		element.unshift(none)
		enchantment_popovers[index].querySelector('.grid-wrapper').replaceChildren();
	})

	for (let [index, element] of sorted_enchantments.entries()) {
		for (let element2 of element) {
			let img = document.createElement('img');
			img.src = `/ar/images/frames/${element2.rarity}.png`;
			img.style.backgroundImage = `url("/ar/images/charms/${element2.name}.png"), url(/ar/images/background.png)`;
			img.setAttribute('data-id', element2.id);
			enchantment_popovers[index].querySelector('.grid-wrapper').append(img)
		}
	}

	filter();
}

export {filter, sort_gear, filtered_in_gear_ids, filtered_in_enchantment_ids}