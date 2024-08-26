This is a small Ionic-Angular project to reproduce this issue:
https://github.com/ionic-team/capacitor/issues/7631

It consists of a blank Ionic app (created with `ionic start`) with Firebase Auth added to it. When executed, the app displays a "Sign in anonymously" / "Sign out" button and displays the uid of the logged-in user.

**Setup:**

* Create a Firebase project (https://console.firebase.google.com/) and enable Authentication on it. Then, in the "Sign-in method" tab, add the "Anonymous" sign-in provider.
* Clone the project `git clone https://github.com/ddx001/ios-problem.git`
* Configure the project to use Firebase by updating the files in src/environments with your new project configuration.
* Run `npm install`
* Run `ionic serve`
* Open the app (http://localhost:8100) in a browser and click the "Sign in anonymously" button.

It should Sign in and display the uid of the logged-in user. That's the expected behavior.

**Reproduce the bug:**

* Build the app `ionic build --prod`
* Copy to iOS `npx cap sync ios`
* Open the project in Xcode `npx cap open ios`
* Run the project on a device.

Now it doesn't work. That's the bug!

**Error messages:**
```
nw_application_id_create_self NECP_CLIENT_ACTION_GET_SIGNED_CLIENT_ID [80: Authentication error]
Failed to resolve host network app id
Warning: -[BETextInput attributedMarkedText] is unimplemented
KeyboardPlugin: resize mode - native
⚡️  Loading app at capacitor://localhost...
⚡️  WebView loaded
⚡️  [log] - heartbeats undefined
⚡️  [log] - heartbeats undefined
⚡️  To Native ->  App addListener 103483311
⚡️  To Native ->  Keyboard getResizeMode 103483312
⚡️  TO JS {"mode":"native"}
Invalidating grant <invalid NS/CF object> failed
```
