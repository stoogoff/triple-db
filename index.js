
const data = require('./data.json')
const isSearch = term => typeof term === 'string' && term.startsWith('?')

const matchValue = (value, search) => {
	if(search === undefined) return true
	if(isSearch(search)) return true

	return value === search
}

const allByMatch = (id, key, value) => data.filter(i =>
	matchValue(i[0], id) &&
	matchValue(i[1], key) &&
	matchValue(i[2], value))

const query = ({ find, where }) => {
	const context = {}

	const output = where.map(pattern => {
		const keys = pattern.map(i => isSearch(i) && context[i] ? context[i] : i)
		const maxLength = Math.max(...keys.map(key => Array.isArray(key) ? key.length : 1))

		let result = []

		for(let i = 0; i < maxLength; ++i) {
			result = [...result, ...allByMatch(...keys.map(key => Array.isArray(key) ? key[i] : key))]
		}

		pattern.forEach((position, i) => {
			if(!isSearch(position)) return

			context[position] = result.map(r => r[i])
		})

		return result
	})

	if(!find || find.length === 0) {
		return output.flatMap(f => f)
	}

	const mappedFind = find.map(f => f in context ? context[f] : null)
	const realOutput = []

	mappedFind.forEach(sequence => {
		sequence.forEach((seq, idx) => {
			realOutput[idx] = realOutput[idx] || []
			realOutput[idx].push(seq)
		})
	})

	return realOutput
}

console.log('All movie titles from 1987', query({
	find: ['?movieTitle'],
	where: [
		['?movieId', 'movie/year', 1987],
		['?movieId', 'movie/title', '?movieTitle'],
	],
}))
console.log('All movie titles from 1987', query({
	where: [
		['?movieId', 'movie/year', 1987],
		['?movieId', 'movie/title', '?movieTitle'],
	],
}))

console.log('Find id 5000 and return movie/title', query({
	where: [
		[5000, 'movie/title', '?value'],
	]
}))
console.log('Find name of director of The Terminator', query({
	find: ['?directorName'],
	where: [
		['?movieId', 'movie/title', 'The Terminator'],
		['?movieId', 'movie/director', '?directorId'],
		['?directorId', 'person/name', '?directorName'],
	],
}))
console.log('Find all movie titles', query({
	find: ['?movieTitle'],
	where: [['?movieId', 'movie/title', '?movieTitle']]
}))
console.log('Find all triples with movie title', query({
	find: ['?movieId', '?movieTitle'],
	where: [['?movieId', 'movie/title', '?movieTitle']]
}))
console.log('Find year of Alien', query({
	find: ["?year"],
	where: [
		["?id", "movie/title", "Alien"],
		["?id", "movie/year", "?year"],
	],
}))
console.log('Find attr and value of movie 200', query({
	find: ["?attr", "?value"],
	where: [[200, "?attr", "?value"]],
}))
console.log('Find all directors and movies featuring Big Arnie', query({
	find: ["?directorName", "?movieTitle"],
	where: [
		["?arnoldId", "person/name", "Arnold Schwarzenegger"],
		["?movieId", "movie/cast", "?arnoldId"],
		["?movieId", "movie/title", "?movieTitle"],
		["?movieId", "movie/director", "?directorId"],
		["?directorId", "person/name", "?directorName"],
	],
}))

console.log(allByMatch('?', 'movie/title', '?'))

console.log(query({
	find: ['?movieTitle', '?movieYear', '?sequelTitle', '?sequelYear'],
	where: [
		['?movieId', 'movie/sequel', '?sequelId'],
		['?movieId', 'movie/title', '?movieTitle'],
		['?movieId', 'movie/year', '?movieYear'],
		['?sequelId', 'movie/title', '?sequelTitle'],
		['?sequelId', 'movie/year', '?sequelYear'],
	]
}))