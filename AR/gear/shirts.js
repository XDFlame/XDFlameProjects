const shirts = [
	{
		name: 'None',
		level: 0,
		rarity: 'none',
	},
	{
		name: 'Alalean Guard\'s Armor',
		level: 220,
		rarity: 'uncommon',
		defense: 650,
	},
	{
		name: 'Alalean Guard Captain\'s Armor',
		level: 275,
		rarity: 'rare',
		defense: 750,
	},
	{
		name: 'Ancient Legionnaire\'s Gauntlets',
		level: 350,
		rarity: 'exotic',
		defense: 1000,
		damage_reduction: 3,
	},
	{
		name: 'Evil Wizard Robes',
		level: 320,
		rarity: 'rare',
		magic_power: 100,
		magic_energy: 15,
	},
	{
		name: 'Midnight Mage Robes',
		level: 300,
		rarity: 'uncommon',
		magic_power: 100,
	},
	{
		name: 'Preserved Empyrean Armor',
		level: 280,
		rarity: 'rare',
		defense: 650,
		magic_power: 20,
	},
	{
		name: 'Prometheus\' Toga',
		level: 320,
		rarity: 'exotic',
		magic_power: 130,
	},
	{
		name: 'Quartermaster\'s Cloak',
		level: 320,
		rarity: 'rare',
		defense: 900,
	},
	{
		name: 'Rupin\'s Cloak',
		level: 285,
		rarity: 'exotic',
		defense: 450,
		magic_power: 70,
	},
	{
		name: 'Sunken Champion Armor',
		level: 250,
		rarity: 'legendary',
		defense: 650,
		magic_power: 50,
		/*scaling: {
			start: 250,
			end: 350,
			defense: 2,
			magic_power: 0.2
		}*/
	},
	{
		name: 'Sunken Warrior Armor',
		level: 100,
		rarity: 'legendary',
		defense: 300,
		magic_power: 25,
		scaling: {
			start: 100,
			end: 200,
			defense: 2,
			magic_power: 0.15
		}
	},
	{
		name: 'Emerald Captain\'s Cloak',
		level: 200,
		rarity: 'exotic',
		defense: 350,
		magic_power: 50,
	}
]


const shirt_enchantments = [
	{
		name: 'None',
		rarity: 'none',
	},
	{
		name: 'Agile',
		rarity: 'common',
		movement_speed: 5,
		jump_power: 5
	},
	{
		name: 'Armored',
		rarity: 'common',
		defense: 200,
	},
	{
		name: 'Berserk',
		rarity: 'rare',
		magic_power: 20,
	},
	{
		name: 'Blessed',
		rarity: 'rare',
		magic_power: 40,
	},
	{
		name: 'Cursed',
		rarity: 'legendary',
		health_bonus: -10,
	},
	{
		name: 'Dynamic',
		rarity: 'common',
		stamina: 20,
	},
	{
		name: 'Enchanted',
		rarity: 'common',
		magic_power: 20,
	},
	{
		name: 'Hardened',
		rarity: 'common',
		defense: 100,
	},
	{
		name: 'Hasty',
		rarity: 'rare',
		magic_power: 30,
		movement_speed: 5,
	},
	{
		name: 'Heavenly',
		rarity: 'legendary',
		health_regen: 7,
		jump_power: 5
	},
	{
		name: 'Heroic',
		rarity: 'rare',
		defense: 185,
		magic_power: 15,
	},
	{
		name: 'Holy',
		rarity: 'common',
		health_regen: 3,
	},
	{
		name: 'Indestructible',
		rarity: 'legendary',
		defense: 600,
		stamina_regen: -10,
		stun_resistance: 7
	},
	{
		name: 'Magical',
		rarity: 'common',
		magic_energy: 20,
	},
	{
		name: 'Nimble',
		rarity: 'common',
		movement_speed: 10,
	},
	{
		name: 'Resilient',
		rarity: 'legendary',
		damage_reduction: 7,
	},
	{
		name: 'Skyward',
		rarity: 'common',
		jump_power: 10
	},
	{
		name: 'Spiritual',
		rarity: 'rare',
		magic_power: 25,
		magic_energy: 15,
	},
	{
		name: 'Striking',
		rarity: 'rare',
		magic_power: 30,
		jump_power: 5
	},
	{
		name: 'Superior',
		rarity: 'common',
		defense: 85,
		magic_power: 15,
	},
	{
		name: 'Transcendent',
		rarity: 'legendary',
		defense: 200,
		magic_power: 40,
	},
	{
		name: 'Vigorous',
		rarity: 'rare',
		magic_energy: 10,
		stamina: 10,
		stamina_regen: 10,
	},
	{
		name: 'Zealous',
		rarity: 'legendary',
		movement_speed: 10,
		jump_power: 10,
	},
]

let final_shirt = {}