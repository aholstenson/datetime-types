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
* `DayOfWeek` enumeration
* `Month` enumeration
* `Year` for representing a single year
* `Interval` for representing an interval between two values, where the end
  is not part of the interval
* `DateInterval` for representing an interval between two dates, where both
  dates are part of the interval

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
Interval.from(LocalTime.of(8)).toString(); // '08:00/..'
```

An interval of times can not go across midnight. Use `LocalDateTime` values
for an interval such as 22:00 to 02:00.

Both types have `contains`, `overlaps`, `equals`, `compare` and `toString`.
`Interval` also has `isEmpty`, which is true when the start equals the end.

