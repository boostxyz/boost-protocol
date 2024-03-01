# DateTimeLib
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/DateTimeLib.sol), Modified from BokkyPooBahsDateTimeLibrary (https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary)

Library for date time operations.

*
Conventions:
--------------------------------------------------------------------+
Unit      | Range                | Notes                            |
--------------------------------------------------------------------|
timestamp | 0..0x1e18549868c76ff | Unix timestamp.                  |
epochDay  | 0..0x16d3e098039     | Days since 1970-01-01.           |
year      | 1970..0xffffffff     | Gregorian calendar year.         |
month     | 1..12                | Gregorian calendar month.        |
day       | 1..31                | Gregorian calendar day of month. |
weekday   | 1..7                 | The day of the week (1-indexed). |
--------------------------------------------------------------------+
All timestamps of days are rounded down to 00:00:00 UTC.*


## State Variables
### MON

```solidity
uint256 internal constant MON = 1;
```


### TUE

```solidity
uint256 internal constant TUE = 2;
```


### WED

```solidity
uint256 internal constant WED = 3;
```


### THU

```solidity
uint256 internal constant THU = 4;
```


### FRI

```solidity
uint256 internal constant FRI = 5;
```


### SAT

```solidity
uint256 internal constant SAT = 6;
```


### SUN

```solidity
uint256 internal constant SUN = 7;
```


### JAN

```solidity
uint256 internal constant JAN = 1;
```


### FEB

```solidity
uint256 internal constant FEB = 2;
```


### MAR

```solidity
uint256 internal constant MAR = 3;
```


### APR

```solidity
uint256 internal constant APR = 4;
```


### MAY

```solidity
uint256 internal constant MAY = 5;
```


### JUN

```solidity
uint256 internal constant JUN = 6;
```


### JUL

```solidity
uint256 internal constant JUL = 7;
```


### AUG

```solidity
uint256 internal constant AUG = 8;
```


### SEP

```solidity
uint256 internal constant SEP = 9;
```


### OCT

```solidity
uint256 internal constant OCT = 10;
```


### NOV

```solidity
uint256 internal constant NOV = 11;
```


### DEC

```solidity
uint256 internal constant DEC = 12;
```


### MAX_SUPPORTED_YEAR

```solidity
uint256 internal constant MAX_SUPPORTED_YEAR = 0xffffffff;
```


### MAX_SUPPORTED_EPOCH_DAY

```solidity
uint256 internal constant MAX_SUPPORTED_EPOCH_DAY = 0x16d3e098039;
```


### MAX_SUPPORTED_TIMESTAMP

```solidity
uint256 internal constant MAX_SUPPORTED_TIMESTAMP = 0x1e18549868c76ff;
```


## Functions
### dateToEpochDay

