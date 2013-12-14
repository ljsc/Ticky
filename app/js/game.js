(function (Ticky) {

"use strict";

Ticky.Game = Backbone.Model.extend({
	defaults: {
		'currentMarker': "X"
	},
	setNextPlayer: function() {
		if (this.get('currentMarker') === "X") {
			this.set('currentMarker', 'O');
		} else {
			this.set('currentMarker', 'X');
		}
		return this;
	}
});

var BLANK = " ";

Ticky.Position = Backbone.Model.extend({
    defaults: { marker: BLANK },

    initialize: function() {
        this.occupied = false;
    },

    placeMark: function() {
		var marker, game = this.get('game');

        if (this.isOccupied()) {
            throw "Position is already occupied";
        }

		marker = game.get('currentMarker');
		game.setNextPlayer();

        this.set('marker', marker);
        this.occupied = true;

        return this;
    },

	isOccupied: function() {
		return this.get('marker') !== Ticky.Position.BLANK;
	}
}, {
	BLANK: BLANK
});

Ticky.Board = Backbone.Collection.extend({
    model: Ticky.Position,

    initialize: function() {
        this.newGame();
    },

    newGame: function() {
		this.game = new Ticky.Game();
        var positions = [];
        _.times(9, function(){
            positions.push( { game: this.game } );
        }, this);
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
	events: {
		"click #new-game": "newGame"
	},
	ui: {
		player: ".currentPlayer"
	},
	initialize: function () {
		this.newGame();
	},
	newGame: function () {
		this.board = new Ticky.Board();
		this.model = this.board.game;
		this.boardView =
			new Ticky.BoardView({ collection: this.board});

		this.listenTo(this.model, "change:currentMarker", this.updatePlayer);
		this.render();
	},
	onRender: function() {
        this.positions.show(this.boardView);
	},
	updatePlayer: function(game, marker) {
		this.ui.player.html(marker)
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
		this.model.placeMark();
	}
});

Ticky.BoardView = Backbone.Marionette.CollectionView.extend({
	itemView: Ticky.PositionView,
	tagName: "ol"
});

Ticky.App = new Backbone.Marionette.Application();

Ticky.App.addRegions({
    main: "#main-content",
	header: "#header-content"
});

Ticky.App.main.show(new Ticky.GameView);

})(this.Ticky = this.Ticky || {});
