# Firebase Test SDK for Cloud Functions

The `firebase-functions-test` is unit testing library for Cloud Functions for Firebase. It is a companion to [firebase-functions](https://github.com/Firebase/firebase-functions).

_NOTE: This library can only be used with `firebase-functions` v3.20.1 or above._

## Usage

1. Write some Firebase Functions
2. With your testing framework of choice, write a unit-test that imports your Firebase Functions.
3. `wrap` your Firebase Functions. You can invoke the Firebase Function's handler by invoking the `wrap` call.

Eg.

```typescript
import {myFirebaseFunction} from "../index"; // Your Firebase Functions
import firebaseFunctionsTest from "firebase-functions-test";

// Extracting `wrap` out of the lazy-loaded features
const {wrap} = firebaseFunctionsTest();

// `jest-ts` example
test('my unit test', () => {
  const wrappedFirebaseFunction = wrap(myFirebaseFunction);

  // Invoke the firebase function
  wrappedFirebaseFunction();

  // Invoke the firebase function with CloudEvent overrides
  wrappedFirebaseFunction({data: {arbitrary: 'values'}});
});
```

## Examples

* [Unit Testing Gen-1 Cloud Functions using Mocha](https://github.com/firebase/functions-samples/tree/main/Node-1st-gen/quickstarts/uppercase-rtdb/functions)
* [Unit Testing Gen-2 Cloud Functions using Mocha](https://github.com/firebase/functions-samples/tree/main/Node/test-functions-mocha/functions)
* [Unit Testing Gen-2 Cloud Functions using Jest](https://github.com/firebase/functions-samples/tree/main/Node/test-functions-jest/functions)
* [Unit Testing Gen-2 Cloud Functions using Jest-Ts](https://github.com/firebase/functions-samples/tree/main/Node/test-functions-jest-ts/functions)

## Learn more

Learn more about unit testing Cloud Functions [here](https://firebase.google.com/docs/functions/unit-testing).

## Contributing

To contribute a change, [check out the contributing guide](.github/CONTRIBUTING.md).

## License

© Google, 2018. Licensed under [The MIT License](LICENSE).
