## Breaking Improvements

- Generated CloudEvents will use the user-provided Partial<CloudEvent> to infer other fields. #146
  - For storage events, updating the Partial's `bucket` will update:
    - `data.bucket`
    - Parts of `source`, `data.selfLink`, `data.id`
  - For PubSub events, updating the Partial's `data.message.json` will:
    - generate a new base64 string for `data.message.data`
      - (But a user-provided `data.message.data` still takes priority)

## Full list of Changes
- Update to README.md to include more samples #143
- Add top-level bucket field to Mock Storage CloudEvents #145
- Delete .travis.yml #120
- Add CI for firebase-functions-test #147
- Refactor MockCloudEvent generation to include user partial #146
- Unit tests for MockCloudEvent generation refactor #150
- Updated Dependencies
  - Bump plist from 3.0.1 to 3.0.5 #132
  - Bump minimist from 1.2.5 to 1.2.6 #129
  - Bump path-parse from 1.0.6 to 1.0.7 #115
  - Bump pathval from 1.1.0 to 1.1.1 #127
  - Bump glob-parent from 5.1.1 to 5.1.2 #103
  - Bump ws from 7.3.1 to 7.5.7 #133
