# datetime-types

[![npm version](https://badge.fury.io/js/datetime-types.svg)](https://badge.fury.io/js/datetime-types)
[![Build Status](https://github.com/aholstenson/datetime-types/actions/workflows/ci.yml/badge.svg)](https://github.com/aholstenson/datetime-types/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/aholstenson/datetime-types/badge.svg)](https://coveralls.io/github/aholstenson/datetime-types)

This library provides immutable dates, times, intervals, periods and durations
for JavaScript and TypeScript. These types help carry the intent of a value,
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

This is currently an early release with only a few types without much ability
to manipulate values.

Types implemented:

* `LocalDate` for representing a date without a time
* `LocalTime` for representing a time without a date or timezone
* `LocalDateTime` for representing a date and time without a timezone
* `DayOfWeek` enumeration, with ISO 8601 numbers from `MONDAY` (1) to `SUNDAY` (7)
* `Month` for representing a month, with constants from `Month.JANUARY` to `Month.DECEMBER`
* `Year` for representing a single year
* `Interval` for representing an interval between two values, where the end
  is not part of the interval
* `DateInterval` for representing an interval between two dates, where both
  dates are part of the interval

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

## Strings, JSON and comparison

`toString()` gives the ISO 8601 string, which is the same string that
`Temporal` gives for the same value. A year outside 0 to 9999 has six digits
and a sign, such as `+020240-01-02`. A time always has the seconds, such as
`08:30:00`, and the fraction of a second has no trailing zeros.

`JSON.stringify` writes the same string, because every type has `toJSON()`.

The types do not convert to numbers or strings with operators. `a < b` and
`a + b` throw a `TypeError`, as they do for `Temporal`. Use `compare()` or
`equals()` to compare values:

```javascript
const a = LocalDate.of(2024, 3, 1);
const b = LocalDate.of(2024, 3, 2);

a.compare(b); // -1
a.equals(b); // false
JSON.stringify({ a }); // '{"a":"2024-03-01"}'
```

## Intervals

`Interval` and `DateInterval` both have a start and an end. A `null` start or
end makes that side open, so the interval has no limit on that side. The start
must not be after the end.

`DateInterval` includes both dates. Use it for date ranges as people write
them, such as 1 March to 31 March:

```javascript
import { DateInterval, LocalDate } from 'datetime-types';

const march = DateInterval.between(LocalDate.of(2024, 3, 1), LocalDate.of(2024, 3, 31));

march.contains(LocalDate.of(2024, 3, 31)); // true
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
Interval.from(LocalTime.of(8)).toString(); // '08:00:00/..'
```

An interval of times can not go across midnight. Use `LocalDateTime` values
for an interval such as 22:00 to 02:00.

Both types have `contains`, `overlaps`, `equals`, `compare` and `toString`.
`DateInterval.parse('2024-03-01/..')` reads a string. `Interval.parse` needs a
function that reads each side, such as
`Interval.parse('08:00/17:00', LocalTime.from)`.
`Interval` also has `isEmpty`, which is true when the start equals the end.

