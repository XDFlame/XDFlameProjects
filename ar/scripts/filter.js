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
	filtered_in_enchantment_ids = []

	for (let i = 0; i < 5; i++) {

		filtered_in_gear[i] = gear[i].filter(
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

		filtered_in_enchantments[i] = gear_enchantments[i].filter(
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

		for(let i2 in gear[i]) {
			selectors[i][i2].hidden = true;
		}

		for(let i2 in gear_enchantments[i]) {
			enchantment_selectors[i][i2].hidden = true;
		}

		selectors[i][0].hidden = false;
		enchantment_selectors[i][0].hidden = false;

		if (!filtered_in_gear[i].includes(selected[i])) {
			selectors[i].selectedIndex = 0;
			calculate();
			update_images()
		}

		if (!filtered_in_enchantments[i].includes(selected_enchantments[i])) {
			enchantment_selectors[i].selectedIndex = 0;
			calculate();
			update_images()
		}
	}

	for (let i = 0; i < 5; i++) {

		for (let i2 = 0; i2 < selectors[i].children.length; i2++) {

			if (filtered_in_gear_ids[i].includes(Number(selectors[i][i2].value))) {
				selectors[i][i2].hidden = false;
			}
		}

		for (let i2 = 0; i2 < enchantment_selectors[i].children.length; i2++) {

			if (filtered_in_enchantment_ids[i].includes(Number(enchantment_selectors[i][i2].value))) {
				enchantment_selectors[i][i2].hidden = false
			}
		}
	}
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

	let sorted_gear = structuredClone(gear)
	let sorted_enchantments = structuredClone(gear_enchantments)
	
	sorted_gear.forEach((element, index) => {

		let none = element.shift();

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
		selectors[index].replaceChildren();
	})

	create_options(sorted_gear, selectors)

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
		enchantment_selectors[index].replaceChildren();
	})

	create_options(sorted_enchantments, enchantment_selectors)

	// Sets selected index to what it was before select options were removed and readded
	// (bug fix for when it would just default to none after sorting)

	for (let i in selectors) {
		selectors[i].selectedIndex = sorted_gear[i].findIndex(x => x.id === selected[i].id)
		enchantment_selectors[i].selectedIndex = sorted_enchantments[i].findIndex(x => x.id === selected_enchantments[i].id)
	}

	filter();
}