![image](https://github.com/FanSpaceHQ/.github/assets/8313325/53e8afa1-d4f7-49a1-8dcb-5208896fed00)

# FanSpace 👽
Expand your orbit!

# Our Mission
Have you ever missed out on a concert/music festival just because you had nobody to go with you?

Have you ever spent more money on Uber fees than the cost of the concert ticket itself?

Have you ever wondered what other students like the same artists as you? 

Our mobile application aims to help students connect with other students with similar interests and music taste and allows them to coordinate their concert experiences with others.

# Our Technology
We use ground-breaking novel technologies to develop, run, and deploy this app. 
- Firebase
  - Realtime Database
  - Cloud Functions (powered by Google Cloud Run)
  - Storage Buckets
- React Native
- Expo

# Run/Deploy
Requirements:
- Node.js v20^
- Node Package Manager (npm) v9^
- Xcode v14^ (to test on iOS, or use the Expo Go app on a physical iOS device)

Other requirements are in the `package.json` file in both the `functions` and
`frontend` directories.

## Deploying Cloud Functions
In order to deploy Cloud Functions to Firebase, you must have the
`firebase-tools` npm package installed globally:
```shell
$ npm install -g firebase-tools
```
Use the Firebase CLI to sign into your Google Account:
```shell
$ firebase login
```
Then deploy with:
```shell
$ firebase deploy
```
You may also deploy locally with:
```shell
$ cd functions
$ npm install
$ npm run serve
```
Note that this should be used for debugging purposes only—the frontend
application is set to the production Firebase server.
## Running the Expo Application
Use Yarn to install all dependencies and run the Expo server:
```shell
$ cd frontend
$ yarn
$ yarn start
```
## Deploying to the App Store
Make sure you have a valid Apple Developer account (paid) before continuing.
```shell
$ eas build -p ios
$ eas submit -p ios
```

# Notes
- 8/13/23: The `frontend/backend` folder is now just for reference. It contains
  no currently usable code.

## To Do
- [ ] Update Realtime Database rules for validation
- [ ] Create Firebase abstraction for CRUD operations
- [ ] Cloud Functions:
  - [ ] Friend request lifecycle
  - [ ] Ticketmaster Sync
- [ ] UI overhaul:
  - [ ] Update profile page
  - [ ] Connect logic for inbox + UI tweaks
