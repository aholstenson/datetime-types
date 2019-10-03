export class LocalDate {
	public readonly year: number;
	public readonly month: number;
	public readonly dayOfMonth: number;

	private constructor(year: number, month: number, dayOfMonth: number) {
		this.year = year;
		this.month = month;
		this.dayOfMonth = dayOfMonth;
	}

	public static of(year: number, month: number, dayOfMonth: number): LocalDate {
		return new LocalDate(year, month, dayOfMonth);
	}

	public toDate() {
		return new Date(this.year, this.month - 1, this.dayOfMonth);
	}
}
