function benchmark(fn, loops) {

	let time = []
	for (let i = 0; i < loops; i++) {
		let t0 = performance.now();
		fn();
		let t1 = performance.now();
		time[i] = t1 - t0
	}

	let sum = 0
	for (let i in time) {
		sum += time[i]
	}

	let sort = time.sort()
	let min = sort.at(0)
	let max = sort.at(-1)

	console.log(`Min: ${min}ms`)
	console.log(`Mean: ${sum/time.length}ms`)
	console.log(`Median: ${sort[time.length/2]}ms`)
	console.log(`Max: ${max}ms`)
}