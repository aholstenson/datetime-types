# Changelog

## [0.4.0](https://github.com/aholstenson/datetime-types/compare/v0.3.0...v0.4.0) (2026-11-08)


### Features

* Add day of week, day of year and other calendar fields ([e880ba9](https://github.com/aholstenson/datetime-types/commit/e880ba993c6dfad18d9ca4221a60007a5ebdfde5))
* Add Duration with ISO 8601 strings ([6d1d776](https://github.com/aholstenson/datetime-types/commit/6d1d77668784ee4f0ed3a4c00f21ed14fcd06d6c))
* Add intersection, span, abuts and more to intervals ([1a8f3bd](https://github.com/aholstenson/datetime-types/commit/1a8f3bd63853de4dc30bf4ee2e10aa304e63a147))
* Add now() to all types and LocalDateTime.toDate() ([033a24e](https://github.com/aholstenson/datetime-types/commit/033a24ea4c4923f5d6d25cedb76c171598d1d958))
* Add with, add, subtract, until and since to dates and times ([167fac3](https://github.com/aholstenson/datetime-types/commit/167fac307ac333c9312bdd8e6d6fd2e2dfabeea5))
* Add YearMonth for a month in a specific year ([339a6b6](https://github.com/aholstenson/datetime-types/commit/339a6b6ffeec582005d4627e4ac9793088ca825f))
* Convert values to Temporal with toTemporal() ([b11d956](https://github.com/aholstenson/datetime-types/commit/b11d9567f0ee19748310d5ba9aa830d5c2312cdf))
* Let compare and equals accept strings and Temporal values ([d027c43](https://github.com/aholstenson/datetime-types/commit/d027c43db16988372da802050e773edbdace75f8))
* Let date-times be compared and checked for equality ([9833090](https://github.com/aholstenson/datetime-types/commit/98330907812eddba4afe180ee53520f01ef6b9d4))
* Let DateInterval take dates as strings or objects ([d75cef7](https://github.com/aholstenson/datetime-types/commit/d75cef7b6f36f701f5b27b7dc4d6a14a12395154))
* Let intervals check values, overlaps and order ([80ce352](https://github.com/aholstenson/datetime-types/commit/80ce352dff059290d21fd1511dd217fa71a413df))
* Make DayOfWeek a constant object instead of an enum ([4854600](https://github.com/aholstenson/datetime-types/commit/4854600bce51f87996b829268f6e5218016bde2f))
* Read intervals with from and rename open-ended constructors ([976cea8](https://github.com/aholstenson/datetime-types/commit/976cea8f75f3d98bcfddea2e0d2135463b6c90fa))
* Read ISO strings and Temporal values, and sort with compare ([646c58d](https://github.com/aholstenson/datetime-types/commit/646c58d24c765d4ecb01c1d7f4535c7820f78742))
* Show LocalDateTime fields directly in the console ([ec4aa44](https://github.com/aholstenson/datetime-types/commit/ec4aa4485f05e36d1e48563c188a733b01c7728d))
* Throw RangeError and TypeError with the field name ([2079aee](https://github.com/aholstenson/datetime-types/commit/2079aeef7571d81552874d6d3c8fb2e0adc3e272))
* Use Temporal field names and ISO day-of-week numbers ([832ad04](https://github.com/aholstenson/datetime-types/commit/832ad0447390588d52f1215c1de301b09d173e27))
* Write ISO strings and JSON in the same form as Temporal ([53b5042](https://github.com/aholstenson/datetime-types/commit/53b504255028083552597071e61df21090aead10))
* Write months as ISO 8601 strings such as --03 ([8791319](https://github.com/aholstenson/datetime-types/commit/87913196f77b78efd463c30e8987573c65c50b2c))


### Bug Fixes

* Keep years 0 to 99 when converting a date to Date ([9467f67](https://github.com/aholstenson/datetime-types/commit/9467f675d5d3450710df1cc28577a7f31e536e0d))
* Let static methods work when passed as callbacks ([04b73fa](https://github.com/aholstenson/datetime-types/commit/04b73fac343f8c5eeb17172f0eb760f97c9ab51c))
* Read second 60 in time strings as second 59 ([6daf2bb](https://github.com/aholstenson/datetime-types/commit/6daf2bb313ce70fc969436f12b9a62c0583852be))
* Reject durations too large to calculate exactly ([0d27f87](https://github.com/aholstenson/datetime-types/commit/0d27f87c7f74b1d105b9279aac5bf26c2925c3de))
* Reject years outside -271821 to 275760 ([c38db9d](https://github.com/aholstenson/datetime-types/commit/c38db9dfb013ffbdf336503b57d3f8174388d607))
* Sort date intervals with an open start first ([e1da3bb](https://github.com/aholstenson/datetime-types/commit/e1da3bb9d4e9254e526a736c6c7e65765ba85ceb))
* Write years before year 0 with a minus sign ([11bb7a3](https://github.com/aholstenson/datetime-types/commit/11bb7a3575ba668092687316e20dde00aedf4965))
