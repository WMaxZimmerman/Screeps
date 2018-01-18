var constructionManager = require('construction.manager');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.class == undefined) creep.memory.class = 'worker';
        //creep.moveTo(40, 24);
        //return;

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var closestNonRoadConstructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
               filter: (cs) =>  {
                    return (cs.structureType != STRUCTURE_ROAD);
                }, algorithm: 'astar', ignoreRoads: true, swampCost: 1
            });

            if (closestNonRoadConstructionSite != undefined && closestNonRoadConstructionSite != null) {
                console.log('found not road');
                if(creep.build(closestNonRoadConstructionSite) == ERR_NOT_IN_RANGE) {
    	            creep.moveTo(closestNonRoadConstructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
    	        }
            } else {
                //console.log(JSON.stringify(Memory.prioritySite));
                if(Memory.prioritySite != null && creep.build(Memory.prioritySite) == ERR_NOT_IN_RANGE) {
    	            creep.moveTo(Memory.prioritySite, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleBuilder;
