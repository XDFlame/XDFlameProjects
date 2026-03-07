let filtered_in_gear;
let filtered_in_enchantments;

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

			if (filtered_in_enchantments[i].includes(gear_enchantments[i][i2])) {
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

	let sorted_gear = [[],[],[],[],[]]
	
	for (let i in sorted_gear) {

		sorted_gear[i] = gear[i].toSorted((a,b) => a[value] - b[value]);

		if (reversed === 'true') {
			let length = sorted_gear[i].length
			sorted_gear[i].reverse();
			let none = sorted_gear[i][length - 1]
			sorted_gear[i].splice(-1, 1)
			sorted_gear[i].unshift(none)
		}

		selectors[i].replaceChildren();

		for (let i2 in sorted_gear[i]) {

			let option = document.createElement('option')
			option.value = sorted_gear[i][i2].id
			option.innerText = sorted_gear[i][i2].name

			selectors[i].appendChild(option)
		}
	}

	// Sets selected index to what it was before select options were removed and readded
	// (bug fix for when it would just default to none after sorting)

	for (let i in selectors) {

		selectors[i].selectedIndex = sorted_gear[i].findIndex((x) => x.id === selected[i].id)
	}

	filter();
}