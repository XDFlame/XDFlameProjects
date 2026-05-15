"use strict"

function compare_builds() {

	let code_1 = compare_menu.querySelector('input:nth-of-type(1)').value;
	let code_2 = compare_menu.querySelector('input:nth-of-type(2)').value;

	console.log(code_1, code_2)
}

/*function create_clone() {

	let container = document.querySelector('.container2')
	container.classList.toggle('compare');
	let children = container.children;

	if (!container.classList.contains('compare')) {
		document.querySelectorAll('.clone').forEach(element => element.remove())
	} else {
		[...children].forEach(element => {
			let clone = element.cloneNode(true);
			clone.querySelectorAll('select').forEach(element_2 => element_2.id += '_clone')
			clone.style.gridArea += '2'
			clone.classList.add('clone')
			container.appendChild(clone)
		})

		clone_selectors = [
			hat_selector_clone,
			shirt_selector_clone,
			pants_selector_clone,
			accessory_1_selector_clone,
			accessory_2_selector_clone
		]

		clone_enchantment_selectors = [
			hat_enchantment_selector_clone,
			shirt_enchantment_selector_clone,
			pants_enchantment_selector_clone,
			accessory_1_enchantment_selector_clone,
			accessory_2_enchantment_selector_clone
		]
	}
}*/