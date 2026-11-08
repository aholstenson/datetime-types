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
* `DateInterval` for representing an interval between two dates

