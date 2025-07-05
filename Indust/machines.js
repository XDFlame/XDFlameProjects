const machines = {
	electric_furnace: {
		tier: 1,
		cost: 190,
		recipes: [
			{
				inputs: [
					{
						name: "raw_copper",
						amount: 1,
					}
				],
				outputs: [
					{
						name: "liquid_copper",
						amount: 1,
					}
				],
				time: 3,
				power_s: "400 MF"
			},
			{
				inputs: [
					{
						name: "raw_iron",
						amount: 1,
					}
				],
				outputs: [
					{
						name: "liquid_iron",
						amount: 1,
					}
				],
				time: 5,
				power_s: "240 MF"
			},
			{
				inputs: [
					{
						name: "iron_ingot",
						amount: 1,
					}
				],
				outputs: [
					{
						name: "liquid_iron",
						amount: 1.8,
					}
				],
				time: 10,
				power_s: "120 MF"
			},
			{
				inputs: [
					{
						name: "copper_ingot",
						amount: 1,
					}
				],
				outputs: [
					{
						name: "liquid_copper",
						amount: 1.8,
					}
				],
				time: 6,
				power_s: "200 MF"
			},
			{
				inputs: [
					{
						name: "copper_mix",
						amount: 2.67,
					}
				],
				outputs: [
					{
						name: "liquid_copper",
						amount: 5.2,
					}
				],
				time: 3,
				power_s: "400 MF"
			},
			{
				inputs: [
					{
						name: "iron_mix",
						amount: 3.2,
					}
				],
				outputs: [
					{
						name: "liquid_iron",
						amount: 7,
					}
				],
				time: 5,
				power_s: "240 MF"
			},
			{
				inputs: [
					{
						name: "sulfur",
						amount: 5,
					}
				],
				outputs: [
					{
						name: "liquid_sulfur",
						amount: 10,
					}
				],
				time: 5,
				power_s: "240 MF"
			}
		]
	},
	ingot_molder: {
		tier: 1,
		cost: 150,
		recipes: [
			{
				inputs: [
					{
						name: "liquid_copper",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "copper_ingot",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "liquid_sulfur",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "sulfur",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "liquid_iron",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "iron_ingot",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "liquid_gold",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "gold_ingot",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "molten_ferroaluminium_alloy",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "ferroaluminium_alloy_ingot",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "molten_purple_gold",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "purple_gold_ingot",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "liquid_aluminium",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "aluminium_ingot",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "liquid_glass",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "glass",
						amount: 1,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "liquid_lead",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "lead_ingot",
						amount: 2,
					}
				],
				time: 2,
				power_s: "150 MF",
			},
			{
				inputs: [
					{
						name: "liquid_brass",
						amount: 2,
					}
				],
				outputs: [
					{
						name: "brass_ingot",
						amount: 2,
					}
				],
				time: 2,
				power_s: "150 MF",
			}
		]
	}
}