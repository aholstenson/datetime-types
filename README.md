# datetime-types

[![npm version](https://badge.fury.io/js/datetime-types.svg)](https://badge.fury.io/js/datetime-types)
[![Build Status](https://github.com/aholstenson/datetime-types/actions/workflows/ci.yml/badge.svg)](https://github.com/aholstenson/datetime-types/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/aholstenson/datetime-types/badge.svg)](https://coveralls.io/github/aholstenson/datetime-types)

This library provides immutable dates, times, intervals and durations for
JavaScript and TypeScript. These types help carry the intent of a value,
instead of representing everything as a `Date`.

```javascript
import { LocalDate, LocalTime } from 'datetime-types';

const date = LocalDate.of(2042, 10, 2);
const time = LocalTime.from({
  hour: 12,
  minute: 45
});
```

```
npm install datetime-types
```

This is an ES module package and it needs Node 22 or later. Use `import` to
load it. Node 22.12 and later can also load it with `require`.

## Status and features

This is an early release. The API follows `Temporal` where it can, so that
code can move to `Temporal` later.

Types implemented:

* `LocalDate` for representing a date without a time
* `LocalTime` for representing a time without a date or timezone
* `LocalDateTime` for representing a date and time without a timezone
* `DayOfWeek` constants, with ISO 8601 numbers from `DayOfWeek.MONDAY` (1) to
  `DayOfWeek.SUNDAY` (7). `DayOfWeek` is also the type of these numbers
* `Month` for representing a month, with constants from `Month.JANUARY` to `Month.DECEMBER`
* `Year` for representing a single year
* `YearMonth` for representing a month in a specific year, such as March 2024
* `Interval` for representing an interval between two values, where the end
  is not part of the interval
* `DateInterval` for representing an interval between two dates, where both
  dates are part of the interval
* `Duration` for representing an amount of time, such as 3 days or 1 year and
  2 months

## Creating values

Use `of()` with numbers, or `from()` with an ISO 8601 string or an object:

```javascript
import { LocalDate, LocalDateTime, LocalTime } from 'datetime-types';

LocalDate.of(2024, 3, 1);
LocalDate.from('2024-03-01');
LocalDate.from({ year: 2024, month: 3, day: 1 });

LocalTime.of(8, 30);
LocalTime.from('08:30');
LocalTime.from({ hour: 8, minute: 30 });

LocalDateTime.of(2024, 3, 1, 8, 30);
LocalDateTime.from('2024-03-01T08:30:00');
```

`now()` gives the current value, and `fromDate()` converts a `Date`. Both
use the local timezone of the system. `LocalDate.toDateAtMidnight()` and
`LocalDateTime.toDate()` convert back to a `Date`.

The errors are the same kind that `Temporal` throws. A value out of range,
such as month 13, and a string that can not be read throw a `RangeError`. A
value that is not a number throws a `TypeError`.

`from()` uses the same field names as `Temporal`, so it also accepts
`Temporal` values. It throws an error for a calendar other than `iso8601`,
and for a time that is more precise than a millisecond:

```javascript
LocalDate.from(Temporal.PlainDate.from('2024-03-01'));
LocalTime.from(Temporal.PlainTime.from('08:30:00.000001')); // throws
```

Each type has a static `compare(a, b)` to sort values:

```javascript
dates.sort(LocalDate.compare);
```

## Calendar fields and conversions

`LocalDate` and `LocalDateTime` have the same calendar fields as
`Temporal.PlainDate`: `dayOfWeek`, `dayOfYear`, `daysInMonth`, `daysInYear`
and `inLeapYear`. `dayOfWeek` uses ISO 8601 numbers, from `DayOfWeek.MONDAY`
(1) to `DayOfWeek.SUNDAY` (7). `YearMonth` has `daysInMonth`, `daysInYear`
and `inLeapYear`. `Year` has `daysInYear` and `inLeapYear`.

```javascript
import { DayOfWeek, LocalDate, YearMonth } from 'datetime-types';

const date = LocalDate.of(2024, 3, 3);

date.dayOfWeek === DayOfWeek.SUNDAY; // true
date.toLocalDateTime('08:30').toString(); // '2024-03-03T08:30:00'
date.toLocalDateTime().toLocalTime().toString(); // '00:00:00'
date.toYearMonth().toString(); // '2024-03'
YearMonth.of(2024, 2).toLocalDate(31).toString(); // '2024-02-29'
```

## Changing values

The values do not change. `with()`, `add()` and `subtract()` give a new
value. They use the same rules as `Temporal`:

```javascript
import { LocalDate, LocalDateTime, LocalTime, YearMonth } from 'datetime-types';

const date = LocalDate.of(2024, 1, 31);

date.with({ day: 1 }).toString(); // '2024-01-01'
date.add({ months: 1 }).toString(); // '2024-02-29'
date.subtract('P1W').toString(); // '2024-01-24'
LocalTime.of(23).add({ hours: 2 }).toString(); // '01:00:00'
YearMonth.of(2024, 11).add({ months: 3 }).toString(); // '2025-02'
LocalDateTime.of(2024, 1, 31, 23).add({ hours: 2 }).toString(); // '2024-02-01T01:00:00'
```

A day that is not in the month, such as 31 February, becomes the last day of
the month. Use `{ overflow: 'reject' }` to get a `RangeError` instead.
`of()` and `from()` always throw for such a day.

`until()` and `since()` give the `Duration` between two values. A date gives
days and a time gives hours, unless `largestUnit` is set:

```javascript
date.until('2024-03-01').toString(); // 'P30D'
date.until('2024-03-01', { largestUnit: 'months' }).toString(); // 'P1M1D'
LocalTime.of(8).until('09:30', { largestUnit: 'minutes' }).toString(); // 'PT90M'
```

## Strings, JSON and comparison

`toString()` gives the ISO 8601 string, which is the same string that
`Temporal` gives for the same value. A year outside 0 to 9999 has six digits
and a sign, such as `+020240-01-02`. A time always has the seconds, such as
`08:30:00`, and the fraction of a second has no trailing zeros.

`JSON.stringify` writes the same string, because every type has `toJSON()`.

The test suite checks the strings, the calendar fields and the order of
values against the built-in `Temporal` in Node 26 and later.

The types do not convert to numbers or strings with operators. `a < b` and
`a + b` throw a `TypeError`, as they do for `Temporal`. Use `compare()` or
`equals()` to compare values:

```javascript
const a = LocalDate.of(2024, 3, 1);
const b = LocalDate.of(2024, 3, 2);

a.compare(b); // -1
a.equals(b); // false
a.equals('2024-03-01'); // true
JSON.stringify({ a }); // '{"a":"2024-03-01"}'
```

`compare()` and `equals()` accept all values that `from()` accepts, such as
strings and `Temporal` values. A `LocalDate` compares only the date, so it
equals a `LocalDateTime` on the same date, as in `Temporal`:

```javascript
LocalDate.of(2024, 3, 1).equals(LocalDateTime.of(2024, 3, 1, 8)); // true
```

## Intervals

`Interval` and `DateInterval` both have a start and an end. A `null` start or
end makes that side open, so the interval has no limit on that side. The start
must not be after the end.

`DateInterval` includes both dates. Use it for date ranges as people write
them, such as 1 March to 31 March. Each date can be a `LocalDate` or a value
that `LocalDate.from()` accepts:

```javascript
import { DateInterval } from 'datetime-types';

const march = DateInterval.between('2024-03-01', '2024-03-31');

march.contains('2024-03-31'); // true
march.toString(); // '2024-03-01/2024-03-31'
```

`Interval` includes the start but not the end. It works with all values that
have a `compare` method, such as `LocalTime`, `LocalDate`, `LocalDateTime`,
`Year` and `Month`. Two intervals where one ends at the start of the other do
not overlap:

```javascript
import { Interval, LocalTime } from 'datetime-types';

const morning = Interval.between(LocalTime.of(8), LocalTime.of(12));
const afternoon = Interval.between(LocalTime.of(12), LocalTime.of(17));

morning.contains(LocalTime.of(12)); // false
morning.overlaps(afternoon); // false
Interval.startingAt(LocalTime.of(8)).toString(); // '08:00:00/..'
```

An interval of times can not go across midnight. Use `LocalDateTime` values
for an interval such as 22:00 to 02:00.

Both types have `contains`, `overlaps`, `equals`, `compare` and `toString`.
`DateInterval.from('2024-03-01/..')` reads a string. `Interval.from` needs a
function that reads each side, such as
`Interval.from('08:00/17:00', LocalTime.from)`.
`Interval` also has `isEmpty`, which is true when the start equals the end.

## Durations

`Duration` has the same fields as `Temporal.Duration`, from `years` to
`milliseconds`. `toString()` gives an ISO 8601 duration, such as `P1Y2M` or
`PT1.5S`:

```javascript
import { Duration } from 'datetime-types';

const duration = Duration.from({ hours: 1, minutes: 30 });

duration.toString(); // 'PT1H30M'
Duration.from('PT1.5H').minutes; // 30
duration.negated().toString(); // '-PT1H30M'
```

A duration keeps each field as it is given, so 90 minutes stays 90 minutes.
All fields must have the same sign.
