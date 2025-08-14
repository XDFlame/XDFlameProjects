// Creates nav element and adds image

	let nav = document.createElement('nav');
	let img = document.createElement('img');
	img.src = 'https://xdflame.epizy.com/Style/hamburger_icon.png';
	nav.append(img);


// Creates <ul> and <li>'s then fills them in with content[i]

	let content = [
		'<a href="https://xdflame.epizy.com/">Home</a>',
		'<hr>',
		'<a href="https://xdflame.epizy.com/AR/pity_calculator.html">AR Pity Calculator</a>',
		'<a href="https://xdflame.epizy.com/AR/alchemist_calculator.html">AR Alchemist Calculator</a>',
		'<a href="https://xdflame.epizy.com/AR/gear_builder.html">AR Gear Builder</a>',
		'<hr>',
		'<a href="https://xdflame.epizy.com/EP/level_calculator.html">EP Leveling Time Calculator</a>',
	];

	nav.append(document.createElement('ul'));
	for (let i in content) {
		nav.children[1].appendChild(document.createElement('li')).innerHTML = content[i];
	}


// Adds it to body

	document.querySelector('body').appendChild(nav);


// Handles click toggle

	img.onclick = function toggle() {
		nav.classList.toggle('visible');
	}