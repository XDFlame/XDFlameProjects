const hats = [
	{
		name: 'None',
		level: 0,
		rarity: 'none',
	},
	{
		name: 'Ancient Legionnaire\'s Helmet',
		level: 350,
		rarity: 'exotic',
		defense: 250,
		damage_reduction: 3,
	},
	{
		name: 'Arsen\'s Hat',
		level: 350,
		rarity: 'exotic',
		defense: 200,
		magic_power: 35,
	},
	{
		name: 'Evil Wizard Hood',
		level: 320,
		rarity: 'rare',
		magic_power: 25,
		magic_energy: 15,
	},
	{
		name: 'Midnight Mage Hood',
		level: 300,
		rarity: 'uncommon',
		magic_power: 25,
	},
	{
		name: 'Prometheus\' Crown',
		level: 320,
		rarity: 'legendary',
		defense: 100,
		magic_power: 50,
	},
	{
		name: 'Quartermaster\'s Hat',
		level: 320,
		rarity: 'rare',
		defense: 200,
	},
	{
		name: 'Rupin\'s Hat',
		level: 285,
		rarity: 'exotic',
		defense: 215,
		magic_power: 20,
	},
	{
		name: 'Sunken Champion Helm',
		level: 250,
		rarity: 'legendary',
		defense: 250,
		magic_power: 20,
		/*scaling: {
			start: 250,
			end: 350,
			defense: 1,
			magic_power: 0.1,
		},*/
	},
	{
		name: 'Sunken Warrior Helm',
		level: 100,
		rarity: 'legendary',
		defense: 75,
		magic_power: 5,
		scaling: {
			start: 100,
			end: 200,
			defense: 0.75,
			magic_power: 0.05,
		},
	}
]

const hat_enchantments = [
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
		defense: 100,
	},
	{
		name: 'Berserk',
		rarity: 'rare',
		magic_power: 15,
	},
	{
		name: 'Blessed',
		rarity: 'rare',
		magic_power: 20,
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
		magic_power: 10,
	},
	{
		name: 'Hardened',
		rarity: 'common',
		defense: 50,
	},
	{
		name: 'Hasty',
		rarity: 'rare',
		magic_power: 12,
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
		defense: 100,
		magic_power: 5,
	},
	{
		name: 'Holy',
		rarity: 'common',
		health_regen: 3,
	},
	{
		name: 'Indestructible',
		rarity: 'legendary',
		defense: 400,
		stamina_regen: -10,
		stun_resistance: 4
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
		damage_reduction: 4,
	},
	{
		name: 'Skyward',
		rarity: 'common',
		jump_power: 10
	},
	{
		name: 'Spiritual',
		rarity: 'rare',
		magic_power: 10,
		magic_energy: 15,
	},
	{
		name: 'Striking',
		rarity: 'rare',
		magic_power: 12,
		jump_power: 5
	},
	{
		name: 'Superior',
		rarity: 'common',
		defense: 35,
		magic_power: 5,
	},
	{
		name: 'Transcendent',
		rarity: 'legendary',
		defense: 100,
		magic_power: 20,
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

let final_hat = {}