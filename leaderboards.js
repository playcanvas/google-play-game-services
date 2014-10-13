pc.script.attribute('leaderboardId', 'string', '', {
    displayName: 'Leaderboard ID'
});

pc.script.create('leaderboards', function (context) {
    // Creates a new Leaderboards instance
    var Leaderboards = function (entity) {
        this.entity = entity;
    };

    Leaderboards.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // Let the game tell us when achievements have been unlocked
            context.root.findByName('Game').script.game.on('leaderboardpost', function (score) {
                this.post(score);
            }.bind(this), this);
        },

        post: function (score) {
            if (signedIn) {
                var that = this;
                gapi.client.request({
                    path: '/games/v1/leaderboards/' + this.leaderboardId + '/scores',
                    params: {
                        leaderboardId: this.leaderboardId, 
                        score: Math.floor(score)
                    },
                    method: 'post',
                    // You would add a body: {} argument if the method required a request body
                    callback: function (response) {
                        // A score has been submitted so update the UI
                        if (response !== undefined) {
                            that.populate();
                        }
                    }
                });
            }
        },

        populate: function () {
            if (signedIn) {
                gapi.client.request({
                    path: '/games/v1/leaderboards/' + this.leaderboardId + '/scores/PUBLIC',
                    params: {
                        collection: 'PUBLIC',
                        leaderboardId: this.leaderboardId, 
                        timeSpan: 'ALL_TIME',
                        maxResults: 10
                    },
                    method: 'get',
                    callback: function (response) {
                        // Do something interesting with the response
                        var items = response.items;
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            var text = 
                                item.formattedScoreRank + ' ' + 
                                item.player.displayName + ' ' + 
                                item.formattedScore + 'm';
                            var entry = context.root.findByName('Position ' + (i + 1));
                            entry.script.font_renderer.text = text;
                        }
                    }
                });
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Leaderboards;
});