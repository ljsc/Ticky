describe("Position", function() {
    describe("initially", function() {
        var position;

        beforeEach(function() {
            position = new Ticky.Position();
        });

        it("begins unoccupied", function() {
            expect(position.occupied).toBe(false);
        });

        describe("placing a marker", function() {
            it("updates the marker attribute", function() {
                position.addMarker("X");
                expect(position.occupied).toBe(true);
                expect(position.get('marker')).toBe("X");
            });

            it("returns itself", function() {
                expect(position.addMarker("O")).toBe(position);
            });

            it("fires a change event", function(){
                var spy = jasmine.createSpy("change callback")
                    anything = jasmine.any(Object);
                position.on("change:marker", spy);
                position.addMarker('O');
                expect(spy).toHaveBeenCalledWith(anything, "O", anything);
            });
        });
    });

    describe("with a marker already played", function() {
        it("throws an error when we try to add a new marker", function() {
            var position = new Ticky.Position();
            position.addMarker("X");
            expect(function() {
                position.addMarker("X");
            }).toThrow();
        });
    });
});

describe("Board", function() {
    it("has 9 empty positions", function() {
        var board = new Ticky.Board;
        expect(board.length).toBe(9);
        expect(
            _.all(
                board.positions,
                function(p) { return !p.occupied }
            )
        ).toBeTruthy();
    });
});

describe("Playing a game", function() {
    it("quick win", function() {
        var board = new Ticky.Board(),
            overListener = jasmine.createSpy("gameover");

        board.on("gameover", overListener);

        board.addMarker(1, "X").addMarker(4, "O")
             .addMarker(2, "X").addMarker(5, "O")
             .addMarker(3, "X");

        expect(overListener).toHaveBeenCalledWith("X");
    });

    it("O can win too", function() {
        var board = new Ticky.Board(),
            overListener = jasmine.createSpy("gameover");

        board.on("gameover", overListener);

        board.addMarker(1, "O").addMarker(4, "X")
             .addMarker(2, "O").addMarker(5, "X")
             .addMarker(3, "O");

        expect(overListener).toHaveBeenCalledWith("O");
    });
});
