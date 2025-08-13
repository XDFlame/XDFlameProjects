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

	let filtered_in_gear = [];
	let filtered_in_enchantments = [];

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
	}

	for (let i = 0; i < 5; i++) {

		for (let i2 = 0; i2 < selectors[i].children.length; i2++) {

			if (filtered_in_gear[i].includes(gear[i][i2])) {
				selectors[i][i2].hidden = false
			}
		}

		for (let i2 = 0; i2 < enchantment_selectors[i].children.length; i2++) {

			if (filtered_in_enchantments[i].includes(gear_enchantments[i][i2])) {
				enchantment_selectors[i][i2].hidden = false
			}
		}
	}
}