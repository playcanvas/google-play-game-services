var signedIn = false;

function signinCallback(auth) {
    if (auth && auth.error) {
        console.log('Sign in failed because: ', auth.error);
        signedIn = false;
    } else {
        // Hooray! The user is logged int!
        // If we got here from a sign-in button, we should probably hide it
        console.log("Hooray! We're signed in!");
        signedIn = true;
    }
}

function createMetaTag(name, content) {
    var meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.getElementsByTagName('head')[0].appendChild(meta);
}

createMetaTag("google-signin-clientid", "298923451907-q3rs47f9o98e52m8bmq4j2em54lo3oda.apps.googleusercontent.com");
createMetaTag("google-signin-cookiepolicy", "single_host_origin");
createMetaTag("google-signin-callback", "signinCallback");
createMetaTag("google-signin-scope", "https://www.googleapis.com/auth/games");
