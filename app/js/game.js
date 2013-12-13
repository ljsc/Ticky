(function (Ticky) {

"use strict";

Ticky.Position = Backbone.Model.extend({
    defaults: {
		marker: " "
	},

    initialize: function() {
        this.occupied = false;
    },

    addMarker: function(marker) {
        if (!_.isUndefined(this.get('marker'))) {
            throw "Position is already occupied";
        }
        this.set('marker', marker);
        this.occupied = true;
        return this;
    }
});

Ticky.Board = Backbone.Collection.extend({
    model: Ticky.Position,

    initialize: function() {
        this.newGame();
    },

    newGame: function() {
        var positions = [];
        for(var i = 1; i <= 9; i+=1) {
            positions.push( {} );
        };
        this.reset(positions);
    },

    addMarker: function(i, marker) {
        this.models[i-1].set("marker", marker)
        this.checkForWin()
        return this;
    },

    checkForWin: function() {
        try {
            _.each(Ticky.Board.WINNING_COMBOS, function(tripple) {
                var winner = this.extractWinner(this.markersOnTripple(tripple));
                if (winner) {
                    this.trigger("gameover", winner);
                    throw "won";
                }
            }, this);
        } catch (e) { }
    },

    markersOnTripple: function(tripple) {
        return _.map(tripple, function(i) {
            return this.models[i-1].get('marker');
        }, this);
    },

    extractWinner: function(play) {
        var checkWin = function(lookfor) {
            return _.every(play, function(marker) {
                return marker == lookfor;
            });
        };

        if (checkWin("X")) { return "X" }
        if (checkWin("O")) { return "O" }

        return false;
    }
}, {
    WINNING_COMBOS: [
        [1,2,3], [4,5,6], [7,8,9], // rows
        [1,4,7], [2,5,8], [3,6,9], // columns
        [1,5,9], [3,5,7]           // diagonals
    ]
});

Ticky.GameView = Backbone.Marionette.Layout.extend({
    template: "#game-template",
	regions: {
		positions: "#board"
	},
	onRender: function() {
        this.positions.show(
			new Ticky.BoardView({ collection:  new Ticky.Board() })
		);
	}
});

Ticky.PositionView = Backbone.Marionette.ItemView.extend({
	template: "#position-template",
	tagName: "li",
	initialize: function() {
		this.listenTo(this.model, "change:marker", this.render);
	},
	events: {
		"click .position": "onClickPosition"
	},
	onRender: function() {
		var marker = this.model.get("marker");
		if (marker !== " ") {
			this.$el.addClass("marker-" + marker);
		}
	},
	onClickPosition: function() {
		console.log(this.model);
		this.model.set("marker", "X");
	}
});

Ticky.BoardView = Backbone.Marionette.CollectionView.extend({
	itemView: Ticky.PositionView,
	tagName: "ol"
});

Ticky.App = new Backbone.Marionette.Application();

Ticky.App.addRegions({
    main: "#main-content"
});

Ticky.App.main.show(new Ticky.GameView);

})(this.Ticky = this.Ticky || {});
