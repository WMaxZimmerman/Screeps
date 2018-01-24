var constructionManager = require('construction.manager');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.class == undefined) creep.memory.class = 'worker';

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            var controller = creep.room.controller;
            constructionManager.moveTowardTarget(creep, controller, 'upgrade');
        }
        else {
            // if (creep.memory.role == 'upgrader' && creep.room.name == Game.spawns['Spawn1'].room.name) {
            //     var exitDir = Game.map.findExit('W27N38', 'W27N39');
            //     var exit = creep.pos.findClosestByPath(exitDir, { algorithm: 'astar', ignoreRoads: true, swampCost: 1, plainCost: 1, ignoreCreeps: true });
            //     creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffaa00'}});
            //} else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES, { algorithm: 'astar', ignoreRoads: true, swampCost: 1, plainCost: 1 });
                constructionManager.moveTowardTarget(creep, source, 'harvest');
            //}
        }

        constructionManager.checkRoadConstruction(creep);
    }
};

module.exports = roleUpgrader;
