var Position = Backbone.Model.extend({
    defaults: {
        occupied: false
    },
    addMarker: function(marker) {
        if (typeof this.get('marker') !== "undefined") {
            throw "Position is already occupied";
        }
        this.set('marker', marker);
        this.set('occupied', true);
        return this;
    }
});

