var constructionManager = require('construction.manager');

var roleRepairman = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.class == undefined) creep.memory.class = 'worker';
        //creep.moveTo(40, 24);
        //return;

        if(creep.memory.working && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.working && creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.working) {
            var closestStruct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
               filter: (cs) =>  {
                   return ((cs.structureType == STRUCTURE_WALL || cs.structureType == STRUCTURE_RAMPART) && cs.hits < 100000);
                }, algorithm: 'astar', ignoreRoads: true, swampCost: 1
            });

            if (closestStruct != undefined && closestStruct != null) {
                constructionManager.moveTowardTarget(creep, closestStruct, 'repair');
            }
        } else {
            var closestSource = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (s) => {
                return s.energy > 0;
            }, algorithm: 'astar', ignoreRoads: true, swampCost: 1, plainCost: 1});
            constructionManager.moveTowardTarget(creep, closestSource, 'harvest');
        }

        constructionManager.checkRoadConstruction(creep);
    }
};

module.exports = roleRepairman;
