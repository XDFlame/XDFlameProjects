let filtered_in_gear;
let filtered_in_enchantments;
let filtered_in_gear_ids
let filtered_in_enchantment_ids

function filter() {

	let selected_filters = [[],[],[],[]]

	// Stores each value in the selected_filters array

	for (let i in selected_filters) {

		for (let i2 = 0; i2 < filter_selectors[i].children.length; i2++) {

			let name = filter_selectors[i].children[i2].children[0].value
			let checked = filter_selectors[i].children[i2].children[0].checked

			if (checked) {
				selected_filters[i].push(name)
			}
		}
	}


	// Filters the gear and gear_enchantment arrays using selected_filters and stores result in filtered_in

	filtered_in_gear = [];
	filtered_in_enchantments = [];

	for (let i = 0; i < 5; i++) {

		filtered_in_gear[i] = gear[i].filter(
			(x) => {

				for (let i in selected_filters[1]) {
					if (selected_filters[0].includes(x.rarity) && x[selected_filters[1][i]]) {
						return true
					}
				}
				return false
			}
		)

		filtered_in_gear_ids = [[],[],[],[],[]]

		for (let i in filtered_in_gear) {
			for (let i2 in filtered_in_gear[i]) {
				filtered_in_gear_ids[i][i2] = filtered_in_gear[i][i2].id
			}
		}

		filtered_in_enchantments[i] = gear_enchantments[i].filter(
			(x) => {

				for (let i in selected_filters[3]) {
					if (selected_filters[2].includes(x.rarity) && x[selected_filters[3][i]]) {
						return true
					}
				}
				return false
			}
		)

		filtered_in_enchantment_ids = [[],[],[],[],[]]

		for (let i in filtered_in_enchantments) {
			for (let i2 in filtered_in_enchantments[i]) {
				filtered_in_enchantment_ids[i][i2] = filtered_in_enchantments[i][i2].id
			}
		}
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

	let value = sorting_selector.children[0].value;
	let reversed = sorting_selector.children[1].value;

	if (value === 'stat') {
		sorting_selector.children[2].disabled = false;
		value = sorting_selector.children[2].value;
	} else {
		sorting_selector.children[2].disabled= true;
	}

	let sorted_gear = structuredClone(gear)
	let sorted_enchantments = structuredClone(gear_enchantments)
	
	for (let i in sorted_gear) {

		let none = sorted_gear[i].shift();

		sorted_gear[i].sort(
			(a,b) => {
				if (a[value] > b[value]) {return 1}
				else if (a[value] < b[value]) {return -1}
				else {return 0}
			}
		);

		if (reversed === 'true') {
			sorted_gear[i].reverse();
		}

		sorted_gear[i].unshift(none)

		selectors[i].replaceChildren();

		for (let i2 in sorted_gear[i]) {

			let option = document.createElement('option')
			option.value = sorted_gear[i][i2].id
			option.innerText = sorted_gear[i][i2].name

			selectors[i].appendChild(option)
		}
	}

	for (let i in sorted_enchantments) {

		let none = sorted_enchantments[i].shift();

		sorted_enchantments[i].sort(
			(a,b) => {
				if (a[value] > b[value]) {return 1}
				else if (a[value] < b[value]) {return -1}
				else {return 0}
			}
		);

		if (reversed === 'true') {
			sorted_enchantments[i].reverse();
		}

		sorted_enchantments[i].unshift(none)

		enchantment_selectors[i].replaceChildren();

		for (let i2 in sorted_enchantments[i]) {

			let option = document.createElement('option')
			option.value = sorted_enchantments[i][i2].id
			option.innerText = sorted_enchantments[i][i2].name

			enchantment_selectors[i].appendChild(option)
		}
	}

	// Sets selected index to what it was before select options were removed and readded
	// (bug fix for when it would just default to none after sorting)

	for (let i in selectors) {
		selectors[i].selectedIndex = sorted_gear[i].findIndex((x) => x.id === selected[i].id)
		enchantment_selectors[i].selectedIndex = sorted_enchantments[i].findIndex((x) => x.id === selected_enchantments[i].id)
	}

	filter();
}