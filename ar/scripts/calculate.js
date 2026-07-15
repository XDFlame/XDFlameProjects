"use strict"

import {
	gear, gear_enchantments, magics,
	selected, selected_enchantments, selected_magics,
	selectors, enchantment_selectors, variant_selectors, magic_selectors,
	stat_index, stat_display
} from './initialize.js';
import {find_by_id} from './misc.js';
import {number_format, display, display_player_stats, display_magics, update_images} from './display.js';

let level;
let magic_level;
let strength_level;
let selected_variants = [];
let selected_magic_tiers = [];
let finals = [{}, {}, {}, {}, {}];
let final_build = {};


function clamp(n, min, max) {
	return Math.min(Math.max(n, min), max);
}


function armor_scaling(piece, stat) {
	if (!piece.scaling || !piece.scaling[stat]) {return piece[stat]}
	else {return piece[stat] + clamp(level - piece.scaling.start, 0, piece.scaling.end - piece.scaling.start) * piece.scaling[stat]}
}


function level_lock() {
	
	for (let i in gear) {

		for (let i2 in gear[i]) {
			[...selectors[i]].find(x => x.value == gear[i][i2].id).disabled = (gear[i][i2].level > level);
		}

		if (selected[i].level > level) {
			selectors[i].selectedIndex = 0;
			selected[i] = find_by_id(gear[i], 0);
			update_images();
		}
	}
}


function enchantment_lock() {

	selected.forEach((element, index) => {

		enchantment_selectors[index].disabled = false

		if (element.enchantable === false) {
			enchantment_selectors[index].disabled = true
			enchantment_selectors[index].selectedIndex = 0;
			selected_enchantments[index] = find_by_id(gear_enchantments[index], 0);
			update_images();
		}
	})
}


function magic_lock() {

	if (magic_level < 300) {
		magic_selectors[2].disabled = true;
		selected_magics.splice(2, 1)
	} else {
		magic_selectors[2].disabled = false
		selected_magics[2] = magics.find(element => element.id == magic_selectors[2].value)
	};

	if (magic_level < 100) {
		magic_selectors[1].disabled = true;
		selected_magics.splice(1, 1);
	} else {
		magic_selectors[1].disabled = false
		selected_magics[1] = magics.find(element => element.id == magic_selectors[1].value);
	};
}


function dupe_warn() {

	if (
		selected[3].name !== 'None' &&
		selected[3].name === selected[4].name &&
		selected_enchantments[3].name === selected_enchantments[4].name
	) {
		document.querySelectorAll('button.info')[3].classList.add('conflict');
		document.querySelectorAll('button.info')[4].classList.add('conflict');
	}
	else {
		document.querySelectorAll('button.info')[3].classList.remove('conflict');
		document.querySelectorAll('button.info')[4].classList.remove('conflict');
	}
}


function calculate_q() {

	let strings = ['First', 'Second', 'Third'];
	let ul = document.createElement('ul');
	let final_magic_damage = [];
	let magic_tiers = [
		361,
		241,
		121,
		61,
		1,
	]

	for (let i = 0; i < 3; i++) {

		selected_magics[i] = magics.find(x => x.id === Number(magic_selectors[i].value));

		for (let i2 in magic_tiers) {

			if (magic_level >= (magic_tiers[i2] + 100 * i + 100 * (Math.max(i - 1, 0)))) {
				selected_magic_tiers[i] = magic_tiers.length - i2;
				break;
			} else {
				selected_magic_tiers[i] = 0;
			}
		}
	}

	magic_lock();

	for (let i = 0; i < selected_magics.length; i++) {

		// Checks if identical magics and copies the tier if so

		if (i < 2 && (selected_magics[i] === selected_magics[i + 1])) {
			selected_magic_tiers[i + 1] = selected_magic_tiers[i];
		}

		if (selected_magics[0] === selected_magics[2]) {
			selected_magic_tiers[2] = selected_magic_tiers[0];
		};

		final_magic_damage[i] = Math.round(
			(level/2 + magic_level/4 + selected_magics[i].base_damage) * (selected_magics[i].base_efficiency ?? 1) +
			final_build.magic_power * (selected_magics[i].power_efficiency ?? 1) * selected_magic_tiers[i]/5
		)
	}

	return final_magic_damage;
}


