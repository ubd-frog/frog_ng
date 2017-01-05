import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bytes'
})

export class BytesPipe implements PipeTransform {
    transform(arg: number, args: any[]): any {
        let result = [],
		val = 0,
		e, base, bits, ceil, neg, num, output, round, unix, spacer, standard, symbols;

	if (isNaN(arg)) {
		throw new Error("Invalid arguments");
	}

	bits = false;
	unix = true;
	base = 2;
	round = 1;
	spacer = "";
	symbols = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	standard = "jedec";
	output = "string";
	e = -1;
	num = Number(arg);
	neg = num < 0;
	ceil = base > 2 ? 1000 : 1024;

	// Flipping a negative number to determine the size
	if (neg) {
		num = -num;
	}

	// Zero is now a special case because bytes divide by 1
	if (num === 0) {
		result[0] = 0;
		result[1] = unix ? "" : !bits ? "B" : "b";
	} else {
		// Determining the exponent
		if (e === -1 || isNaN(e)) {
			e = Math.floor(Math.log(num) / Math.log(ceil));

			if (e < 0) {
				e = 0;
			}
		}

		// Exceeding supported length, time to reduce & multiply
		if (e > 8) {
			e = 8;
		}

		val = base === 2 ? num / Math.pow(2, e * 10) : num / Math.pow(1000, e);

		if (bits) {
			val = val * 8;

			if (val > ceil && e < 8) {
				val = val / ceil;
				e++;
			}
		}

		result[0] = Number(val.toFixed(e > 0 ? round : 0));
		result[1] = symbols[e];

		if (unix) {
			result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];
		}
	}

	// Decorating a 'diff'
	if (neg) {
		result[0] = -result[0];
	}

	// Applying custom symbol
	result[1] = symbols[result[1]] || result[1];

	return result.join(spacer);
    }
}