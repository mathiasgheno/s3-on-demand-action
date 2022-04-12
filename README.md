# s3-on-demand-action

This project should be an Github Action to create, delete and update S3 Buckets automatically.

This is still in development.

- [x] Pass region has Github Action Parameter or .env for development
- [x] Pass owner has Github Action Parameter or .env for development
- [x] Recursive files upload
- [x] Finish createStaticBucket
- [x] Pass token credentials to github action
- [x] Checkout project on action to download at content or reference it
- [x] Docs for actions
- [ ] Certification
- [ ] Improve static setting
- [ ] Delete function using cron

# How to Use

This action must be used in two ways: i) when push on `feature/**` branch and ii) when delete of `feature/**`.

For on push, do this github action configuration: 

```yaml

name: s3-on-demand-action-tests

on:
  push:
    branches:
      - 'feature/**'

jobs:
  log:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: mathiasgheno/s3-on-demand-action@main
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: 'www'

```

Here ara all the configuration you can pass:

| Key                   | Required | Default   |
|-----------------------|----------|-----------|
| LOG_LEVEL             | No       | info      |
| AWS_ACCESS_KEY_ID     | Yes      | N/A       |
| AWS_SECRET_ACCESS_KEY | Yes      | N/A       |
| SOURCE_DIR            | No       | www       |
| AWS_REGION            | No       | sa-east-1 |
| ENVIRONMENT           | No       | N/A       |

<!-- 
For on delete branch: 

PS: still WIP!

```yaml
name: Branch Deleted
on: delete
jobs:
  delete:
    if: github.event.ref_type == 'branch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: mathiasgheno/s3-on-demand-action@main
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: 'www'
          ACTION: 'delete'
``` -->

# References

1. Inspiration from [jakejarvis/s3-sync-action](https://github.com/jakejarvis/s3-sync-action)
2. Learned from [Create a New Github Action to Automate Code Tasks with Javascript](https://egghead.io/courses/create-a-new-github-action-to-automate-code-tasks-with-javascript-f1e9)
3. [Production Deploy SPA in S3](https://medium.com/@joecrobak/production-deploy-of-a-single-page-app-using-s3-and-cloudfront-d4aa2d170aa3)
