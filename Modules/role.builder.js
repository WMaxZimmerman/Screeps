var constructionManager = require('construction.manager');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // var flag = Game.flags['Flag1'];
        // targetRoom = flag.pos.roomName;
        // console.log(JSON.stringify(targetRoom));
        // if (targetRoom != undefined && targetRoom != null) {
        //     if (creep.room.name != targetRoom) {
        //         console.log(creep.room.name);
        //         var flagPath = creep.pos.findPathTo(flag, {algorithm: 'astar'});
        //         creep.moveTo(flag);
        //         return;
        //     }
        // }

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
                filter: (structure) => {
                    return (structure.structureType != STRUCTURE_ROAD);
                }, algorithm: 'astar', ignoreCreeps: true, ignoreRoads: true, swampCost: 1, plainCost: 1
            });

            if (closestNonRoadConstructionSite != undefined && closestNonRoadConstructionSite != null) {
                //console.log('found not road');
                constructionManager.moveTowardTarget(creep, closestNonRoadConstructionSite, 'build');
            } else {
                //console.log(JSON.stringify(Memory.prioritySite));
                var prioritySite = constructionManager.getPrioritySite(creep.room.name);
                constructionManager.moveTowardTarget(creep, prioritySite, 'build');
            }
        } else {
            var closestSource = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (s) => {
                return s.energy > 0;
            }, algorithm: 'astar', ignoreCreeps: true, ignoreRoads: true, swampCost: 1, plainCost: 1});
            constructionManager.moveTowardTarget(creep, closestSource, 'harvest');
        }

        constructionManager.checkRoadConstruction(creep);
    }
};

module.exports = roleBuilder;
