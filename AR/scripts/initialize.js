// Variable declarations

let selected = [];
let selected_enchantments = [];
let selected_magics = [];
let selected_magic_tiers = [];
const gear = [
	structuredClone(hats),
	structuredClone(shirts),
	structuredClone(pants),
	structuredClone(accessories),
	structuredClone(accessories),
];
const gear_enchantments = [
	structuredClone(hat_enchantments),
	structuredClone(shirt_enchantments),
	structuredClone(pants_enchantments),
	structuredClone(accessory_enchantments),
	structuredClone(accessory_enchantments),
];
const selectors = [
	hat_selector,
	shirt_selector,
	pants_selector,
	accessory_1_selector,
	accessory_2_selector
];
const enchantment_selectors = [
	hat_enchantment_selector,
	shirt_enchantment_selector,
	pants_enchantment_selector,
	accessory_1_enchantment_selector,
	accessory_2_enchantment_selector
];
const magic_selectors = [
	first_magic_selector,
	second_magic_selector,
	third_magic_selector
];
const filter_selectors = [
	gear_rarity_filter,
	gear_stat_filter,
	enchantment_rarity_filter,
	enchantment_stat_filter,
];
const finals = [
	final_hat,
	final_shirt,
	final_pants,
	final_accessory_1,
	final_accessory_2
];
let final_build = {};
let final_magic_damage = [];
const stat_index = [
	'damage_reduction',
	'defense',
	'health_bonus',
	'health_regen',
	'jump_power',
	'magic_energy', 
	'magic_power',
	'movement_speed',
	'stamina',
	'stamina_regen',
	'stun_resistance',
];
const stat_display = [
	'Defense',
	'Magic Power',
	'Damage Reduction',
	'Health Bonus',
	'Health Regen',
	'Magic Energy',
	'Stamina',
	'Stamina Regen',
	'Movement Speed',
	'Jump Power',
	'Stun Resistance',
];
const rarity = [
	'common',
	'uncommon',
	'rare',
	'exotic',
	'legendary',
	'seasonal',
];


// Makes CSS rules for ::after {content} for container1 buttons

let buttons = document.querySelectorAll('.container1 button:not(#copy');
let button_imgs = document.querySelectorAll('.container1 button:not(#copy) img');
let extracted_text = [];

for (let i = 0; i < buttons.length; i++) {
	extracted_text[i] = buttons[i].innerText;
	buttons[i].innerText = ''
	buttons[i].append(button_imgs[i]);
	document.styleSheets[1].insertRule(`button:nth-of-type(${i+2})::after {content: "${extracted_text[i]}"}`)
}


// Fills in undefined stats with 0 & fills in scaling objects with dummy data

for (let c = 0; c < 5; c++) {

	for (let i in gear[c]) {

		for (let i2 in stat_index) {

			if (!gear[c][i][stat_index[i2]]) {
				gear[c][i][stat_index[i2]] = 0
			}

			if (!gear[c][i].scaling) {
				gear[c][i].scaling = new Object(
					{
						start: gear[c][i].level,
						end: gear[c][i].level
					}
				)
			}

			if (!gear[c][i].scaling[stat_index[i2]]) {
				gear[c][i].scaling[stat_index[i2]] = 0
			}

			if (gear[c][i].enchantable === undefined) {
				gear[c][i].enchantable = true
			}
		}
	}

	for (let i in gear_enchantments[c]) {

		for (let i2 in stat_index) {

			if (!gear_enchantments[c][i][stat_index[i2]]) {
				gear_enchantments[c][i][stat_index[i2]] = 0
			}
		}
	}
}

for (let i in magics) {
	if (!magics[i].base_efficiency) {
		magics[i].base_efficiency = 1
	}
	if (!magics[i].power_efficiency) {
		magics[i].power_efficiency = 1
	}
}


// Assigns ID to each object based off its index

function assign_id(array) {
	for (let i in array) {
		for (let i2 in array[i]) {
			array[i][i2].id = Number(i2);
		};
	};
};

assign_id(gear);
assign_id(gear_enchantments);

