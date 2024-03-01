# DateTimeLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testDateTimeMaxSupported


```solidity
function testDateTimeMaxSupported() public;
```

### testDateToEpochDay


```solidity
function testDateToEpochDay() public;
```

### testDateToEpochDayGas


```solidity
function testDateToEpochDayGas() public;
```

### testDateToEpochDayGas2


```solidity
function testDateToEpochDayGas2() public;
```

### testEpochDayToDateGas


```solidity
function testEpochDayToDateGas() public;
```

### testEpochDayToDateGas2


```solidity
function testEpochDayToDateGas2() public;
```

### testDateToEpochDayDifferential


```solidity
function testDateToEpochDayDifferential(DateTime memory d) public;
```

### testDateToEpochDayDifferential2


```solidity
function testDateToEpochDayDifferential2(DateTime memory d) public;
```

### testEpochDayToDateDifferential


```solidity
function testEpochDayToDateDifferential(uint256 timestamp) public;
```

### testEpochDayToDateDifferential2


```solidity
function testEpochDayToDateDifferential2(uint256 timestamp) public;
```

### testDaysToDate


```solidity
function testDaysToDate() public;
```

### testEpochDayToDate


```solidity
function testEpochDayToDate(uint256 epochDay) public;
```

### testDateToAndFroEpochDay


```solidity
function testDateToAndFroEpochDay(DateTime memory a) public;
```

### testDateTimeToAndFroTimestamp


```solidity
function testDateTimeToAndFroTimestamp(DateTime memory a) public;
```

### testDateToAndFroEpochDay


```solidity
function testDateToAndFroEpochDay() public;
```

### testDateToAndFroTimestamp


```solidity
function testDateToAndFroTimestamp() public;
```

### testIsLeapYear


```solidity
function testIsLeapYear() public;
```

### testIsLeapYear


```solidity
function testIsLeapYear(uint256 year) public;
```

### testDaysInMonth


```solidity
function testDaysInMonth() public;
```

### testDaysInMonth


```solidity
function testDaysInMonth(uint256 year, uint256 month) public;
```

### testWeekday


```solidity
function testWeekday() public;
```

### testDayOfWeek


```solidity
function testDayOfWeek() public;
```

### testIsSupportedDateTrue


```solidity
function testIsSupportedDateTrue() public;
```

### testIsSupportedDateFalse


```solidity
function testIsSupportedDateFalse() public;
```

### testIsSupportedDateTime


```solidity
function testIsSupportedDateTime(DateTime memory a) public;
```

### testIsSupportedEpochDayTrue


```solidity
function testIsSupportedEpochDayTrue() public;
```

### testIsSupportedEpochDayFalse


```solidity
function testIsSupportedEpochDayFalse() public;
```

### testIsSupportedTimestampTrue


```solidity
function testIsSupportedTimestampTrue() public;
```

### testIsSupportedTimestampFalse


```solidity
function testIsSupportedTimestampFalse() public;
```

### testNthWeekdayInMonthOfYearTimestamp


```solidity
function testNthWeekdayInMonthOfYearTimestamp() public;
```

### testNthWeekdayInMonthOfYearTimestamp


```solidity
function testNthWeekdayInMonthOfYearTimestamp(uint256 year, uint256 month, uint256 n, uint256 weekday) public;
```

### testMondayTimestamp


```solidity
function testMondayTimestamp() public;
```

### testMondayTimestamp


```solidity
function testMondayTimestamp(uint256 timestamp) public;
```

### testIsWeekEnd


```solidity
function testIsWeekEnd(uint256 timestamp) public;
```

### testAddSubDiffYears


```solidity
function testAddSubDiffYears(uint256 timestamp, uint256 numYears) public;
```

### testDateTimeArithmeticReverts


```solidity
function testDateTimeArithmeticReverts() public;
```

### testAddSubDiffMonths


```solidity
function testAddSubDiffMonths(uint256 timestamp, uint256 numMonths) public;
```

### testAddSubDiffDays


```solidity
function testAddSubDiffDays(uint256 timestamp, uint256 numDays) public;
```

### testAddSubDiffHours


```solidity
function testAddSubDiffHours(uint256 timestamp, uint256 numHours) public;
```

### testAddSubDiffMinutes


```solidity
function testAddSubDiffMinutes(uint256 timestamp, uint256 numMinutes) public;
```

### testAddSubDiffSeconds


```solidity
function testAddSubDiffSeconds(uint256 timestamp, uint256 numSeconds) public;
```

### _dateToEpochDayOriginal


```solidity
function _dateToEpochDayOriginal(uint256 year, uint256 month, uint256 day) internal pure returns (uint256);
```

### _dateToEpochDayOriginal2


```solidity
function _dateToEpochDayOriginal2(uint256 year, uint256 month, uint256 day) internal pure returns (uint256 _days);
```

### _epochDayToDateOriginal


```solidity
function _epochDayToDateOriginal(uint256 timestamp) internal pure returns (uint256 year, uint256 month, uint256 day);
```

### _epochDayToDateOriginal2


```solidity
function _epochDayToDateOriginal2(uint256 _days) internal pure returns (uint256 year, uint256 month, uint256 day);
```

## Structs
### DateTime

```solidity
struct DateTime {
    uint256 year;
    uint256 month;
    uint256 day;
    uint256 hour;
    uint256 minute;
    uint256 second;
}
```

