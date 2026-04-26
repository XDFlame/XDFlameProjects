"use strict"

let level;
let magic_level;
let strength_level;

function clamp(n, min, max) {
	return Math.min(Math.max(n, min), max);
}


function armor_scaling(piece, stat) {
	return piece[stat] + clamp(level - piece.scaling.start, 0, piece.scaling.end - piece.scaling.start) * piece.scaling[stat];
}


function level_lock() {
	
	for (let i in gear) {

		for (let i2 in gear[i]) {
			[...selectors[i]].find(x => x.value == gear[i][i2].id).disabled = (gear[i][i2].level > level);
		}

		if (selected[i].level > level) {
			selectors[i].selectedIndex = 0;
			selected[i] = gear[i].find(x => x.id === 0);
			update_images();
		}
	}
}


function enchantment_lock() {

	for (let i in selected) {

		enchantment_selectors[i].disabled = !selected[i].enchantable;

		if (selected[i].enchantable === false) {
			enchantment_selectors[i].selectedIndex = 0;
			selected_enchantments[i] = gear_enchantments[i].find(x => x.id === 0);
			update_images();
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
		document.querySelectorAll('button.info')[3].classList.add('conflict');
		document.querySelectorAll('button.info')[4].classList.add('conflict');
	}
	else {
		document.querySelectorAll('button.info')[3].classList.remove('conflict');
		document.querySelectorAll('button.info')[4].classList.remove('conflict');
	}
}


function calculate_q() {

	let strings = ['First', 'Second', 'Third']
	let ul = document.createElement('ul')

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
			(level/2 + magic_level/4 + selected_magics[i].base_damage) * selected_magics[i].base_efficiency +
			final_build.magic_power * selected_magics[i].power_efficiency * selected_magic_tiers[i]/5
		)

		let li = document.createElement('li');
		li.innerText = `${strings[i]} Magic Q Damage: ${number_format(final_magic_damage[i])}`;
		ul.appendChild(li);
	}

	return ul;
}


function health_scaling() {

	let value = Number(health_slider.value)

	let damage_reduction = final_build.damage_reduction;
	let health_decimal = value/100

	if (health_decimal <= 0.8) {
		let mult = clamp(health_decimal + 0.2, 0.4, 1)
		damage_reduction = damage_reduction * mult
	}

	let effective_health = number_format(Math.round((level * 7 + 93 + final_build.defense) * (1 + final_build.health_bonus/100) / (1 - damage_reduction/100)))

	document.querySelector('.output ul li:nth-of-type(3)').innerText = `Damage Reduction: ${Math.round(damage_reduction)}%`
	document.querySelector('.output ul:nth-of-type(2) li:nth-of-type(2)').innerText = `Effective Health: ${effective_health}`;

	for (let i in selected_enchantments) {
		if (selected_enchantments[i].name === 'Berserk') {
			finals[i].magic_power = Math.floor(armor_scaling(selected[i], 'magic_power') + selected_enchantments[i].magic_power * clamp(100/health_slider.value, 1, 4));
		}
	}

	final_build.magic_power = 0;
	for (let i in finals) {
		final_build.magic_power += finals[i].magic_power
	}

	document.querySelector('.output ul li:nth-of-type(2)').innerText = `Magic Power: ${Math.round(final_build.magic_power)}`
	document.querySelector('div.slider span:nth-of-type(2)').innerText = `${value}%`
	document.querySelectorAll('.output ul')[2].remove();
	document.querySelector('.output').appendChild(calculate_q())
}


function calculate() {

	// Defines variables

	level = Number(level_input.value);
	magic_level = Number(magic_level_input.value);
	strength_level = Number(strength_level_input.value);

	stat_index.forEach(
		element => final_build[element] = 0
	)

	for (let i = 0; i < 5; i++) {
		selected[i] = gear[i].find(x => x.id === Number(selectors[i].value));
		selected_enchantments[i] = gear_enchantments[i].find(x => x.id === Number(enchantment_selectors[i].value));
	}

	level_lock();
	enchantment_lock();
	dupe_warn();


	// Sets magic power value for cursed to the extra value cursed would add per piece
	
	gear_enchantments.forEach((element, index) => {
		element.find(x => x.name === 'Cursed').magic_power = armor_scaling(selected[index], 'magic_power') * 0.4 + 62;
	})


	// Sets final values for each piece to the stats of the selected one + its respective enchantment, then sums each one into final_build object

	finals.forEach((element, index) => {
		stat_index.forEach(stat => {
			element[stat] = Math.floor(armor_scaling(selected[index], stat) + selected_enchantments[index][stat]);
			final_build[stat] += element[stat];
		})
	})


	// Outputs stats

	document.querySelector('.output').innerHTML = '';
	document.querySelector('.output').appendChild(display(final_build));
	document.querySelector('.output').innerHTML += `
		<hr>
		<ul>
			<li>Max Health: ${number_format(Math.round((level * 7 + 93 + final_build.defense) * (1 + final_build.health_bonus/100)))}
			<li>Effective Health:
			<li>Health Regen: ${Math.round(((level * 7 + 93) * 0.01) + final_build.defense/1000 + final_build.health_regen)} HP/s
			<li>Magic Energy: ${number_format(Math.floor((magic_level * 5 + 25) * (1 + final_build.magic_energy/100)))}
			<li>Magic Energy Regen: ${number_format(Math.floor((magic_level * 5 + 25) * (1 + final_build.magic_energy/100) * 0.2))}/s
			<li>Stamina: ${number_format(Math.floor((strength_level * 5 + 25) * (1 + final_build.stamina/100)))}
			<li>Stamina Regen: ${number_format(Math.floor((strength_level * 5 + 25) * (1 + (final_build.stamina + final_build.stamina_regen)/100) * 0.1))}/s
		</ul>
		<hr>
	`;
	document.querySelector('.output').appendChild(calculate_q())

	health_scaling();
}