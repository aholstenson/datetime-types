# datetime-types

This library provides immutable dates, times, intervals, periods and durations
for JavaScript and TypeScript. These types help carry the intent of a value,
instead of representing everything as a `Date`.

```javascript
import { LocalDate } from 'datetime-types';

const date = LocalDate.of(2042, 10, 2);
```

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
* `Interval<Type>` for representing an interval between two time values
