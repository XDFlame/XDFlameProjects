"use strict"

import {gear, gear_enchantments, magics, selectors, enchantment_selectors, magic_selectors, variant_selectors, stat_index, stat_display} from './initialize.js';
import {display, update_images} from './display.js';
import {calculate, health_scaling, level, finals} from './calculate.js';
import {filter, sort_gear, filtered_in_gear_ids, filtered_in_enchantment_ids} from './filter.js';
import {decode_share_link, delete_build, export_code, sort_code, load_build, rename_build, save_build} from './saveload.js';

// Handles click functionality of copy build button

function copy_code() {
	navigator.clipboard.writeText(export_code());
	copy.classList.toggle('active');
	setTimeout(() => copy.classList.toggle('active'), 500);
}


function share_link() {
	let url = window.location.href;
	let object = {code: export_code()}
	
	let search_params = new URLSearchParams(object);
	let query_string = search_params.toString()

	navigator.clipboard.writeText(`${url}?${query_string}`)
	share.classList.toggle('active');
	setTimeout(() => share.classList.toggle('active'), 500);
}


// Adds event listeners

document.addEventListener('click', event => {

	if (enchantment_selectors.includes(event.target) || variant_selectors.includes(event.target)) {calculate(); update_images()};

	if (magic_selectors.includes(event.target)) {calculate()};

	if (event.target.matches('#filter_selector *')) {filter()}

	if (event.target.matches('#sorting_selector *')) {sort_gear()}

	if (event.target === all_selector) {
		filter_selector.querySelectorAll('li input').forEach(element => element.checked = event.target.checked);
		filter();
	}

	if (event.target.matches('#hat_popover img')) {
		selectors[0].selectedIndex = gear[0].indexOf(find_by_id(gear[0], event.target.getAttribute('data-id')));
		calculate();
		hat_popover.hidePopover();
	}
})

hat_popover.addEventListener('mousemove', event => {

	let element = find_by_id(gear[0], event.target.getAttribute('data-id'));
	let rarity_colors = {
		none: '#ffffff',
		common: '#bbbbbb',
		uncommon: '#ebb306',
		rare: '#0458db',
		exotic: '#d0080f',
		legendary: '#00ff00', 
		seasonal: '#d008d9'
	}

	let cap = (str) => {return str.replace(/^[a-z]/, x => x.toUpperCase())}

	if (event.target.matches('img')) {
		hat_tooltip.innerHTML =
		`
			${element.name}
			<div class="wrapper">
				<span>Lvl: ${element.level}+</span> | <span style="color: ${rarity_colors[element.rarity]}">${cap(element.rarity)}</span>
			</div>
			<hr>
		`;
		hat_tooltip.append(display(element))
		hat_tooltip.style.display = 'grid';
		hat_tooltip.style.left = `${event.layerX - hat_tooltip.offsetWidth/2}px`;
		hat_tooltip.style.top = `${event.layerY + 15}px`;
	} else {
		hat_tooltip.style.display = 'none';
	}
})

let level_selectors = [level_input, magic_level_input, strength_level_input];

level_selectors.forEach(element => element.addEventListener('change', calculate));

let output_buttons = Array.from(document.querySelectorAll('.info'));

output_buttons.forEach((element, index) => {

	element.addEventListener('mouseenter', event => {
		piece_output.innerHTML = display(finals[index]).outerHTML;
		piece_output.style.display = 'unset';
		piece_output.style.left = `${event.x - piece_output.offsetWidth - 5}px`;
		piece_output.style.top = `${event.y - piece_output.offsetHeight/2}px`;
	})

	element.addEventListener('mouseleave', event => {
		piece_output.style.display = 'none';
	})
})

let clear_buttons = Array.from(document.querySelectorAll('.clear'));

clear_buttons.forEach((element, index) => {
	element.addEventListener('click', event => {
		clear_build('piece', index)
	})
})

selectors.forEach(element => {
	element.addEventListener('change', calculate);
	element.addEventListener('change', update_images)
})

copy.addEventListener('click', copy_code);
share.addEventListener('click', share_link);
code_import.addEventListener('change', () => sort_code(code_import.value));

save_button.addEventListener('click', save_build);
load_button.addEventListener('click', load_build);
rename_button.addEventListener('click', rename_build);
delete_button.addEventListener('click', delete_build);
save_search.addEventListener('input', search_saves);

health_slider.addEventListener('input', health_scaling)

document.querySelector('[data-text="Clear Gear"]').addEventListener('click', () => clear_build('gear'));
document.querySelector('[data-text="Clear Charms"]').addEventListener('click', () => clear_build('enchantments'));
document.querySelector('[data-text="Random"]').addEventListener('click', random_build);


// Add preset buttons

stat_display.forEach((element, index) => {
	let btn = document.createElement('button');
	btn.classList.add('build');
	btn.textContent = `Max ${element}`;
	btn.addEventListener('click', () => preset_build(stat_index[index]))
	preset_menu.appendChild(btn);
})


// Random build function

