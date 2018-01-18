var objectLocator = {

    findClosestPath: function(creep, possibleTargets) {
        var paths = possibleTargets.map( (pt) => {
            return creep.room.findPath(creep.pos, pt.pos, {ignoreCreeps: true, ignoreRoads: true, swampCost: 1})
        });
    }
};

module.exports = objectLocator;
