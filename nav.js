"use strict"

{
	// Creates nav element and adds image

	let nav = document.createElement('nav');
	let img = document.createElement('img');
	img.src = '/style/icons/hamburger.svg';
	nav.appendChild(img);


	// Creates <ul> then fills it with content

	let content = [
		{link: '/index.html', text: 'Home'},
		null,
		{link: '/ar/pity_calculator.html', text: 'AR Pity Calculator'},
		{link: '/ar/alchemist_calculator.html', text: 'AR Alchemist Calculator'},
		{link: '/ar/gear_builder.html', text: 'AR Gear Builder'},
		null,
		{link: '/ep/level_calculator.html', text: 'EP Leveling Time Calculator'}
	]

	let ul = document.createElement('ul');

	content.forEach(element => {
		let li = document.createElement('li');

		if (element !== null) {
			let a = document.createElement('a');
			a.href = element.link
			a.textContent = element.text;
			li.appendChild(a);
		} else {
			let hr = document.createElement('hr');
			li.appendChild(hr);
		};

		ul.appendChild(li);
	});

	nav.appendChild(ul);
	document.body.appendChild(nav);


	// Handles click toggle

	img.onclick = () => {
		nav.classList.toggle('visible');
	}
}