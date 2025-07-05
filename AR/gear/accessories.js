const accessories = [
	{
		name: 'None',
		level: 0,
		rarity: 'none',
	},
	{
		name: 'Apex Predator Eyepatch',
		level: 150,
		rarity: 'legendary',
		defense: 20,
		magic_power: 60,
	},
	{
		name: 'Beta Bracelet',
		level: 1,
		rarity: 'legendary',
		defense: 0.25,
		magic_power: 0.25,
		scaling: {
			start: 1,
			end: 350,
			defense: 0.25,
			magic_power: 0.25,
		},
		enchantable: false,
	},
	{
		name: 'Blue Zircon Amulet',
		level: 280,
		rarity: 'exotic',
		defense: 325,
	},
	{
		name: 'Gauntlet of the Rising Phoenix',
		level: 220,
		rarity: 'legendary',
		defense: 200,
		magic_power: 100,
		enchantable: false,
	},
	{
		name: 'Morock\'s Blessing',
		level: 250,
		rarity: 'legendary',
		defense: 90,
		magic_power: 90,
		scaling: {
			start: 250,
			end: 350,
			defense: 0.1,
			magic_power: 0.1
		},
	},
	{
		name: 'Powered Magic Amulet',
		level: 280,
		rarity: 'uncommon',
		magic_power: 65,
	},
	{
		name: 'Ruined Justice Cloak',
		level: 200,
		rarity: 'exotic',
		defense: 20,
		magic_power: 70
	},
	{
		name: 'Rupin\'s Cursed Pauldrons',
		level: 285,
		rarity: 'exotic',
		defense: 150,
		magic_power: 75,
	},
	{
		name: 'Stone Mask',
		level: 300,
		rarity: 'rare',
		defense: 120,
		magic_power: 50,
	},
	{
		name: 'The Kraken\'s Band',
		level: 200,
		rarity: 'legendary',
		defense: 40,
		magic_power: 80,
	},
	{
		name: 'Topaz Amulet',
		level: 280,
		rarity: 'uncommon',
		defense: 285,
	},
	{
		name: 'Horns of Perpetuity',
		level: 1,
		rarity: 'seasonal',
		defense: 500,
		health_regen: 9,
		enchantable: false,
	},
	{
		name: 'Vermillion Acumen\'s Cloak',
		level: 1,
		rarity: 'seasonal',
		defense: 50,
		magic_power: 25,
		movement_speed: 10,
		jump_power: 10,
		health_regen: 4,
		damage_reduction: 6,
		enchantable: false,
	},
	{
		name: 'Mask of Cessation',
		level: 1,
		rarity: 'seasonal',
		magic_power: 90,
		movement_speed: 10,
		jump_power: 10,
		enchantable: false,
	}
]

const accessory_enchantments = [
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
		magic_power: 30,
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
		defense: 75,
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
		defense: 125,
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
		defense: 375,
		stamina_regen: -10,
		stun_resistance: 5
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
		damage_reduction: 5,
	},
	{
		name: 'Skyward',
		rarity: 'common',
		jump_power: 10
	},
	{
		name: 'Spiritual',
		rarity: 'rare',
		magic_power: 20,
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
		defense: 50,
		magic_power: 10,
	},
	{
		name: 'Transcendent',
		rarity: 'legendary',
		defense: 150,
		magic_power: 30,
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

let final_accessory_1 = {}
let final_accessory_2 = {}