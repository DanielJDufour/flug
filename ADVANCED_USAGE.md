# Advanced Usage
You can limit which tests are run through the following environmental variables: `TEST_NAME`, `TEST_FILE` and `TEST_DIR`.

#### TEST_NAME
You can run only tests that match a given name (usually only one test) like:
```TEST_NAME="calculate sum" npm test```
You can also use a wildcard in the name like:
```TEST_NAME="calculate population of *" npm test```

#### TEST_FILE
You can run only run tests in files with a specific name like:
```TEST_FILE="test.max.js" npm test```

#### TEST_DIR
You can run only run tests in folders with a specific name like:
```TEST_DIR="v1" npm test```

#### TIMED
You can log the time it takes to run each test like  
```TIME=true npm test```  
Output will look like this:
<pre>
<span style="color: green">success (324ms): name of test</span>
<span style="color: green">success (461ms): name of another test</span>
</pre>

#### LOG_SKIP
You can suppress logging the information about which tests were skipped.
This can be helpful when you are skipping hundreds of tests.
```LOG_SKIP=false npm test```