export class Random
{
	static string()
	{
		return `${Math.random()}`.slice(2, 7);
	}

	static bool()
	{
		return Math.random() < 0.5;
	}

	static int(max: number): number;
	static int(min: number, max: number): number;
	static int(maxmin: number, max?: number)
	{
		if (max != undefined)
			return Math.floor(Math.random() * (maxmin - max)) + max;
		return Math.floor(Math.random() * maxmin);
	}

	static color()
	{
		return `hsl(${this.int(360)}, ${this.int(40, 60)}%, ${this.int(40, 60)}%)`;
	}
}