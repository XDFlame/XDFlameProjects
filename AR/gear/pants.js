const pants = [
	{
		name: 'None',
		level: 0,
		rarity: 'none',
	},
	{
		name: 'Evil Wizard Pants',
		level: 320,
		rarity: 'rare',
		magic_power: 50,
		magic_energy: 15,
	},
	{
		name: 'Midnight Mage Pants',
		level: 300,
		rarity: 'uncommon',
		magic_power: 50,
	},
	{
		name: 'Preserved Empyrean Leggings',
		level: 280,
		rarity: 'rare',
		defense: 350,
		magic_power: 10,
	},
	{
		name: 'Prometheus\' Boots',
		level: 320,
		rarity: 'legendary',
		defense: 300,
		magic_power: 55,
	},
	{
		name: 'Prometheus\' Pants',
		level: 350,
		rarity: 'exotic',
		magic_power: 70,
	},
	{
		name: 'Quartermaster\'s Legs',
		level: 320,
		rarity: 'rare',
		defense: 400,
	},
	{
		name: 'Rupin\'s Boots',
		level: 285,
		rarity: 'exotic',
		defense: 220,
		magic_power: 40,
	},
	{
		name: 'Sunken Champion Leggings',
		level: 250,
		rarity: 'legendary',
		defense: 425,
		magic_power: 35,
		/*scaling: {
			start: 250,
			end: 350,
			defense: 1,
			magic_power: 0.1
		}*/
	},
	{
		name: 'Sunken Warrior Leggings',
		level: 100,
		rarity: 'legendary',
		defense: 150,
		magic_power: 10,
		scaling: {
			start: 100,
			end: 200,
			defense: 1,
			magic_power: 0.1,
		}
	},
	{
		name: 'Emerald Captain\'s Legs',
		level: 200,
		rarity: 'exotic',
		defense: 150,
		magic_power: 30,
	}
]


const pants_enchantments = [
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
		defense: 150,
	},
	{
		name: 'Berserk',
		rarity: 'rare',
		magic_power: 15,
	},
	{
		name: 'Blessed',
		rarity: 'rare',
		magic_power: 35,
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
		magic_power: 15,
	},
	{
		name: 'Hardened',
		rarity: 'common',
		defense: 85,
	},
	{
		name: 'Hasty',
		rarity: 'rare',
		magic_power: 25,
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
		defense: 140,
		magic_power: 10,
	},
	{
		name: 'Holy',
		rarity: 'common',
		health_regen: 3,
	},
	{
		name: 'Indestructible',
		rarity: 'legendary',
		defense: 500,
		stamina_regen: -10,
		stun_resistance: 6
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
		damage_reduction: 6,
	},
	{
		name: 'Skyward',
		rarity: 'common',
		jump_power: 10
	},
	{
		name: 'Spiritual',
		rarity: 'rare',
		magic_power: 15,
		magic_energy: 15,
	},
	{
		name: 'Striking',
		rarity: 'rare',
		magic_power: 25,
		jump_power: 5
	},
	{
		name: 'Superior',
		rarity: 'common',
		defense: 65,
		magic_power: 12,
	},
	{
		name: 'Transcendent',
		rarity: 'legendary',
		defense: 150,
		magic_power: 35,
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
	}
]

let final_pants = {}