*Returns the number of days since 1970-01-01 from (`year`,`month`,`day`).
See: https://howardhinnant.github.io/date_algorithms.html
Note: Inputs outside the supported ranges result in undefined behavior.
Use [isSupportedDate](/lib/solady/src/utils/DateTimeLib.sol/library.DateTimeLib.md#issupporteddate) to check if the inputs are supported.*


```solidity
function dateToEpochDay(uint256 year, uint256 month, uint256 day) internal pure returns (uint256 epochDay);
```

### epochDayToDate

*Returns (`year`,`month`,`day`) from the number of days since 1970-01-01.
Note: Inputs outside the supported ranges result in undefined behavior.
Use {isSupportedDays} to check if the inputs is supported.*


```solidity
function epochDayToDate(uint256 epochDay) internal pure returns (uint256 year, uint256 month, uint256 day);
```

### dateToTimestamp

*Returns the unix timestamp from (`year`,`month`,`day`).
Note: Inputs outside the supported ranges result in undefined behavior.
Use [isSupportedDate](/lib/solady/src/utils/DateTimeLib.sol/library.DateTimeLib.md#issupporteddate) to check if the inputs are supported.*


```solidity
function dateToTimestamp(uint256 year, uint256 month, uint256 day) internal pure returns (uint256 result);
```

### timestampToDate

*Returns (`year`,`month`,`day`) from the given unix timestamp.
Note: Inputs outside the supported ranges result in undefined behavior.
Use [isSupportedTimestamp](/lib/solady/src/utils/DateTimeLib.sol/library.DateTimeLib.md#issupportedtimestamp) to check if the inputs are supported.*


```solidity
function timestampToDate(uint256 timestamp) internal pure returns (uint256 year, uint256 month, uint256 day);
```

### dateTimeToTimestamp

*Returns the unix timestamp from
(`year`,`month`,`day`,`hour`,`minute`,`second`).
Note: Inputs outside the supported ranges result in undefined behavior.
Use [isSupportedDateTime](/lib/solady/src/utils/DateTimeLib.sol/library.DateTimeLib.md#issupporteddatetime) to check if the inputs are supported.*


```solidity
function dateTimeToTimestamp(uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second)
    internal
    pure
    returns (uint256 result);
```

### timestampToDateTime

*Returns (`year`,`month`,`day`,`hour`,`minute`,`second`)
from the given unix timestamp.
Note: Inputs outside the supported ranges result in undefined behavior.
Use [isSupportedTimestamp](/lib/solady/src/utils/DateTimeLib.sol/library.DateTimeLib.md#issupportedtimestamp) to check if the inputs are supported.*


```solidity
function timestampToDateTime(uint256 timestamp)
    internal
    pure
    returns (uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second);
```

### isLeapYear

*Returns if the `year` is leap.*


```solidity
function isLeapYear(uint256 year) internal pure returns (bool leap);
```

### daysInMonth

*Returns number of days in given `month` of `year`.*


```solidity
function daysInMonth(uint256 year, uint256 month) internal pure returns (uint256 result);
```

### weekday

*Returns the weekday from the unix timestamp.
Monday: 1, Tuesday: 2, ....., Sunday: 7.*


```solidity
function weekday(uint256 timestamp) internal pure returns (uint256 result);
```

### isSupportedDate

*Returns if (`year`,`month`,`day`) is a supported date.
- `1970 <= year <= MAX_SUPPORTED_YEAR`.
- `1 <= month <= 12`.
- `1 <= day <= daysInMonth(year, month)`.*


```solidity
function isSupportedDate(uint256 year, uint256 month, uint256 day) internal pure returns (bool result);
```

### isSupportedDateTime

*Returns if (`year`,`month`,`day`,`hour`,`minute`,`second`) is a supported date time.
- `1970 <= year <= MAX_SUPPORTED_YEAR`.
- `1 <= month <= 12`.
- `1 <= day <= daysInMonth(year, month)`.
- `hour < 24`.
- `minute < 60`.
- `second < 60`.*


```solidity
function isSupportedDateTime(uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second)
    internal
    pure
    returns (bool result);
```

### isSupportedEpochDay

*Returns if `epochDay` is a supported unix epoch day.*


```solidity
function isSupportedEpochDay(uint256 epochDay) internal pure returns (bool result);
```

### isSupportedTimestamp

*Returns if `timestamp` is a supported unix timestamp.*


```solidity
function isSupportedTimestamp(uint256 timestamp) internal pure returns (bool result);
```

### nthWeekdayInMonthOfYearTimestamp

*Returns the unix timestamp of the given `n`th weekday `wd`, in `month` of `year`.
Example: 3rd Friday of Feb 2022 is `nthWeekdayInMonthOfYearTimestamp(2022, 2, 3, 5)`
Note: `n` is 1-indexed for traditional consistency.
Invalid weekdays (i.e. `wd == 0 || wd > 7`) result in undefined behavior.*


```solidity
function nthWeekdayInMonthOfYearTimestamp(uint256 year, uint256 month, uint256 n, uint256 wd)
    internal
    pure
    returns (uint256 result);
```

### mondayTimestamp

*Returns the unix timestamp of the most recent Monday.*


```solidity
function mondayTimestamp(uint256 timestamp) internal pure returns (uint256 result);
```

### isWeekEnd

*Returns whether the unix timestamp falls on a Saturday or Sunday.
To check whether it is a week day, just take the negation of the result.*


```solidity
function isWeekEnd(uint256 timestamp) internal pure returns (bool result);
```

### addYears

*Adds `numYears` to the unix timestamp, and returns the result.
Note: The result will share the same Gregorian calendar month,
but different Gregorian calendar years for non-zero `numYears`.
If the Gregorian calendar month of the result has less days
than the Gregorian calendar month day of the `timestamp`,
the result's month day will be the maximum possible value for the month.
(e.g. from 29th Feb to 28th Feb)*


```solidity
function addYears(uint256 timestamp, uint256 numYears) internal pure returns (uint256 result);
```

### addMonths

*Adds `numMonths` to the unix timestamp, and returns the result.
Note: If the Gregorian calendar month of the result has less days
than the Gregorian calendar month day of the `timestamp`,
the result's month day will be the maximum possible value for the month.
(e.g. from 29th Feb to 28th Feb)*


```solidity
function addMonths(uint256 timestamp, uint256 numMonths) internal pure returns (uint256 result);
```

### addDays

*Adds `numDays` to the unix timestamp, and returns the result.*


```solidity
function addDays(uint256 timestamp, uint256 numDays) internal pure returns (uint256 result);
```

### addHours

*Adds `numHours` to the unix timestamp, and returns the result.*


```solidity
function addHours(uint256 timestamp, uint256 numHours) internal pure returns (uint256 result);
```

### addMinutes

*Adds `numMinutes` to the unix timestamp, and returns the result.*


```solidity
function addMinutes(uint256 timestamp, uint256 numMinutes) internal pure returns (uint256 result);
```

### addSeconds

*Adds `numSeconds` to the unix timestamp, and returns the result.*


```solidity
function addSeconds(uint256 timestamp, uint256 numSeconds) internal pure returns (uint256 result);
```

### subYears

*Subtracts `numYears` from the unix timestamp, and returns the result.
Note: The result will share the same Gregorian calendar month,
but different Gregorian calendar years for non-zero `numYears`.
If the Gregorian calendar month of the result has less days
than the Gregorian calendar month day of the `timestamp`,
the result's month day will be the maximum possible value for the month.
(e.g. from 29th Feb to 28th Feb)*


```solidity
function subYears(uint256 timestamp, uint256 numYears) internal pure returns (uint256 result);
```

### subMonths

*Subtracts `numYears` from the unix timestamp, and returns the result.
Note: If the Gregorian calendar month of the result has less days
than the Gregorian calendar month day of the `timestamp`,
the result's month day will be the maximum possible value for the month.
(e.g. from 29th Feb to 28th Feb)*


```solidity
function subMonths(uint256 timestamp, uint256 numMonths) internal pure returns (uint256 result);
```

### subDays

*Subtracts `numDays` from the unix timestamp, and returns the result.*


```solidity
function subDays(uint256 timestamp, uint256 numDays) internal pure returns (uint256 result);
```

### subHours

*Subtracts `numHours` from the unix timestamp, and returns the result.*


```solidity
function subHours(uint256 timestamp, uint256 numHours) internal pure returns (uint256 result);
```

### subMinutes

*Subtracts `numMinutes` from the unix timestamp, and returns the result.*


```solidity
function subMinutes(uint256 timestamp, uint256 numMinutes) internal pure returns (uint256 result);
```

### subSeconds

*Subtracts `numSeconds` from the unix timestamp, and returns the result.*


```solidity
function subSeconds(uint256 timestamp, uint256 numSeconds) internal pure returns (uint256 result);
```

### diffYears

*Returns the difference in Gregorian calendar years
between `fromTimestamp` and `toTimestamp`.
Note: Even if the true time difference is less than a year,
the difference can be non-zero is the timestamps are
from different Gregorian calendar years*


```solidity
function diffYears(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 result);
```

### diffMonths

*Returns the difference in Gregorian calendar months
between `fromTimestamp` and `toTimestamp`.
Note: Even if the true time difference is less than a month,
the difference can be non-zero is the timestamps are
from different Gregorian calendar months.*


```solidity
function diffMonths(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 result);
```

### diffDays

*Returns the difference in days between `fromTimestamp` and `toTimestamp`.*


```solidity
function diffDays(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 result);
```

### diffHours

*Returns the difference in hours between `fromTimestamp` and `toTimestamp`.*


```solidity
function diffHours(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 result);
```

### diffMinutes

*Returns the difference in minutes between `fromTimestamp` and `toTimestamp`.*


```solidity
function diffMinutes(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 result);
```

### diffSeconds

*Returns the difference in seconds between `fromTimestamp` and `toTimestamp`.*


```solidity
function diffSeconds(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256 result);
```

### _totalMonths

*Unchecked arithmetic for computing the total number of months.*


```solidity
function _totalMonths(uint256 numYears, uint256 numMonths) private pure returns (uint256 total);
```

### _add

*Unchecked arithmetic for adding two numbers.*


```solidity
function _add(uint256 a, uint256 b) private pure returns (uint256 c);
```

### _sub

*Unchecked arithmetic for subtracting two numbers.*


```solidity
function _sub(uint256 a, uint256 b) private pure returns (uint256 c);
```

### _offsetted

*Returns the offsetted timestamp.*


```solidity
function _offsetted(uint256 year, uint256 month, uint256 day, uint256 timestamp)
    private
    pure
    returns (uint256 result);
```

