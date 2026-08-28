"use strict"

import {
	gear, gear_enchantments, magics,
	selected, selected_enchantments, selected_magics,
	selectors, popovers, enchantment_selectors, magic_selectors,
	stat_index
} from './initialize.js';
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

	for (let [index, element] of popovers.entries()) {
		for (let element2 of element.querySelectorAll('.grid-wrapper img')) {
			if (gear[index][element2.getAttribute('data-id')].level > level) {
				element2.classList.add('disabled')
			}
			else if (gear[index][element2.getAttribute('data-id')].level <= level) {
				element2.classList.remove('disabled')
			}
			if (selected[index].level > level) {
				selectors[index].setAttribute('data-selected', 0);
				selected[index] = gear[index][0];
				update_images();
			}
		}
	}
}


function enchantment_lock() {

	for (let [index, element] of enchantment_selectors.entries()) {

		element.classList.remove('disabled');

		if (selected[index].enchantable === false) {
			element.classList.add('disabled');
			
			if (selected_enchantments[index].id !== 0) {
				element.setAttribute('data-selected', 0);
				selected_enchantments[index] = gear_enchantments[index][0];
				update_images();
			}
		}
	}
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
		document.querySelectorAll('.info')[3].classList.add('conflict');
		document.querySelectorAll('.info')[4].classList.add('conflict');

		document.querySelectorAll('.info img:not(.conflict)')[3].classList.add('hidden');
		document.querySelectorAll('.info img:not(.conflict)')[4].classList.add('hidden');

		document.querySelectorAll('img.conflict')[0].classList.remove('hidden');
		document.querySelectorAll('img.conflict')[1].classList.remove('hidden');
	}
	else {
		document.querySelectorAll('.info')[3].classList.remove('conflict');
		document.querySelectorAll('.info')[4].classList.remove('conflict');

		document.querySelectorAll('.info img:not(.conflict)')[3].classList.remove('hidden');
		document.querySelectorAll('.info img:not(.conflict)')[4].classList.remove('hidden');

		document.querySelectorAll('img.conflict')[0].classList.add('hidden');
		document.querySelectorAll('img.conflict')[1].classList.add('hidden');
	}
}


function calculate_q() {

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

	document.querySelector('p.output ul').replaceWith(display(final_build));
	document.querySelector('p.output ul:nth-of-type(2)').replaceWith(display_player_stats());
	document.querySelector('div.slider span:nth-of-type(2)').innerText = `${value}%`;
	document.querySelector('p.output ul:nth-of-type(3)').replaceWith(display_magics(calculate_q()));
}


function variant_handler(id, index, element) {

	if (!element) {element = structuredClone(gear[index][id]);}
	
	const gear_strings = ['hats', 'shirts', 'pants', 'accessories', 'accessories'];

	let grid = popovers[index].querySelector('.grid-wrapper')
	let grid2 = document.createElement('div');
	
	grid2.classList.add('grid-wrapper', 'variants');

	for (let element2 of element.variants) {
		let img = document.createElement('img');

		img.setAttribute('data-variant-id', element2.id);
		img.setAttribute('data-id', element.id);

		img.src = `images/frames/${element.rarity}.png`;
		img.style.backgroundImage = `url("/ar/images/${gear_strings[index]}/${element.name}/${element2.name}.png"), url(/ar/images/background.png)`;

		img.addEventListener('click', () => {
			selectors[index].setAttribute('data-selected', element.id);
			selectors[index].setAttribute('data-selected-variant', element2.id);

			grid2.remove();
			grid.removeAttribute('style');
			popovers[index].hidePopover();

			calculate();
			update_images();
		})
		grid2.append(img)
	}
	
	grid.after(grid2);
	grid.style.display = 'none';
}

function calculate() {

	// Defines variables

	level = Number(level_input.value);                                                                                                          
	magic_level = Number(magic_level_input.value);
	strength_level = Number(strength_level_input.value);

	finals = [{}, {}, {}, {}, {}];
	final_build = {};

	for (let index = 0; index < 5; index++) {
		selected[index] = structuredClone(gear[index][selectors[index].getAttribute('data-selected')]);
		selected_enchantments[index] = structuredClone(gear_enchantments[index][enchantment_selectors[index].getAttribute('data-selected')]);
		
		if (selected[index].variants) {
			selected_variants[index] = structuredClone(selected[index].variants[selectors[index].getAttribute('data-selected-variant')]);

			stat_index.forEach(stat => {
				if (!selected[index][stat] && !selected_variants[index][stat]) {return}
				if (selected[index][stat] || selected_variants[index][stat]) {
					selected[index][stat] = (selected[index][stat] ?? 0) + (selected_variants[index][stat] ?? 0);
				}
			})
		}
	}

	level_lock();
	enchantment_lock();
	dupe_warn();


	// Sets magic power value for cursed to the extra value cursed would add per piece

	for (let [index, element] of selected_enchantments.entries()) {
		if (element.name === 'Cursed') {
			element.magic_power = (armor_scaling(selected[index], 'magic_power') ?? 0) * 0.4 + 62;
		}
	}


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
	document.querySelector('p.output').innerHTML = '';
	document.querySelector('p.output').append(display(final_build), hr, display_player_stats(), hr2, display_magics(calculate_q()));

	health_scaling();
}

export {calculate, armor_scaling, health_scaling, variant_handler, level, magic_level, strength_level, selected_variants, finals, final_build}