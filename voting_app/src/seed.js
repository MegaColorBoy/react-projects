function generateVoteCount() {
	return Math.floor((Math.random() * 50) + 15);
}

const products = [
	{
		id: 1,
		title: 'Yellow Pail',
		description: 'On-demand sand castle construction expertise',
		url: '#',
		votes: generateVoteCount(),
	},
	{
		id: 2,
		title: 'Supermajority: The Fantasy Congress League',
		description: 'Earn points when your favorite politicians pass legislation',
		url: '#',
		votes: generateVoteCount(),
	},
	{
		id: 3,
		title: 'Tinfolid: Tailored tinfoil hats',
		description: 'We already have your measurements and shipping address.',
		url: '#',
		votes: generateVoteCount(),
	},
	{
		id: 4,
		title: 'Haught or Naught',
		description: 'High-minded or absent-minded? You decide.',
		url: '#',
		votes: generateVoteCount(),
	}
];

export default products;