function random_build() {

	let random_gear = [];
	let random_gear_enchantments = [];
	let random_variants = [];
	let random_magics = [];
	let apply_random_filters = random_filters.checked;

	let allowed_gear_ids = [[],[],[],[],[]];
	let allowed_enchantment_ids = [[],[],[],[],[]];

	if (apply_random_filters === true) {
		allowed_gear_ids = filtered_in_gear_ids
		allowed_enchantment_ids = filtered_in_enchantment_ids
	} 
	
	else {

		gear.forEach( (element, index) => {
			allowed_gear_ids[index] = element.map(element_2 => element_2.id);
			allowed_gear_ids[index].shift();
		})

		gear_enchantments.forEach( (element, index) => {
			allowed_enchantment_ids[index] = element.map(element_2 => element_2.id);
			allowed_enchantment_ids[index].shift();
		})
	}

	// If all filters are deselected, sets random gear to "None"

	allowed_gear_ids.forEach(element => {if (element.length === 0) {element.push(0)}});
	allowed_enchantment_ids.forEach(element => {if (element.length === 0) {element.push(0)}});

	for (let i = 0; i < 5; i++) {
		random_gear[i] = allowed_gear_ids[i][Math.floor(Math.random() * allowed_gear_ids[i].length)];
		random_gear_enchantments[i] = allowed_enchantment_ids[i][Math.floor(Math.random() * allowed_enchantment_ids[i].length)];

		if (find_by_id(gear[i], random_gear[i]).variants) {
			random_variants[i] = find_by_id(gear[i], random_gear[i]).variants[Math.floor(Math.random() * find_by_id(gear[i], random_gear[i]).variants.length)].id;	
		}
	};

	for (let i = 0; i < 5; i++) {
		selectors[i].selectedIndex = gear[i].findIndex(x => x.id === random_gear[i]);
		enchantment_selectors[i].selectedIndex = gear_enchantments[i].findIndex(x => x.id === random_gear_enchantments[i]);
		if (random_variants[i] !== undefined) {
			variant_selectors[i].setAttribute('data-selected', find_by_id(gear[i], random_gear[i]).variants.findIndex(x => x.id === random_variants[i]));
		}
	}

	for (let i = 0; i < 3; i++) {
		random_magics[i] = Math.floor(Math.random() * magics.length);
		magic_selectors[i].selectedIndex = magics.findIndex(x => x.id === random_magics[i]);
	}

	calculate();
	update_images();
}


function clear_build(target, n) {

	switch(target) {
		case 'gear':
			selectors.forEach(element => element.selectedIndex = 0);
			break;
		case 'enchantments':
			enchantment_selectors.forEach(element => element.selectedIndex = 0);
			break;
		case 'piece':
			selectors[n].selectedIndex = 0;
			enchantment_selectors[n].selectedIndex = 0;
			break;
	}

	health_slider.value = 100;

	calculate();
	update_images();
}


function search_saves() {

	let query = save_search.value.toLowerCase();

	let builds = save_menu.querySelectorAll('button.build')
	builds.forEach((element) => element.style.display = 'none')

	let build_names = [...builds].map((element) => element.innerText.toLowerCase())
	build_names.forEach(
		(element, index) => {
			if (element.includes(query)) {
				builds[index].style.display = 'unset'
			}
		}
	);
}


function find_by_id(array, value) {
	return array.find(element => element.id === Number(value))
}


function preset_build(stat) {

	const sort_alg = (a, b) => (b[stat] ?? 0) - (a[stat] ?? 0);

	let sorted_gear = structuredClone(gear).map(element => element.sort(sort_alg));
	let sorted_enchantments = structuredClone(gear_enchantments).map(element => element.sort(sort_alg));
	let combined_gear = structuredClone(gear);
	let final_preset = {gear: [], enchantments: [], variants: []};

	for (let [index, element] of combined_gear.entries()) {
		for (let [index_2, element_2] of element.entries()) {
			if (element_2.enchantable !== false) {
				element_2[stat] = (element_2[stat] ?? 0) + (sorted_enchantments[index][0][stat] ?? 0)
			}
			if (element_2.variants) {
				element_2.variants.sort(sort_alg);
				element_2[stat] = (element_2[stat] ?? 0) + (element_2.variants[0][stat] ?? 0)
			}
		}
	}

	combined_gear.map(element => element.sort(sort_alg))	

	for (let [index, element] of sorted_gear.entries()) {

		if (find_by_id(sorted_gear[index], combined_gear[index][0].id).enchantable !== false) {
			final_preset.gear[index] = find_by_id(sorted_gear[index], combined_gear[index][0].id);
			final_preset.enchantments[index] = sorted_enchantments[index][0];
		} else {
			final_preset.gear[index] = find_by_id(sorted_gear[index], combined_gear[index][0].id);
			final_preset.enchantments[index] = gear_enchantments[index][0];
		}

		if (index === 4) {
			if (find_by_id(sorted_gear[4], (combined_gear[4][1].id ?? 0)).enchantable !== false) {
				final_preset.gear[4] = find_by_id(sorted_gear[4], (combined_gear[4][1].id ?? 0))
				final_preset.enchantments[4] = sorted_enchantments[4][0]
			} else {
				final_preset.gear[4] = find_by_id(sorted_gear[4], (combined_gear[4][1].id ?? 0));
				final_preset.enchantments[4] = gear_enchantments[index][0]
			}
		}

		if (final_preset.gear[index].variants) {
			final_preset.variants[index] = combined_gear[index].find(element => element.id === final_preset.gear[index].id).variants[0];
		} else {
			final_preset.variants[index] = gear[index][0]
		}
	}

	selectors.forEach((element, index) => element.selectedIndex = gear[index].indexOf(find_by_id(gear[index], (final_preset.gear[index].id ?? 0))));
	enchantment_selectors.forEach((element, index) => {
		element.selectedIndex = gear_enchantments[index].indexOf(find_by_id(gear_enchantments[index], final_preset.enchantments[index].id))
	});
	variant_selectors.forEach((element, index) => element.setAttribute('data-selected', final_preset.variants[index].id))

	calculate();
	update_images();
}

export {copy_code, share_link, find_by_id, preset_build}