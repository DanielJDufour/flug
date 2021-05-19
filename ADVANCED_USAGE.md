# Advanced Usage
You can limit which tests are run through the following environmental variables: `TEST_NAME`, `TEST_FILE` and `TEST_DIR`.

#### TEST_NAME
You can run only tests that match a given name (usually only one test) like:
```TEST_NAME="calculate sum" npm test```

#### TEST_FILE
You can run only run tests in files with a specific name like:
```TEST_FILE="test.max.js" npm test```

#### TEST_DIR
You can run only run tests in folders with a specific name like:
```TEST_DIR="v1" npm test```
