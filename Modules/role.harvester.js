var constructionManager = require('construction.manager');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.class == undefined) creep.memory.class = 'worker'; //This line can be remove when new spawn logic is in place.
        if (creep.memory.isHarvesting == undefined) creep.memory.isHarvesting = creep.carry.energy < creep.carryCapacity;

        if(creep.carry.energy < creep.carryCapacity && creep.memory.isHarvesting == true) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES, { algorithm: 'astar', ignoreRoads: true,  swampCost: 1, plainCost: 1 });
            if (source == null) {
                creep.pos.findClosestByPath(FIND_SOURCES, { algorithm: 'astar', ignoreCreeps: true, ignoreRoads: true,  swampCost: 1, plainCost: 1 });
                console.log(JSON.stringify(source));
            }
            constructionManager.moveTowardTarget(creep, source, 'harvest');
        }
        else {
            if (creep.carry.energy == creep.carryCapacity) creep.memory.isHarvesting = false;

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER||
                        structure.structureType == STRUCTURE_CONTAINER) &&
                        (structure.energy < structure.energyCapacity);
                }, algorithm: 'astar', ignoreRoads: true, ignoreCreeps: true, swampCost: 1, plainCost: 1
            });

            if (target == null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                    }, algorithm: 'astar', ignoreRoads: true, ignoreCreeps: true, swampCost: 1, plainCost: 1
                });
            }

            constructionManager.moveTowardTarget(creep, target, 'transfer');

            if (creep.carry.energy == 0) creep.memory.isHarvesting = true;
        }

        constructionManager.checkRoadConstruction(creep);
    }
};

module.exports = roleHarvester;
