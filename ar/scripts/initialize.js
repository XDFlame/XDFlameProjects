"use strict"
// Variable declarations

let selected = [];
let selected_enchantments = [];
let selected_magics = [];

import * as gear_data from '/ar/data/gear.json' with {type: "json"}
let gear = gear_data.default
gear[4] = structuredClone(gear[3])

import * as enchantment_data from '/ar/data/enchantments.json' with {type: "json"}
let gear_enchantments = enchantment_data.default
gear_enchantments[4] = structuredClone(gear_enchantments[3]);

import * as magic_data from '/ar/data/magics.json' with {type: "json"}
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

gear.flat().forEach(element => {
	if (element.variants) {
		element.variants.forEach((element_2, index) => {
			element_2.id = index
		})
	}
})

magics.forEach(
	(element, index) => {
		element.id = index;
	}
)

{
	let temp = {0: {}, 1: {}, 2: {}, 3: {}, 4: {}};
	for (let [index, element] of gear.entries()) {
		for (let element2 of element) {
			temp[index][element2.id] = element2
		}
	}
	gear = temp;

	let temp2 = {0: {}, 1: {}, 2: {}, 3: {}, 4: {}};
	for (let [index, element] of gear_enchantments.entries()) {
		for (let element2 of element) {
			temp2[index][element2.id] = element2
		}
	}
	gear_enchantments = temp2;
}


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

/*let gear_display = [[],[],[],[],[]]

for (let [index, element] of Object.entries(gear)) {
	for (let [index2, element2] of Object.entries(element)) {
		gear_display[index][index2] = {name: element2.name, id: element2.id}
	}
}*/

let gear_display = Object.values(gear).map(element =>
	Object.values(element).map(element2 => new Object({name: element2.name, id: element2.id, rarity: element2.rarity, variants: element2.variants})));
let gear_enchantments_display = Object.values(gear_enchantments).map(element => 
	Object.values(element).map(element2 => new Object({name: element2.name, id: element2.id, rarity: element2.rarity})));

for (let i = 0; i < 5; i++) {
	let none = gear_display[i].shift()
	let enchantment_none = gear_enchantments_display[i].shift();

	gear_display[i].sort(compare);
	gear_enchantments_display[i].sort(compare);

	gear_display[i].unshift(none);
	gear_enchantments_display[i].unshift(enchantment_none)
}

magics = magics.sort(compare)


// Generates select options based off corresponding objects

const gear_strings = [
	'hats',
	'shirts',
	'pants',
	'accessories',
	'accessories',
];

const popovers = [
	hat_popover,
	shirt_popover,
	pants_popover,
	accessory_1_popover,
	accessory_2_popover
]

const enchantment_popovers = [
	hat_enchantment_popover,
	shirt_enchantment_popover,
	pants_enchantment_popover,
	accessory_1_enchantment_popover,
	accessory_2_enchantment_popover
]

for (let [index, element] of gear_display.entries()) {
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

for (let [index, element] of gear_enchantments_display.entries()) {
	for (let element2 of element) {
		let img = document.createElement('img');
		img.src = `/ar/images/frames/${element2.rarity}.png`;
		img.style.backgroundImage = `url("/ar/images/charms/${element2.name}.png"), url(/ar/images/background.png)`;
		img.setAttribute('data-id', element2.id);
		enchantment_popovers[index].querySelector('.grid-wrapper').append(img)
	}
}

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

const gear_copy = structuredClone(Object.values(gear).map(element => Object.values(element)));
const enchantments_copy = structuredClone(Object.values(gear_enchantments).map(element => Object.values(element)));

export {
	gear, gear_enchantments, magics, gear_copy, enchantments_copy,
	selected, selected_enchantments, selected_magics,
	selectors, enchantment_selectors, popovers, enchantment_popovers, magic_selectors,
	stat_index, stat_display, add_build, gear_strings
};