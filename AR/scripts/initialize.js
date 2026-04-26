"use strict"
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
let saved_builds;


// Creates stat_display array

stat_index.forEach(element => {
	stat_display.push(element.replace(/^[a-z]|((?<=_)[a-z])/g, element_2 => element_2.toUpperCase()).replace('_', ' '))
})


// Auto CSS rule for buttons to hide text below 1000px width

let buttons = document.querySelectorAll('button:has(img)');
let imgs  = document.querySelectorAll('button:has(img) img');
let text = [...buttons].map(element => element.innerText)
let style = document.createElement('style');
buttons.forEach((element, index) => {
	element.innerText = null;
	element.appendChild(imgs[index]);
	style.innerText += `button:has(img):nth-of-type(${index + 1})::after {content: "${text[index]}"}`
})
style.innerText += `@media (max-width: 1000px) {button:has(img)::after {content: "" !important}}`
document.head.appendChild(style)


// Fills in undefined stats with 0 & fills in scaling objects with dummy data

gear.flat().forEach(

	element => {

		if (element.scaling === undefined) {element.scaling = new Object(
			{
				start: element.level,
				end: element.level
			}
		)}

		if (element.enchantable === undefined) {element.enchantable = true}

		stat_index.forEach(

			element_2 => {
				if (element[element_2] === undefined) {element[element_2] = 0}
				if (element.scaling[element_2] === undefined) {element.scaling[element_2] = 0}
			}
		)
	}
)

gear_enchantments.flat().forEach(

	element => {

		stat_index.forEach(

			element_2 => {
				if (element[element_2] === undefined) {element[element_2] = 0}
			}
		)
	}
)

magics.forEach(

	element => {
		if (element.base_efficiency === undefined) {element.base_efficiency = 1}
		if (element.power_efficiency === undefined) {element.power_efficiency = 1}
	}
)


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

saved_builds = JSON.parse(localStorage.getItem('saved_builds'));
saved_builds.forEach(element => add_build(element))