"use strict"

import {
	selected, selected_enchantments, magics, selected_magics,
	selectors, enchantment_selectors, magic_selectors,
	gear, gear_enchantments, add_build
} from './initialize.js';
import {level, magic_level, strength_level, calculate, selected_variants} from './calculate.js';
import {encode, big_encode, decode, big_decode} from './base64.js';
import {find_by_id} from './misc.js';
import {update_images} from './display.js';

function export_code() {

	let version = 1;
	let final_code = [version];

	// First chunk: levels

	let player_levels = [level, magic_level, strength_level];
	let player_level_strings = [];

	player_levels.forEach(element => {
		element++;
		let max = Math.max(...player_levels.map(n=>n+1)).toString(2).length;
		player_level_strings.push(element.toString(2).padStart(max, '0'))
	})

	final_code.push(encode(parseInt(player_level_strings.join(''), 2)))


	// Second chunk: gear

	let selected_ids = selected.map(element => element.id);
	let selected_gear_strings = [];

	selected_ids.forEach(element => {
		element++;
		let max = Math.max(...selected_ids.map(n=>n+1)).toString(2).length;
		selected_gear_strings.push(element.toString(2).padStart(max, '0'))
	});

	final_code.push(encode(parseInt(selected_gear_strings.join(''), 2)))


	// Third chunk: variants

	let selected_variant_ids = selected_variants.map(element => element.id);
	for (let i = 0; i < 5; i++) {
		if (!selected_variant_ids[i]) {selected_variant_ids[i] = 0}
	};
	let selected_variant_strings = [];

	selected_variant_ids.forEach(element => {
		element++;
		let max = Math.max(...selected_variant_ids.map(n=>n+1)).toString(2).length;
		selected_variant_strings.push(element.toString(2).padStart(max, '0'))
	})

	final_code.push(encode(parseInt(selected_variant_strings.join(''), 2)))


	// Fourth chunk: enchantments

	let selected_enchantment_ids = selected_enchantments.map(element => element.id)
	let selected_enchantment_strings = [];

	selected_enchantment_ids.forEach(element => {
		element++;
		let max = Math.max(...selected_enchantment_ids.map(n=>n+1)).toString(2).length;
		selected_enchantment_strings.push(element.toString(2).padStart(max, '0'))
	})

	final_code.push(encode(parseInt(selected_enchantment_strings.join(''), 2)))


	// Fifth chunk: magics

	let selected_magic_ids = selected_magics.map(element => element.id)
	let selected_magic_strings = [];

	selected_magic_ids.forEach(element => {
		element++;
		let max = Math.max(...selected_magic_ids.map(n=>n+1)).toString(2).length;
		selected_magic_strings.push(element.toString(2).padStart(max, '0'))
	})

	final_code.push(encode(parseInt(selected_magic_strings.join(''), 2)));

	return final_code.join('|')
}


function sort_code(code) {
	if (code.includes('|')) {
		import_code(code);
	} else if (code.length === 26 && !code.includes('|')) {
		legacy_import_code(code);
	}
}


function import_code(code, return_object) {

	code = code.split('|').map(element => decode(element).toString(2));
	code.splice(0, 1);
	let item_count = [3, 5, 5, 5, 3];
	let container = [];

	for (let i = 0; i < item_count.length; i++) {
		container[i] = code[i].padStart(Math.ceil(code[i].length / item_count[i]) * item_count[i], '0');
		let regex = new RegExp(`.{${container[i].length / item_count[i]}}`, 'g');
		container[i] = container[i].match(regex).map(n => parseInt(n, 2) - 1);
	};

	let levels = container[0];
	let equipment = container[1];
	let equipment_variants = container[2];
	let equipment_enchantments = container[3];
	let chosen_magics = container[4];

	if (return_object === true) {
		let object = {
			levels: [],
			gear: [],
			variants: [],
			gear_enchantments: [],
			magics: [],
		}

		levels.forEach(element => object.levels.push(element))
		equipment.forEach((element, index) => object.gear.push(find_by_id(gear[index], element)));
		equipment_variants.forEach((element, index) => object.variants.push(find_by_id(gear[index].variants, element)));
		equipment_enchantments.forEach((element, index) => object.gear_enchantments.push(find_by_id(gear_enchantments[index], element)));
		chosen_magics.forEach(element => object.magics.push(find_by_id(magics, element)));

		return object;
	}

	level_input.value = container[0][0];
	magic_level_input.value = container[0][1];
	strength_level_input.value = container[0][2];

	selectors.forEach((element, index) => {
		element.setAttribute('data-selected', equipment[index]);
		if (equipment_variants[index] !== 0) {
			element.setAttribute('data-selected-variant', equipment_variants[index]);
		}
	});

	enchantment_selectors.forEach((element, index) => element.setAttribute('data-selected', equipment_enchantments[index]));

	magic_selectors.forEach((element, index) => element.setAttribute('data-selected-magic', chosen_magics[index]));

	code_import.value = '';
	calculate();
	update_images();
}


