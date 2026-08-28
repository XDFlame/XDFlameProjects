"use strict"

import {gear, gear_enchantments, magics, selectors, popovers, enchantment_popovers,
	enchantment_selectors, magic_selectors, stat_index, stat_display, selected, gear_copy, enchantments_copy} from './initialize.js';
import {display, update_images} from './display.js';
import {calculate, variant_handler, armor_scaling, health_scaling, level, finals} from './calculate.js';
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

	if (magic_selectors.includes(event.target)) {calculate()};

	if (event.target.matches('#filter_selector input')) {filter()}

	if (event.target.matches('#sorting_selector *')) {sort_gear()}

	if (event.target === all_selector) {
		filter_selector.querySelectorAll('li input').forEach(element => element.checked = event.target.checked);
		filter();
	}
})

for (let [index, element] of popovers.entries()) {

	selectors[index].addEventListener('click', event => {
		element.showPopover()
	})

	enchantment_selectors[index].addEventListener('click', event => {
		if (!event.target.classList.contains('disabled')) {
			enchantment_popovers[index].showPopover()
		}
	})


	const search = (a, b) => {
		const query = a[index].querySelector('input').value.toLowerCase();
		let piece

		if (a[index].querySelector('.variants')) {
			for (let img of a[index].querySelectorAll('.variants img')) {
				img.classList.add('hidden-search')
				piece = b[index][img.getAttribute('data-id')].variants[img.getAttribute('data-variant-id')];

				if (piece.name.toLowerCase().includes(query)) {
					img.classList.remove('hidden-search')
				}
			}
		} else {
			for (let img of a[index].querySelectorAll('.grid-wrapper img')) {
				img.classList.add('hidden-search')
				piece = b[index][img.getAttribute('data-id')];

				if (piece.name.toLowerCase().includes(query)) {
					img.classList.remove('hidden-search')
				}
			}
		}
	}

	element.querySelector('input').addEventListener('input', () => {
		search(popovers, gear)
	})

	enchantment_popovers[index].querySelector('input').addEventListener('input', () => {
		search(enchantment_popovers, gear_enchantments)
	})


	const hover = (a, b) => {
		let element2 = structuredClone(b[index][event.target.getAttribute('data-id')]);
		const rarity_colors = {
			none: '#ffffff',
			common: '#bbbbbb',
			uncommon: '#ebb306',
			rare: '#0458db',
			exotic: '#d0080f',
			legendary: '#00ff00', 
			seasonal: '#d008d9'
		}
		const tooltip = a[index].querySelector('.tooltip');
		const cap = (str) => {return str.replace(/^[a-z]/, x => x.toUpperCase())};

		if (event.target.matches('.grid-wrapper img') && event.target.getAttribute('data-variant-id')) {
			let variant = structuredClone(b[index][event.target.getAttribute('data-id')].variants[event.target.getAttribute('data-variant-id')]);
			element2.name = variant.name

			for (let stat of stat_index) {
				element2[stat] = (element2[stat] ?? 0)
				element2[stat] += (variant[stat] ?? 0)
			}
		}

		if (event.target.matches('.grid-wrapper img') && !event.target.classList.contains('disabled')) {

			for (let stat of stat_index) {
				if (element2[stat]) {
					element2[stat] = Math.floor(armor_scaling(element2, stat));
				}
			}

			tooltip.innerHTML =
			`
				${element2.name}
				<div class="wrapper">
					<span style="color: ${rarity_colors[element2.rarity]}">${cap(element2.rarity)}</span>
				</div>
				<hr>
				${display(element2).outerHTML}
			`;
			if (element2.level) {
				let span = document.createElement('span');
				span.innerHTML = `<span>Lvl: ${element2.level}+</span> | `
				tooltip.querySelector('.wrapper').insertBefore(span, tooltip.querySelector('.wrapper span'))
			}
			if (element2.enchantable === false) {
				let span = document.createElement('span');
				span.style.gap = '.25em'
				let div = document.createElement('div');

				div.classList.add('stat');
				div.style.backgroundColor = '#960000';
				div.style.mask = `url('/style/icons/disabled.svg')`;

				span.append(div, 'Enchantable');
				tooltip.querySelector('.wrapper').append(span)
			}
			tooltip.style.display = 'flex';
			tooltip.style.left = `${event.layerX - tooltip.offsetWidth/2}px`;
			tooltip.style.top = `${event.layerY + 15}px`;
		} else {
			tooltip.style.removeProperty('display')
		}
	}

	element.addEventListener('mousemove', event => {
		hover(popovers, gear)
	})

	enchantment_popovers[index].addEventListener('mousemove', event => {
		hover(enchantment_popovers, gear_enchantments)
	})


	const click_event = (a, b) => {
		let has_variants

		switch (event.target.getAttribute('data-has-variants')) {
			default: has_variants = false;
				break;
			case 'true': has_variants = true;
				break;
		}
		
		if (has_variants && !event.target.getAttribute('data-variant-id')) {
			variant_handler(event.target.getAttribute('data-id'), index);
		}

		if (!has_variants && !event.target.getAttribute('data-variant-id')) {
			b[index].removeAttribute('data-selected-variant');
		}

		if (event.target.getAttribute('data-id') && !has_variants && !event.target.classList.contains('disabled')) {
			b[index].setAttribute('data-selected', event.target.getAttribute('data-id'));
			calculate();
			update_images();
			set_handler();
		}

		if (!event.target.matches('input') && !event.target.matches('button[data-text="Filter"]') && !has_variants) {a[index].hidePopover()};
	}

	element.addEventListener('click', event => {
		click_event(popovers, selectors);
	})

	enchantment_popovers[index].addEventListener('click', event => {
		click_event(enchantment_popovers, enchantment_selectors);
	})
}

