function clamp(n, min, max) {
	return Math.min(Math.max(n, min), max);
}


function armor_scaling(piece, stat) {
	return piece[stat] + clamp(level - piece.scaling.start, 0, piece.scaling.end - piece.scaling.start) * piece.scaling[stat];
}


function level_lock() {
	
	for (let i in gear) {

		for (let i2 in gear[i]) {
			gear[i][i2].level > level?
			selectors[i][i2].disabled = true:
			selectors[i][i2].disabled = false;
		}

		if (selected[i].level > level) {
			selectors[i].selectedIndex = 0;
			selected[i] = gear[i].find((x) => x.id === 0);
			update_images();
		}
	}
}


function enchantment_lock() {

	for (let i in selected) {

		enchantment_selectors[i].disabled = !selected[i].enchantable;

		if (!selected[i].enchantable) {
			enchantment_selectors[i].selectedIndex = 0;
			selected_enchantments[i] = gear_enchantments[i].find((x) => x.id === 0);
			update_images();
		}
	}
}


function dupe_warn() {

	if (
		selected[3].name !== 'None' &
		(selected[3].name === selected[4].name) &&
		(selected_enchantments[3].name === selected_enchantments[4].name)
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

	for (let i = 0; i < 3; i++) {

		for (let i2 in magic_tiers) {

			if (magic_level >= (magic_tiers[i2] + 100 * i + 100 * (Math.max(i - 1, 0)))) {
				selected_magic_tiers[i] = magic_tiers.length - i2;
				break;
			} else {
				selected_magic_tiers[i] = 0;
			}
		}

		selected_magics[i] = magics.find((x) => x.id === Number(magic_selectors[i].value));
		final_magic_damage[i] = Math.round(
			(level/2 + magic_level/4 + selected_magics[i].base_damage) * selected_magics[i].base_efficiency +
			final_build.magic_power * selected_magics[i].power_efficiency * selected_magic_tiers[i]/5
		)
	}
}


function calculate() {

	// Defines variables

	level = Number(level_input.value);
	magic_level = Number(magic_level_input.value);
	strength_level = Number(strength_level_input.value);

	for (let i in stat_index) {
		final_build[stat_index[i]] = 0;
	}

	for (let i = 0; i < 5; i++) {
		selected[i] = gear[i].find((x) => x.id === Number(selectors[i].value));
		selected_enchantments[i] = gear_enchantments[i].find((x) => x.id === Number(enchantment_selectors[i].value));
	}

	level_lock();
	enchantment_lock();
	dupe_warn();

	// Sets magic power value for cursed to the extra value cursed would add per piece
	
	for (let i in gear_enchantments) {
		gear_enchantments[i].find((x) => x.name === 'Cursed').magic_power = armor_scaling(selected[i], 'magic_power') * 0.4 + 62;
	}


	// Sets final values for each piece to the stats of the selected one + its respective enchantment

	for (let i in finals) {

		for (let i2 in stat_index) {
			let stat = stat_index[i2];
			finals[i][stat] = Math.floor(armor_scaling(selected[i], stat) + selected_enchantments[i][stat]);
		}
	}


	// Adds the values of all the final pieces into one singular final_build object with the entire build's stats

	for (let i in finals) {

		for (let i2 in stat_index) {
			let stat = stat_index[i2]
			final_build[stat] += finals[i][stat]
		}
	}

	calculate_q();

	// Outputs stats

	for (let i in finals) {
		document.querySelectorAll('.output')[i].innerHTML = display(finals[i]);
	}

	document.querySelectorAll('.output')[5].innerHTML = display(final_build);
	document.querySelectorAll('.output')[5].innerHTML += `
		<br><hr>
		Health: ${number_format(Math.round((level * 7 + 93 + final_build.defense) * (1 + final_build.health_bonus/100)))}<br>
		Health Regen: ${Math.round(((level * 7 + 93) * 0.01) + final_build.defense/1000 + final_build.health_regen)} HP/s<br>
		Magic Energy: ${number_format(Math.floor((magic_level * 5 + 25) * (1 + final_build.magic_energy/100)))}<br>
		Magic Energy Regen: ${number_format(Math.floor((magic_level * 5 + 25) * (1 + final_build.magic_energy/100) * 0.2))}/s<br>
		Stamina: ${number_format(Math.floor((strength_level * 5 + 25) * (1 + final_build.stamina/100)))}<br>
		Stamina Regen: ${number_format(Math.floor((strength_level * 5 + 25) * (1 + (final_build.stamina + final_build.stamina_regen)/100) * 0.1))}/s
		<br><hr>
		First Magic Q Damage: ${number_format(final_magic_damage[0])}<br>
		Second Magic Q Damage: ${number_format(final_magic_damage[1])}<br>
		Third Magic Q Damage: ${number_format(final_magic_damage[2])}<br>
	`
}