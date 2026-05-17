"use strict"
// Variable declarations

let selected = [];
let selected_enchantments = [];
let selected_magics = [];

import * as gear_data from '/ar/gear/gear.json' with {type: "json"}
let gear = gear_data.default
gear[4] = gear[3]

import * as enchantment_data from '/ar/gear/enchantments.json' with {type: "json"}
let gear_enchantments = enchantment_data.default
gear_enchantments[4] = gear_enchantments[3];

import * as magic_data from '/ar/gear/magics.json' with {type: "json"}
let magics = magic_data.default

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
let finals = [{}, {}, {}, {}, {}];
let final_build = {};
const stat_index = [
	'defense',
	'magic_power',
	'damage_reduction',
	'health_bonus',
	'health_regen',
	'magic_energy',
	'stamina',
	'stamina_regen',
	'movement_speed',
	'jump_power',
	'stun_resistance'
];
const stat_display = [];
const rarity = [
	'common',
	'uncommon',
	'rare',
	'exotic',
	'legendary',
	'seasonal',
];


// Creates stat_display array

stat_index.forEach(element => {
	stat_display.push(element.replace(/^[a-z]|((?<=_)[a-z])/g, element_2 => element_2.toUpperCase()).replace('_', ' '))
})


// Fills in undefined stats with 0 & fills in scaling objects with dummy data

magics.forEach(

	element => {
		if (element.base_efficiency === undefined) {element.base_efficiency = 1}
		if (element.power_efficiency === undefined) {element.power_efficiency = 1}
	}
)


// Replaces [name] with parent name for variants

gear.flat().forEach(element => {
	if (element.variants) {
		element.variants.forEach(element_2 => {
			element_2.name = element_2.name.replace('[name]', element.name);
		})
	}
})


// Assigns ID to each object based off its index

function assign_id(array) {
	array.forEach(
		element => {
			element.forEach(
				(element_2, index) => {
					element_2.id = index;
				}
			)
		}
	)
};

assign_id(gear);
assign_id(gear_enchantments);

magics.forEach(
	(element, index) => {
		element.id = index;
	}
)


// Sorts the gear, gear_enchantments, and magics arrays alphabetically with none at the top

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
	let none = gear[i].shift()
	let enchantment_none = gear_enchantments[i].shift();

	gear[i].sort(compare);
	gear_enchantments[i].sort(compare);

	gear[i].unshift(none);
	gear_enchantments[i].unshift(enchantment_none)
}

magics = magics.sort(compare)


// Generates select options based off corresponding objects

function create_options(array, select) {
	array.forEach(
		(element, index) => {

			element.forEach(element_2 => {

					let option = document.createElement('option');
					option.textContent = element_2.name;
					option.value = element_2.id;
					select[index].appendChild(option);
				}
			)
		}
	)
}

create_options(gear, selectors);
create_options(gear_enchantments, enchantment_selectors)

magic_selectors.forEach(element => {

	magics.forEach(element_2 => {

			let option = document.createElement('option');
			option.textContent = element_2.name;
			option.value = element_2.id;
			element.appendChild(option);
		}
	)
})

function create_filters(value, display, section) {
	value.forEach(
		(element, index) => {

			let list = document.createElement('li');
			let input = document.createElement('input');
			let label = document.createElement('label');

			input.type = 'checkbox'
			input.value = element
			input.id = `${section.id}_${input.value}`
			input.checked = true

			label.setAttribute('for', input.id)
			label.textContent = display[index]
			list.append(input, label);

			section.appendChild(list)
		}
	)
}

create_filters(rarity, ['Common', 'Uncommon', 'Rare', 'Exotic', 'Legendary', 'Seasonal'], gear_rarity_filter);
create_filters(stat_index, stat_display, gear_stat_filter);

create_filters(['common', 'rare', 'legendary'], ['Tier 1', 'Tier 2', 'Tier 3'], enchantment_rarity_filter);
create_filters(stat_index, stat_display, enchantment_stat_filter);

stat_display.forEach((element, index) => {

	let option = document.createElement('option');

	option.textContent = element
	option.value = stat_index[index]

	sorting_selector.children[2].appendChild(option)
})


// Generates buttons for saved builds

function add_build(x) {
	let build = document.createElement('button');
	build.innerText = x.name;
	build.value = x.id;
	build.classList.add('build')
	build.addEventListener('click', () => {
		build.classList.toggle('active')
		for (let i = 0; i < save_menu.querySelectorAll('.active').length; i++) {
			if (save_menu.querySelectorAll('.active')[i] !== build) {
				save_menu.querySelectorAll('.active')[i].classList.remove('active');
			}
		}
	})
	save_menu.appendChild(build);
}

let saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

if (!saved_builds) {
	localStorage.setItem('saved_builds', '[]');
	saved_builds = [];
}

saved_builds.forEach(element => add_build(element))

export {
	gear, gear_enchantments, magics,
	finals, final_build,
	selected, selected_enchantments, selected_magics,
	selectors, enchantment_selectors, magic_selectors,
	stat_index, stat_display,
	create_options, add_build
};