"use strict"

import {gear, stat_display, stat_index, popovers} from './initialize.js';
import {calculate} from './calculate.js';

for (let [index, stat] of stat_display.entries()) {
	let input = document.createElement('input');
	input.type = 'number';
	input.id = `custom_${stat_index[index]}_input`;
	input.classList.add('build');

	let label = document.createElement('label');
	label.textContent = `${stat}: `;
	label.setAttribute('for', input.id);

	custom_gear_menu.querySelector(':nth-child(2 of .sub-container)').append(label, input);
};

const buttons = custom_gear_menu.querySelectorAll('button');
const inputs = custom_gear_menu.querySelectorAll('.sub-container > input');
let selected_custom_type;
let customs_array = [...Object.values(gear)].map(a=>Object.values(a)).flat().filter(x => x.name === 'Custom');

for (let [index, element] of buttons.entries()) {
	element.addEventListener('click', () => {
		buttons.forEach(btn => btn.classList.remove('active'));
		element.classList.add('active');
		selected_custom_type = Number(element.value);

		inputs.forEach((element, index2) => {
			element.value = (customs_array[index][stat_index[index2]] ?? 0);
		});
	});
};

for (let [index, element] of inputs.entries()) {
	element.addEventListener('input', () => {
		customs_array[selected_custom_type][stat_index[index]] = Number(element.value);
		calculate();
	});
};

show_custom_gear.addEventListener('click', () => {
	for (let [index, element] of popovers.entries()) {
		element.querySelectorAll('.grid-wrapper > img').forEach(img => {
			if (img.getAttribute('data-id') == customs_array[index].id) {
				img.classList.toggle('hidden');
			}
		});
	};
});

buttons[0].click();

export {customs_array}