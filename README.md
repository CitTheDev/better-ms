# Millisecond Conversion Utility

## Features
- Can fetch all timestamps from a string and convert it
- 100% Promise-based
- Type declarations included for TypeScript users

## Examples
```js
ms("1 day") // 86400000
ms("1 second") // 1000
ms("1 day 10 hours") // 122400000
ms("100 ms") // 100
```

### Format milliseconds to a string
```js
format(1000, "long") // "1 second"
format(1000, "short") // "1s"
format(31557601000, "long") // "1 year 1 second"
format(31557601000, "short") // "1y 1s"
```