for (let i in magics) {
	magics[i].id = Number(i);
}


// Sorts the gear, gear_enchantments, and magics arrays alphabetically

function compare(a, b) {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
}

for (let i = 0; i < 5; i++) {
	gear[i].sort(compare);
	gear_enchantments[i].sort(compare);
}

magics = magics.sort(compare)


// Finds the index of each of the array's 'None' object

let none_index = [];
let enchantment_none_index = [];

for (let i in gear) {
	none_index[i] = gear[i].findIndex((x) => x.name === 'None');
	enchantment_none_index[i] = gear_enchantments[i].findIndex((x) => x.name === 'None');
}


// Moves none to the top

let removed = [];
let removed_enchantments = [];

for (let i = 0; i < 5; i++) {
	removed[i] = gear[i].splice(0, none_index[i]);
	removed_enchantments[i] = gear_enchantments[i].splice(0, enchantment_none_index[i]);

	for (let i2 in removed[i]) {
		gear[i].splice(1, 0, removed[i][removed[i].length - 1 - i2]);
	}

	for (let i2 in removed_enchantments[i]) {
		gear_enchantments[i].splice(1, 0, removed_enchantments[i][removed_enchantments[i].length - 1 - i2]);
	}
}


// Generates select options based off corresponding objects

function create_options(array1, array2) {

	for (let i in array1) {

		for (let i2 in array1[i]) {

			let name = array1[i][i2].name;
			let id = array1[i][i2].id;
			let option = document.createElement('option');
			option.textContent = name;
			array2[i].appendChild(option);
			array2[i][i2].value = id;
		}
	}
}

create_options(gear, selectors);
create_options(gear_enchantments, enchantment_selectors);

for (let c in magic_selectors) {

	for (let i in magics) {

		let name = magics[i].name;
		let id = magics[i].id;
		let option = document.createElement('option');
		option.textContent = name;
		magic_selectors[c].appendChild(option);
		magic_selectors[c][i].value = id;
	}
}

for (let i in rarity) {

	let list = document.createElement('li');
	let input = document.createElement('input');
	let label = document.createElement('label');

	input.type = 'checkbox'
	input.value = rarity[i]
	input.id = `${filter_selectors[0].id}_${input.value}`
	input.checked = true

	label.setAttribute('for', input.id)
	label.textContent = rarity[i].charAt(0).toUpperCase() + rarity[i].slice(1)
	list.append(input, label);

	gear_rarity_filter.appendChild(list)
}

for (let i in stat_index) {

	let list = document.createElement('li');
	let input = document.createElement('input');
	let label = document.createElement('label');

	input.type = 'checkbox'
	input.value = stat_index.find((x) => x === stat_display[i].toLowerCase().replace(' ', '_'));
	input.id = `${filter_selectors[1].id}_${input.value}`
	input.checked = true

	label.setAttribute('for', input.id)
	label.textContent = stat_display[i]
	list.append(input, label);

	gear_stat_filter.appendChild(list)
}

for (let i = 0; i < 3; i++) {

	let text = ['Tier 1', 'Tier 2', 'Tier 3']
	let list = document.createElement('li');
	let input = document.createElement('input');
	let label = document.createElement('label');

	input.type = 'checkbox'
	input.value = rarity[i * 2]
	input.id = `${filter_selectors[2].id}_${input.value}`
	input.checked = true

	label.setAttribute('for', input.id)
	label.textContent = text[i]
	list.append(input, label);

	enchantment_rarity_filter.appendChild(list)
}

for (let i in stat_index) {

	let list = document.createElement('li');
	let input = document.createElement('input');
	let label = document.createElement('label');

	input.type = 'checkbox'
	input.value = stat_index.find((x) => x === stat_display[i].toLowerCase().replace(' ', '_'));
	input.id = `${filter_selectors[3].id}_${input.value}`
	input.checked = true

	label.setAttribute('for', input.id)
	label.textContent = stat_display[i]
	list.append(input, label);

	enchantment_stat_filter.appendChild(list)
}