let level_selectors = [level_input, magic_level_input, strength_level_input];

level_selectors.forEach(element => element.addEventListener('change', calculate));

let output_buttons = Array.from(document.querySelectorAll('.info'));

output_buttons.forEach((element, index) => {

	element.addEventListener('mousemove', event => {
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

		if (gear[i][random_gear[i]].variants) {
			random_variants[i] = gear[i][random_gear[i]].variants[Math.floor(Math.random() * gear[i][random_gear[i]].variants.length)].id;	
		}
	};

	for (let i = 0; i < 5; i++) {
		selectors[i].setAttribute('data-selected', random_gear[i]);
		enchantment_selectors[i].setAttribute('data-selected', random_gear_enchantments[i]);
		if (random_variants[i] !== undefined) {
			selectors[i].setAttribute('data-selected-variant', random_variants[i]);
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
			selectors.forEach(element => element.setAttribute('data-selected', 0));
			break;
		case 'enchantments':
			enchantment_selectors.forEach(element => element.setAttribute('data-selected', 0));
			break;
		case 'piece':
			selectors[n].setAttribute('data-selected', 0);
			enchantment_selectors[n].setAttribute('data-selected', 0);
			selectors[n].parentElement.querySelector('.set').classList.add('hidden');
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

	let gear_copy = Object.values(gear).map(element => Object.values(element));
	let enchantments_copy = Object.values(gear_enchantments).map(element => Object.values(element));

	let sorted_gear = structuredClone(gear_copy).map(element => element.sort(sort_alg));
	let sorted_enchantments = structuredClone(enchantments_copy).map(element => element.sort(sort_alg));
	let combined_gear = structuredClone(gear_copy);
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

	selectors.forEach((element, index) => {
		element.setAttribute('data-selected', final_preset.gear[index].id ?? 0);
		if (final_preset.gear[index].variants) {
			element.setAttribute('data-selected-variant', final_preset.variants[index].id)
		}
	});
	enchantment_selectors.forEach((element, index) => element.setAttribute('data-selected', final_preset.enchantments[index].id));

	calculate();
	update_images();
	preset_menu.hidePopover();
}


function set_handler() {
	
	for (let [index, element] of selected.entries()) {
		if (element.set) {
			selectors[index].parentElement.querySelector('.set').classList.remove('hidden');
		} else if (!element.set) {
			selectors[index].parentElement.querySelector('.set').classList.add('hidden');
		}

		selectors[index].parentElement.querySelector('.set').addEventListener('click', () => {
			let set_map = gear_copy.map(element2 => element2.map(a => new Object({[a.set]: a})));

			for (let [index2, element2] of set_map.entries()) {
				for (let element3 of element2) {
					if (element3[selected[index].set]) {
						selectors[index2].setAttribute('data-selected', element3[selected[index].set].id);
						calculate();
						update_images();
					}
				}
			}

			selectors[index].parentElement.querySelector('.set').classList.add('hidden');
		})
	}
}

export {copy_code, share_link, find_by_id, preset_build}