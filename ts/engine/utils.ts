export class Utils
{
	public static degToRad(deg: number)
	{
		return deg / 180 * Math.PI;
	}

	public static pingPong(min: number, max: number, t: number)
	{
		const v = t - Math.floor(t);
		const range = max - min;

		if (v > 0.5)
			return min + range * (1 - v) * 2;
		return min + range * v * 2;
	}
}