function legacy_import_code(code, return_object) {
	code = code.match(/(.{7})(.{9})(.{6})(.{4})/).slice(1, 5);

	let levels = String(decode(code[0])).padStart(12, '0').match(/.{4}/g).map(Number);
	let equipment = String(decode(code[1])).padStart(15, '0').match(/.{3}/g).map(Number);
	let equipment_enchantments = String(decode(code[2])).padStart(10, '0').match(/.{2}/g).map(Number);
	let chosen_magics = String(decode(code[3])).padStart(6, '0').match(/.{2}/g).map(Number);

	if (return_object === true) {
		let object = {
			levels: [],
			gear: [],
			gear_enchantments: [],
			magics: [],
		}

		levels.forEach(element => object.levels.push(element + 1))
		equipment.forEach((element, index) => object.gear.push(find_by_id(gear[index], element)));
		equipment_enchantments.forEach((element, index) => object.gear_enchantments.push(find_by_id(gear_enchantments[index], element)));
		chosen_magics.forEach(element => object.magics.push(find_by_id(magics, element)));

		return object;
	}

	level_input.value = levels[0] + 1;
	magic_level_input.value = levels[1] + 1;
	strength_level_input.value = levels[2] + 1;

	selectors.forEach((element, index) => element.setAttribute('data-selected', equipment[index]));

	enchantment_selectors.forEach((element, index) => element.setAttribute('data-selected', equipment_enchantments[index]));

	magic_selectors.forEach((element, index) => element.setAttribute('data-selected-magic', chosen_magics[index]));

	code_import.value = '';
	calculate();
	update_images();
}


function save_build() {

	if (document.querySelector("#save_menu input.build") !== null) {
		return
	}

	let selected_build = save_menu.querySelector('.build.active');
	let saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

	if (selected_build !== null) {

		if (save_button.classList.contains('active')) {
			saved_builds.find(x => x.id == selected_build.value).code = export_code();
			localStorage.setItem('saved_builds', JSON.stringify(saved_builds))

			save_button.innerText = 'Overwritten!'
		}
		else {
			save_button.classList.add('active')
			save_button.innerText = 'Overwrite?'
			setTimeout(
				() => {
					save_button.classList.remove('active');
					save_button.innerText = 'Save'
				},
				1000
			);
		}
	}
	else {
		save_confirm();
	}
}


function save_confirm() {
	let name_input = document.createElement('input');
	name_input.type = 'text';
	name_input.placeholder = 'Build Name'
	name_input.classList.add('build')
	name_input.addEventListener('change', () => {

		let current_build = {
			code: export_code(),
			id: null,
			name: null,
		};

		current_build.name = event.target.value;

		let saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

		if (saved_builds === null || saved_builds.length === 0) {
			current_build.id = 0;
			localStorage.setItem('saved_builds', JSON.stringify([current_build]))
		} else {
			current_build.id = saved_builds[saved_builds.length - 1].id + 1;
			saved_builds.push(current_build);
			localStorage.setItem('saved_builds', JSON.stringify(saved_builds))
		}

		add_build(current_build)
		save_menu.removeChild(name_input)
	})
	save_menu.appendChild(name_input);
	name_input.focus();
}


function load_build() {
	let selected_build = save_menu.querySelector('.build.active');

	if (selected_build === null) {
		return
	};

	let saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

	sort_code(saved_builds.find(x => x.id == selected_build.value).code);
	
	selected_build.classList.toggle('active')
	save_menu.hidePopover();
}


function rename_build() {

	if (document.querySelector("#save_menu input.build") !== null) {
		return
	}

	let selected_build = save_menu.querySelector('.build.active');
	let saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

	if (selected_build === null) {
		return
	};

	let name_input = document.createElement('input');
	name_input.type = 'text';
	name_input.placeholder = 'Build Name'
	name_input.classList.add('build')
	name_input.addEventListener('change', () => {
		saved_builds.find(x => x.id == selected_build.value).name = event.target.value
		selected_build.innerText = event.target.value
		localStorage.setItem('saved_builds', JSON.stringify(saved_builds))
		selected_build.style.display = 'initial'
		save_menu.removeChild(name_input)
	})
	save_menu.insertBefore(name_input, selected_build);
	selected_build.style.display = 'none'
	name_input.focus();
}


function delete_build() {
	let selected_build = save_menu.querySelector('.build.active');

	if (selected_build === null) {
		return
	};

	if (delete_button.classList.contains('active')) {
		delete_confirm();
		delete_button.innerText = 'Deleted!'
	}
	else {
		delete_button.classList.add('active')
		delete_button.innerText = 'Confirm?'
		setTimeout(
			() => {
				delete_button.classList.remove('active');
				delete_button.innerText = 'Delete'
			},
			1000
		);
	}
}


function delete_confirm() {
	let selected_build = save_menu.querySelector('.build.active');
	let saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

	saved_builds.splice(saved_builds.findIndex((x) => x.id == selected_build.value), 1)
	localStorage.setItem('saved_builds', JSON.stringify(saved_builds));

	save_menu.removeChild(selected_build)
}


function decode_share_link() {
	let url = window.location.href;
	let search_params = new URL(url).searchParams;
	let entries = new URLSearchParams(search_params).entries();
	
	let code = Array.from(entries).flat()[1];

	if (code) {
		sort_code(code);
		history.pushState("object or string", '', window.location.href.split('?code=')[0]);
	}
}

export {
	export_code, sort_code, decode_share_link,
	save_build, load_build, rename_build, delete_build
}