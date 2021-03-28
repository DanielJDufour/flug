# flug
> The Test Runner with the Shortest Time to Takeoff

# why flug?
**flug** is "flight" in German

# features
- Only One Assertion Function
- Easy Startup
- Light Weight (~4KB)
- Sane Defaults
- Zero Dependencies

# background
There's a lot of awesome assertions libraries out there with a lot of awesome assertion functions.  But the reality is that I have struggled to remember all the names of the assertion functions.  Is it `t.eq` or `t.is`?  Is it `deepStrictEqual` or `strictDeepEqual`?  I needed a simpler, more memorable testing inteface, so I built fast-test.

Flug exposes only one assertion function `eq`, which does deep equality checking.  This solves 99.9% of my use cases, so that's good enough.

# limitations
- not designed for large libraries with hundreds of tests
- only works on NodeJS

# install
```bash
npm install flug
```

# usage
```js
const test = require("flug");

test("addition", ({ eq }) => {
  eq(1 + 1, 2);
});
```

# And that's it!