function health_scaling() {

	let value = Number(health_slider.value);

	final_build.magic_power = 0;
	final_build.damage_reduction = 0;

	for (let i in finals) {
		final_build.magic_power += (finals[i].magic_power ?? 0);
		final_build.damage_reduction += (finals[i].damage_reduction ?? 0);
	}

	let damage_reduction = (final_build.damage_reduction ?? 0);
	let health_decimal = value/100;

	if (health_decimal <= 0.8) {
		let multiplier = clamp(health_decimal + 0.2, 0.4, 1);
		damage_reduction = damage_reduction * multiplier;
		final_build.damage_reduction = Number(damage_reduction.toFixed(1));
	}

	let effective_health = number_format(Math.round((level * 7 + 93 + (final_build.defense ?? 0)) * (1 + (final_build.health_bonus ?? 0)/100) / (1 - damage_reduction/100)));

	for (let i in selected_enchantments) {
		if (selected_enchantments[i].name === 'Berserk') {
			finals[i].magic_power = Math.floor((armor_scaling(selected[i], 'magic_power') ?? 0) + (selected_enchantments[i].magic_power ?? 0) * clamp(100/health_slider.value, 1, 4));
		}
	}

	document.querySelector('.output ul').replaceWith(display(final_build));
	document.querySelector('.output ul:nth-of-type(2)').replaceWith(display_player_stats());
	document.querySelector('div.slider span:nth-of-type(2)').innerText = `${value}%`;
	document.querySelector('.output ul:nth-of-type(3)').replaceWith(display_magics(calculate_q()));
}


function variant_handler() {
	
	selected.forEach((element, index) => {

		if (element.variants) {

			if (variant_selectors[index].children.length === 0) {
				element.variants.forEach(element_2 => {
					let option = document.createElement('option');
					option.value = element_2.id;
					option.innerText = element_2.name;
					variant_selectors[index].appendChild(option);
				});
			}

			if (variant_selectors[index].getAttribute('data-selected')) {
				let data = variant_selectors[index].getAttribute('data-selected');
				variant_selectors[index].selectedIndex = element.variants.indexOf(find_by_id(element.variants, data));
				variant_selectors[index].removeAttribute('data-selected');
			}

			selected_variants[index] = element.variants[variant_selectors[index].value];

			stat_index.forEach(stat => {
				if (!selected[index][stat]) {selected[index][stat] = 0}
				if (!selected_variants[index][stat]) {selected_variants[index][stat] = 0}
				element[stat] += selected_variants[index][stat]
			})
		}
		
		else if (!element.variants) {
			variant_selectors[index].replaceChildren();
		}
	})
}

function calculate() {

	// Defines variables

	level = Number(level_input.value);
	magic_level = Number(magic_level_input.value);
	strength_level = Number(strength_level_input.value);

	finals = [{}, {}, {}, {}, {}];
	final_build = {};

	for (let i = 0; i < 5; i++) {
		selected[i] = structuredClone(find_by_id(gear[i], Number(selectors[i].value)));
		selected_enchantments[i] = find_by_id(gear_enchantments[i], Number(enchantment_selectors[i].value));
	}

	variant_handler();
	level_lock();
	enchantment_lock();
	dupe_warn();


	// Sets magic power value for cursed to the extra value cursed would add per piece
	
	gear_enchantments.forEach((element, index) => {
		element.find(x => x.name === 'Cursed').magic_power = (armor_scaling(selected[index], 'magic_power') ?? 0) * 0.4 + 62;
	})


	// Sets final values for each piece to the stats of the selected one + its respective enchantment, then sums each one into final_build object

	finals.forEach((element, index) => {
		stat_index.forEach(stat => {
			if (!selected[index][stat] && !selected_enchantments[index][stat]) {return};
			
			element[stat] = Math.floor((armor_scaling(selected[index], stat) ?? 0) + (selected_enchantments[index][stat] ?? 0));
			if(!final_build[stat]) {final_build[stat] = 0};
			final_build[stat] += (element[stat] ?? 0);
		})
	});


	// Outputs stats

	let hr = document.createElement('hr')
	let hr2 = document.createElement('hr')
	document.querySelector('.output').innerHTML = '';
	document.querySelector('.output').append(display(final_build), hr, display_player_stats(), hr2, display_magics(calculate_q()));

	health_scaling();
}

export {calculate, health_scaling, level, magic_level, strength_level, selected_variants, finals, final_build}