"use strict"

// Handles click functionality of copy build button

function copy_code() {
	navigator.clipboard.writeText(export_code());
	copy.classList.toggle('active');
	setTimeout(x => copy.classList.toggle('active'), 500);
}


function share_link() {
	let url = window.location.href;
	let object = {code: export_code()}
	
	let search_params = new URLSearchParams(object);
	let query_string = search_params.toString()

	navigator.clipboard.writeText(`${url}?${query_string}`)
	share.classList.toggle('active');
	setTimeout(x => share.classList.toggle('active'), 500);
}


// Adds event listeners

for (let i in selectors) {

	selectors[i].addEventListener('change', calculate);
	selectors[i].addEventListener('change', update_images)

	enchantment_selectors[i].addEventListener('change', calculate);
	enchantment_selectors[i].addEventListener('change', update_images);
}

for (let i in magic_selectors) {
	magic_selectors[i].addEventListener('change', calculate);
}

for (let i = 0; i < 3; i++) {
	document.querySelectorAll('input')[i].addEventListener('change', calculate);
}

for (let i in filter_selectors) {
	filter_selectors[i].addEventListener('change', filter)
}

for (let i = 0 ; i < sorting_selector.children.length; i++) {
	sorting_selector.children[i].addEventListener('change', sort_gear)
}

all_selector.addEventListener('change', () => {
	for (let i in filter_selectors) {
		for (let i2 = 0; i2 < filter_selectors[i].children.length; i2++) {
			filter_selectors[i].children[i2].children[0].checked = event.target.checked
		}
	}
	filter()
})


// Random build function

function random_build() {

	let random_gear = [];
	let random_gear_enchantments = [];
	let random_magics = [];
	let apply_random_filters = random_filters.checked;

	let allowed_gear_ids = [[],[],[],[],[]];
	let allowed_enchantment_ids = [[],[],[],[],[]];

	if (apply_random_filters === true) {
		allowed_gear_ids = filtered_in_gear_ids
		allowed_enchantment_ids = filtered_in_enchantment_ids
	} 
	
	else {

		gear.forEach( (element, index) => {
			allowed_gear_ids[index] = element.map(element_2 => element_2.id);
			allowed_gear_ids[index].shift();
		})

		gear_enchantments.forEach( (element, index) => {
			allowed_enchantment_ids[index] = element.map(element_2 => element_2.id);
			allowed_enchantment_ids[index].shift();
		})
	}

	// If all filters are deselected, sets random gear to "None"

	allowed_gear_ids.forEach(element => {if (element.length === 0) {element.push(0)}});
	allowed_enchantment_ids.forEach(element => {if (element.length === 0) {element.push(0)}});

	for (let i = 0; i < 5; i++) {

		random_gear[i] = allowed_gear_ids[i][Math.floor(Math.random() * allowed_gear_ids[i].length)]
		selectors[i].selectedIndex = gear[i].findIndex(x => x.id === random_gear[i]);

		random_gear_enchantments[i] = allowed_enchantment_ids[i][Math.floor(Math.random() * allowed_enchantment_ids[i].length)]
		enchantment_selectors[i].selectedIndex = gear_enchantments[i].findIndex(x => x.id === random_gear_enchantments[i]);
	};

	for (let i = 0; i < 3; i++) {
		random_magics[i] = Math.floor(Math.random() * magics.length);
		magic_selectors[i].selectedIndex = magics.findIndex(x => x.id === random_magics[i]);
	}

	calculate();
	update_images();
}


function clear_build(target) {

	switch(target) {
		case 'gear':
			selectors.forEach(element => element.selectedIndex = 0);
			break;
		case 'enchantments':
			enchantment_selectors.forEach(element => element.selectedIndex = 0);
	}

	health_slider.value = 100;

	calculate();
	update_images();
}


function search_saves() {

	let query = save_search.value.toLowerCase();

	let builds = save_menu.querySelectorAll('button.build')
	builds.forEach((element) => element.style.display = 'none')

	let build_names = [...builds].map((element) => element.innerText.toLowerCase())
	build_names.forEach(
		(element, index) => {
			if (element.includes(query)) {
				builds[index].style.display = 'unset'
			}
		}
	);
}