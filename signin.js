pc.script.create('signin', function (context) {
    // Creates a new SignIn instance
    var SignIn = function (entity) {
        this.entity = entity;
        this.signedIn = false;
    };

    SignIn.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (signedIn !== this.signedIn) {
                this.fire(signedIn ? 'signin' : 'signout');
            }
            this.signedIn = signedIn;
        }
    };

    return SignIn;
});