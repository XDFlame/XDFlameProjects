function number_format(n) {
	return Intl.NumberFormat(navigator.language).format(n)
}

function sign_check(n) {
	return n <= 0? `${n}` : `+${n}`;
}

function display(piece) {

	let final_string = [];

	for (let i in stat_display) {

		if (i <= 1) {
			final_string[i] = `${stat_display[i]}: ${number_format(piece[stat_index.find((x) => x === stat_display[i].toLowerCase().replace(' ', '_'))])}`
		}

		if (i == 2) {
			final_string[i] = `${stat_display[i]}: ${piece[stat_index.find((x) => x === stat_display[i].toLowerCase().replace(' ', '_'))]}%`
		}

		if (i == 3 || i >= 5) {
			final_string[i] = `${stat_display[i]}: ${sign_check(piece[stat_index.find((x) => x === stat_display[i].toLowerCase().replace(' ', '_'))])}%`
		}

		if (i == 4) {
			final_string[i] = `${stat_display[i]}: ${sign_check(piece[stat_index.find((x) => x === stat_display[i].toLowerCase().replace(' ', '_'))])} HP/s`;
		}
	}

	return final_string.join('<br>')
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
		document.querySelectorAll('.gear_image')[i].style.backgroundImage = `url("images/${gear_strings[i]}/${selected[i].name}.png"), url(images/background.png)`
		document.querySelectorAll('.gear_image')[i].src = `images/frames/${selected[i].rarity}.png`

		document.querySelectorAll('.charm_image')[i].style.backgroundImage = `url("images/charms/${selected_enchantments[i].name}.png"), url(images/background.png)`
		document.querySelectorAll('.charm_image')[i].src = `images/frames/${selected_enchantments[i].rarity}.png`
	}
}