# fast-test
Fast Test: Super Intuitive Test Runner. Fast to Pick Up, Run and Debug.

# features
- Zero Dependencies
- Light Weight (~4KB)
- Only One Assertion

# background
There's a lot of awesome assertions libraries out there with a lot of awesome assertion functions.  But the reality is that I have struggled to remember all the names of the assertion functions.  Is it `t.eq` or `t.is`?  Is it `deepStrictEqual` or `strictDeepEqual`?  I needed a simpler, more memorable testing inteface, so I built fast-test.

Fast Test exposes only one assertion function `eq`, which does deep equality checking.  This solves 99.9% of my use cases, so that's good enough.

# limitations
- not designed for large libraries with hundreds of tests
- only works on NodeJS

# install
```bash
npm install fast-test
```

# usage
```
const test = require("fast-test");

test("addition", ({ eq }) => {
  eq(1 + 1, 2);
});
```

# And that's it!
