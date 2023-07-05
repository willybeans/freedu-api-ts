### API for language collaboration
This API application accomplishes the following: 
  - postgreSQL database connection
  - express.js
  - typescript
  - unit tests in jest
  - pre-commit lint/prettier hooks that also run tests
  - github actions that run precommit hooks prior to merge to `main`

#### For Local Development
  - clone project
  - `npm install`
  - make sure to have postgres set up 
  - run the bash script to create the database locally 
    - `chmod +x create_database.sh`
    - `bash create_database.sh`

