function save() {

	// First chunk: levels

	const player_levels = [level, magic_level, strength_level];
	let player_level_strings = [];

	for (let i in player_levels) {
		player_level_strings[i] = `${player_levels[i]-1}`
		while (player_level_strings[i].length < 4) {player_level_strings[i] = '0' + player_level_strings[i]}
	}

	// Second chunk: gear

	let selected_gear_strings = [];

	for (let i in selected) {
		selected_gear_strings[i] = `${selected[i].id}`
		while (selected_gear_strings[i].length < 3) {selected_gear_strings[i] = '0' + selected_gear_strings[i]}
	}

	// Third chunk: enchantments

	let selected_gear_enchantment_strings = [];

	for (let i in selected_enchantments) {
		selected_gear_enchantment_strings[i] = `${selected_enchantments[i].id}`
		while (selected_gear_enchantment_strings[i].length < 2) {selected_gear_enchantment_strings[i] = '0' + selected_gear_enchantment_strings[i]}
	}

	// Fourth chunk: magics

	let selected_magic_strings = [];

	for (let i in selected_magics) {
		selected_magic_strings[i] = `${selected_magics[i].id}`
		while (selected_magic_strings[i].length < 2) {selected_magic_strings[i] = '0' + selected_magic_strings[i]}
	}

	return encode(player_level_strings.join(''), 7) + encode(selected_gear_strings.join(''), 9) +
		encode(selected_gear_enchantment_strings.join(''), 6) + encode(selected_magic_strings.join(''), 4);
}


function load() {

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