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

**Debugging / Fixing:**

* Start the app in Xcode.
* Open Safari, click on the "Develop" menu and select device.
* Click on the reload icon in the Safari Web Inspector.

Errors:
```
[Error] TypeError: undefined is not an object (evaluating 'gapi.iframes.getContext')
[Error] Error: w`capacitor
[Error] Cross-origin redirection to http://developers.google.com/ denied by Cross-Origin Resource Sharing policy: Origin capacitor://localhost is not allowed by Access-Control-Allow-Origin. Status code: 301
[Error] XMLHttpRequest cannot load https://apis.google.com/_/jserror?script=https%3A%2F%2Fapis.google.com%2F_%2Fscs%2Fabc-static%2F_%2Fjs%2Fk%3Dgapi.lb.fr.r1jvixKj4ng.O%2Fm%3Dgapi_iframes%2Frt%3Dj%2Fsv%3D1%2Fd%3D1%2Fed%3D1%2Frs%3DAHpOoo9o9T65AZaaIjldT_tEb7nM0LGeIQ%2Fcb%3Dgapi.loaded_0&error=w%60capacitor&line=147 due to access control checks.
[Error] Failed to load resource: Cross-origin redirection to http://developers.google.com/ denied by Cross-Origin Resource Sharing policy: Origin capacitor://localhost is not allowed by Access-Control-Allow-Origin. Status code: 301 (jserror, line 0)
```

Cross-origin error:

* https://ionicframework.com/docs/troubleshooting/cors#b-working-around-cors-in-a-server-you-cant-control
* https://capacitorjs.com/docs/apis/http?_gl=1*196x8pm*_gcl_au*MzQ0Njg3MDcyLjE3MzY1MjEzNjU.*_ga*MzMzMDA0NTExLjE3MzY1MjEzNjU.*_ga_REH9TJF6KF*MTczNjU5MjMwOS4zLjEuMTczNjU5MzMzMy4wLjAuMA..
* Add this to capacitor.config.ts:
```
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
```
* Result: the Cross-origin error is gone, we now have:
```
[Error] TypeError: undefined is not an object (evaluating 'gapi.iframes.getContext')
[Log] native CapacitorHttp.request (#123355916) (user-script:2, line 364)
  [Log] Object (user-script:2, line 371)
    callbackId: "123355916"
    methodName: "request"
    options: {url: "https://apis.google.com/_/jserror?script=https%3A%…2Fcb%3Dgapi.loaded_0&error=w%60capacitor&line=147", method: "POST", data: "trace=%40https%3A%2F%2Fapis.google.com%2F_%2Fscs%2…3Dgapi.loaded_1%3A1%3A14&context.severity=unknown", headers: {Content-Type: "application/x-www-form-urlencoded;charset=utf-8"}, dataType: "json"}
    pluginId: "CapacitorHttp"
    type: "message"
    Prototype Object
[Error] Error: w`capacitor
[Log] result CapacitorHttp.request (#123355916) (user-script:2, line 338)
  [Error] Object
    code: "NSURLErrorDomain"
    errorMessage: "The resource could not be loaded because the App Transport Security policy requires the use of a secure connection."
    message: "The resource could not be loaded because the App Transport Security policy requires the use of a secure connection."
```
* https://stackoverflow.com/questions/32631184/the-resource-could-not-be-loaded-because-the-app-transport-security-policy-requi
* Based on the above and suggestions from GitHub Copilot, I ended up adding this to ios/App/App/Info.plist:
```
	<key>NSAppTransportSecurity</key>
  <dict>
    <key>NSExceptionDomains</key>
    <dict>
      <key>apis.google.com</key>
      <dict>
        <key>NSIncludesSubdomains</key>
        <true/>
        <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
        <true/>
        <key>NSTemporaryExceptionMinimumTLSVersion</key>
        <string>TLSv1.0</string>
      </dict>
      <key>developers.google.com</key>
      <dict>
        <key>NSIncludesSubdomains</key>
        <true/>
        <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
        <true/>
        <key>NSTemporaryExceptionMinimumTLSVersion</key>
        <string>TLSv1.0</string>
      </dict>
    </dict>
  </dict>
```
* The error is gone, but the app still doesn't work.
* Logs:
```
[Error] TypeError: undefined is not an object (evaluating 'gapi.iframes.getContext')
[Log] native CapacitorHttp.request (#105958631) (user-script:2, line 364)
  [Log] Object (user-script:2, line 371)
    callbackId: "105958631"
    methodName: "request"
    options: {url: "https://apis.google.com/_/jserror?script=https%3A%…2Fcb%3Dgapi.loaded_0&error=w%60capacitor&line=147", method: "POST", data: "trace=%40https%3A%2F%2Fapis.google.com%2F_%2Fscs%2…3Dgapi.loaded_1%3A1%3A14&context.severity=unknown", headers: {Content-Type: "application/x-www-form-urlencoded;charset=utf-8"}, dataType: "json"}
    pluginId: "CapacitorHttp"
    type: "message"
    Prototype Object
[Error] Error: w`capacitor
[Log] result CapacitorHttp.request (#105958631) (user-script:2, line 338)
  [Log] Object (user-script:2, line 349)
    data: "<!doctype html>↵<html ↵      lang=\"en\"↵      dir=\"ltr\">↵  <head>↵    <meta name=\"google-signin-client-id…"
    headers: {cache-control: "no-cache, must-revalidate", expires: "0", content-security-policy: "base-uri 'self'; object-src 'none'; script-src 'st…ort-uri https://csp.withgoogle.com/csp/devsite/v2", x-cloud-trace-context: "95297de33fb653b36c481ac2fcd4b4b3", alt-svc: "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000", …}
    status: 200
    url: "https://developers.google.com/"
    Prototype Object
```
