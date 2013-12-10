describe("Position", function() {
    describe("initially", function() {
        var position;
        beforeEach(function() {
            position = new Position();
        });
        it("begins unoccupied", function() {
            expect(position.get('occupied')).toBe(false);
        });
        it("can have a marker placed", function() {
            position.addMarker("X");
            expect(position.get('occupied')).toBe(true);
            expect(position.get('marker')).toBe("X");
        });
        it("returns itself when it places a marker", function() {
            expect(position.addMarker("O")).toBe(position);
        })
    });

    describe("with a marker already played", function() {
        it("throws an error when we try to add a new marker", function() {
            var position = new Position();
            position.addMarker("X");
            expect(function() {
                position.addMarker("X");
            }).toThrow();
        });
    });
});
