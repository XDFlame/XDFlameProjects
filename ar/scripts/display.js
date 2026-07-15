"use strict"

import {stat_index, stat_display, selected, selected_enchantments, selected_magics} from './initialize.js';
import {selected_variants, finals, final_build, level, magic_level, strength_level} from './calculate.js';

const stat_colors = ['#8B8A89', '#FF8A14', '#bd0efa', '#B40E0E', '#f0ef59', '#FF94DD', '#99c558', '#81B03B', '#6AFD2D', '#3FB5F6', '#0c38fc']

function number_format(n) {
	return Intl.NumberFormat(navigator.language).format(n)
}

function sign_check(n) {
	return n <= 0? `${n}` : `+${n}`;
}

function display(piece) {

	let final_string = [];
	let final_list = document.createElement('ul');
	let final_icons = [];

	stat_index.forEach((stat, index) => {

		if (!piece[stat]) {return}

		if (index <= 1) {
			final_string[index] = `${stat_display[index]}: ${number_format(piece[stat])}`
		}

		if (index == 2) {
			final_string[index] = `${stat_display[index]}: ${piece[stat]}%`
		}

		if (index == 3 || index >= 5) {
			final_string[index] = `${stat_display[index]}: ${sign_check(piece[stat])}%`
		}

		if (index == 4) {
			final_string[index] = `${stat_display[index]}: ${sign_check(piece[stat])} HP/s`;
		}

		let div = document.createElement('div');
		div.classList.add('stat')
		div.style.backgroundColor = stat_colors[index];
		div.style.mask = `url('/style/icons/stats/${stat}.svg')`;
		final_icons[index] = div;
	})

	for (let i in final_string) {

		let split = final_string[i].split(':');

		let span = document.createElement('span');
		span.append(split[1])
		span.style.color = stat_colors[i];

		let final_list_li = document.createElement('li');
		final_list_li.append(`${split[0]}: `, final_icons[i], span)
		final_list.appendChild(final_list_li);
	}

	return final_list;
}


function display_player_stats() {

	let base_health = level * 7 + 93;
	let max_health = (base_health + (final_build.defense ?? 0)) * (1 + (final_build.health_bonus ?? 0)/100);
	let effective_health = max_health / (1 - (final_build.damage_reduction ?? 0)/100)
	let health_regen = (base_health * 0.01 + ((final_build.defense ?? 0)/1000) + (final_build.health_regen ?? 0)).toFixed(1);
	let magic_energy = (magic_level * 5 + 25) * (1 + (final_build.magic_energy ?? 0)/100);
	let magic_energy_regen = magic_energy * 0.2;
	let stamina = (strength_level * 5 + 25) * (1 + (final_build.stamina ?? 0)/100);
	let stamina_regen = stamina * (1 + (final_build.stamina_regen ?? 0)/100) * 0.1;

	let player_stats_text = ['Max Health', 'Effective Health', 'Health Regen', 'Magic Energy', 'Magic Energy Regen', 'Stamina', 'Stamina Regen'];
	let player_stats_icons = ['health_bonus', 'damage_reduction', 'health_regen', 'magic_energy', 'magic_energy_regen', 'stamina', 'stamina_regen'];
	let player_stats_colors = ['#B40E0E', '#bd0efa', '#f0ef59', '#FF94DD', '#FF61CC', '#99c558', '#81B03B']
	let player_stats = [max_health, effective_health, null, magic_energy, magic_energy_regen, stamina, stamina_regen].map(n=>number_format(Math.round(n)));
	player_stats[2] = health_regen;

	let ul = document.createElement('ul');

	for (let [index, text] of player_stats_text.entries()) {

		let li = document.createElement('li');

		let div = document.createElement('div');
		div.classList.add('stat')
		div.style.backgroundColor = player_stats_colors[index];
		div.style.mask = `url('/style/icons/stats/${player_stats_icons[index]}.svg')`;
		player_stats_icons[index] = div;

		let span = document.createElement('span');
		span.append(player_stats[index]);

		if (index === 2) {span.append(' HP')};
		if ([2, 4, 6].includes(index)) {span.append('/s')};

		span.style.color = player_stats_colors[index];

		li.append(`${text}: `, player_stats_icons[index], span)
		ul.appendChild(li);
	};

	return ul;
}


function display_magics(array) {

	let ul = document.createElement('ul');

	let strings = ['First', 'Second', 'Third'];
	let magic_colors = {Earth: '#7f3300', Fire: '#ff4400', Light: '#fff601', Lightning: '#01ffff', Shadow: '#585858', Water: '#0095ff', Wind: '#a0a0a0'};
	let magic_icons = []

	for (let [index, entry] of array.entries()) {

		let li = document.createElement('li');

		let div = document.createElement('div');
		div.classList.add('stat')
		div.style.backgroundColor = magic_colors[selected_magics[index].name];
		div.style.mask = `url('/style/icons/magics/${selected_magics[index].name.toLowerCase()}.svg')`;
		magic_icons[index] = div;

		let span = document.createElement('span');
		span.style.color = magic_colors[selected_magics[index].name];
		span.append(number_format(entry));

		li.append(`${strings[index]}  Magic Q Damage: `, div, span);
		ul.append(li);
	}

	return ul;
}


function update_images() {

	const gear_strings = [
		'hats',
		'shirts',
		'pants',
		'accessories',
		'accessories',
	];

	for (let i = 0; i < 5; i++) {
		document.querySelectorAll('.gear_image')[i].style.backgroundImage = `
			url("images/overlays/${selected_enchantments[i].name}.png"),
			url("images/${gear_strings[i]}/${selected[i].name}.png"),
			url(images/background.png)
		`

		if (selected[i].variants) {
			document.querySelectorAll('.gear_image')[i].style.backgroundImage = `
				url("images/overlays/${selected_enchantments[i].name}.png"),
				url("images/${gear_strings[i]}/${selected[i].name}/${selected_variants[i].name}.png"),
				url(images/background.png)
			`
		}

		document.querySelectorAll('.gear_image')[i].src = `images/frames/${selected[i].rarity}.png`

		document.querySelectorAll('.charm_image')[i].style.backgroundImage = `url("images/charms/${selected_enchantments[i].name}.png"), url(images/background.png)`
		document.querySelectorAll('.charm_image')[i].src = `images/frames/${selected_enchantments[i].rarity}.png`
	}
}

export {number_format, display, display_player_stats, display_magics, update_images}