function number_format(n) {
	return Intl.NumberFormat(navigator.language).format(n)
}

function sign_check(n) {
	return n <= 0? `${n}` : `+${n}`;
}


let mouse
window.addEventListener('mousemove', (x) => {
	mouse = x
})

for (let i = 0; i < 5; i++) {

	document.querySelectorAll('.container2 button')[i].addEventListener('mousemove', function show_output() {
		output.innerHTML = display(finals[i]);
		output.style.visibility = 'visible';
		output.style.opacity = 1;
		output.style.left = `${mouse.x - output.offsetWidth}px`;
		output.style.top = `${mouse.y}px`;
	})

	document.querySelectorAll('.container2 button')[i].addEventListener('mouseout', function test() {
		output.style.visibility = 'hidden'
		output.style.opacity = 0;
		output.textContent = ''
	})
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