pc.script.create('achievements', function (context) {
    // Creates a new Achievements instance
    var Achievements = function (entity) {
        this.entity = entity;
        this.achievementIds = {};
    };

    Achievements.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // Let the game tell us when achievements have been unlocked
            context.root.findByName('Game').script.game.on('achievementunlock', function (a) {
                this.unlock(a);
            }.bind(this), this);

            // Once we're signed in, generate a map of achievements names to IDs
            // and update the achievements screen UI
            var root = context.root.findByName('Accelerally');
            root.script.signin.on('signin', function () {
                this.populate();
            }.bind(this), this);
        },

        populate: function () {
            if (signedIn) {
                var i, j;
                var that = this;

                gapi.client.request({
                    path: '/games/v1/achievements',
                    params: {
                        language: 'en-US',
                        maxResults: 5
                    },
                    method: 'get',
                    callback: function (achievementsResponse) {
                        // We've got the full list of achievements so now
                        // query the current players progress
                        var achievementDfns = achievementsResponse.items;
                        that.achievementIds = {};
                        for (i = 0; i < achievementDfns.length; i++) {
                            var dfn = achievementDfns[i];
                            that.achievementIds[dfn.name] = dfn.id;
                        }
                        
                        gapi.client.request({
                            path: '/games/v1/players/me/achievements',
                            params: {
                                playerId: 'me',
                                language: 'en-US',
                                maxResults: 5,
                                state: 'ALL'
                            },
                            method: 'get',
                            callback: function (progressResponse) {
                                // Cycle through all the progress and display ??? for locked
                                // achievement, otherwise look up and display the name
                                var items = progressResponse.items;
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    var text = '';
                                    var achievementDfns = achievementsResponse.items;
                                    for (var j = 0; j < achievementDfns.length; j++) {
                                        var dfn = achievementDfns[j];
                                        if (dfn.id === item.id) {
                                            text = dfn.name + ' - ' + dfn.description;
                                        }
                                    }
                                    var entry = context.root.findByName('Achievement ' + (i + 1));
                                    entry.script.font_renderer.text = text;
                                    if (item.achievementState === 'UNLOCKED') {
                                        entry.script.font_renderer.tint = new pc.Color(1, 1, 1);
                                    } else {
                                        entry.script.font_renderer.tint = new pc.Color(0.5, 0.5, 0.5);
                                    }
                                }
                            }
                        });
                    }
                });
            }
        },

        onEnable: function () {
            this.populate();
        },

        resetAll: function () {
            if (signedIn) {
                gapi.client.request({
                    path: '/games/v1management/achievements/reset',
                    method: 'post',
                    callback: function (response) {
                        // Do something interesting with the response
                        if (response !== undefined) {
                            console.log('All achievements successfully reset for current user.');
                            console.log(response);
                        } else {
                            console.log('Unable to reset achievements for current user.');
                        }
                    }
                });
            }
        },

        unlock: function (achievement) {
            if (signedIn) {
                var that = this;
                var id = this.achievementIds[achievement];
                gapi.client.request({
                    path: '/games/v1/achievements/' + id + '/unlock',
                    params: {
                        achievementId: id
                    },
                    method: 'post',
                    callback: function (response) {
                        // Do something interesting with the response
                        console.log(response);
                        that.populate();
                    }
                });
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Achievements;
});