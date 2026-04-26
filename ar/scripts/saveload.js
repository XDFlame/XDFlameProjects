"use strict"

function export_code() {

	let final_code = []

	// First chunk: levels

	let player_levels = [level, magic_level, strength_level];
	let player_level_strings = [];

	player_levels.forEach(element => player_level_strings.push((element - 1).toString().padStart(4, '0')))

	final_code.push(encode(player_level_strings.join(''), 7))

	// Second chunk: gear

	let selected_ids = selected.map(element => element.id)
	let selected_gear_strings = [];

	selected_ids.forEach(element => selected_gear_strings.push(element.toString().padStart(3, '0')))

	final_code.push(encode(selected_gear_strings.join(''), 9))

	// Third chunk: enchantments

	let selected_enchantment_ids = selected_enchantments.map(element => element.id)
	let selected_enchantment_strings = [];

	selected_enchantment_ids.forEach(element => selected_enchantment_strings.push(element.toString().padStart(2, '0')))

	final_code.push(encode(selected_enchantment_strings.join(''), 6))

	// Fourth chunk: magics

	let selected_magic_ids = selected_magics.map(element => element.id)
	let selected_magic_strings = [];

	selected_magic_ids.forEach(element => selected_magic_strings.push(element.toString().padStart(2, '0')))

	final_code.push(encode(selected_magic_strings.join(''), 4))

	return final_code.join('')
}


function import_code() {

	let code = code_import.value

	let levels = String(decode(code.slice(0, 7)));
	while (levels.length < 11) {levels = "0" + levels};
	level_input.value = Number(levels.slice(0, 3)) + 1;
	magic_level_input.value = Number(levels.slice(3, 7)) + 1;
	strength_level_input.value = Number(levels.slice(7, 11)) + 1;

	let equipment = String(decode(code.slice(7, 16)));
	while (equipment.length < 15) {equipment = "0" + equipment};
	for (let i in gear) {
		selectors[i].selectedIndex = gear[i].findIndex((x) => x.id === Number(equipment.slice(i * 3, i * 3 + 3)));
	};

	let equipment_enchantments = String(decode(code.slice(16, 22)));
	while (equipment_enchantments.length < 10) {equipment_enchantments = "0" + equipment_enchantments};
	for (let i = 0; i < 5; i++) {
		enchantment_selectors[i].selectedIndex = gear_enchantments[i].findIndex((x) => x.id === Number(equipment_enchantments.slice(i * 2, i * 2 + 2)));
	};

	let chosen_magics = String(decode(code.slice(22, 26)))
	while (chosen_magics.length < 6) {chosen_magics = "0" + chosen_magics};
	for (let i = 0; i < 3; i++) {
		magic_selectors[i].selectedIndex = magics.findIndex((x) => x.id === Number(chosen_magics.slice(i * 2, i * 2 + 2)));
	};

	code_import.value = '';

	calculate();
	update_images();
}


function save_build() {

	if (document.querySelector("#save_menu input.build") !== null) {
		return
	}

	let selected_build = save_menu.querySelector('.build.active');
	saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

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

	saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

	code_import.value = saved_builds.find((x) => x.id == selected_build.value).code;
	import_code();
	
	selected_build.classList.toggle('active')
	save_menu.hidePopover();
}


function rename_build() {

	if (document.querySelector("#save_menu input.build") !== null) {
		return
	}

	let selected_build = save_menu.querySelector('.build.active');
	saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

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
	saved_builds = JSON.parse(localStorage.getItem('saved_builds'));

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
		code_import.value = code;
		import_code();
		history.pushState("object or string", '', window.location.href.split('?code=')[0]);
	}
}