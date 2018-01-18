var constructionManager = require('construction.manager');

var roleRepairman = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.class == undefined) creep.memory.class = 'worker';
        //creep.moveTo(40, 24);
        //return;

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.working) {
            var closestWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
               filter: (cs) =>  {
                    return ((cs.structureType == STRUCTURE_WALL && cs.hits < 100000) || (cs.structureType == 'rampart' && cs.hits < 100000)); //(cs.hitsMax / 600));
                }, algorithm: 'astar', ignoreRoads: true, swampCost: 1
            });

            if (closestWall != undefined && closestWall != null) {
                console.log('found not road');
                if(creep.repair(closestWall) == ERR_NOT_IN_RANGE) {
    	            creep.moveTo(closestWall, {visualizePathStyle: {stroke: '#ffffff'}});
    	        }
            }
        } else {
	        var closestSource = creep.pos.findClosestByPath(FIND_SOURCES, { algorithm: 'astar', ignoreRoads: true, swampCost: 1, plainCost: 1});
	        //console.log('Closest Source: ' + closestSource);
	        if (closestSource != null && creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
	        }
	    }

        constructionManager.checkRoadConstruction(creep);
    }
};

module.exports = roleRepairman;
