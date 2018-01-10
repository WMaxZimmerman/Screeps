var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
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
	        var closestTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

	        if(closestTarget != null && creep.build(closestTarget) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
	        }
        } else {
	        var closestSource = creep.pos.findClosestByRange(FIND_SOURCES);
	        //console.log('Closest Source: ' + closestSource);
	        if (closestSource != null && creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
	        }
	    }
    }
};

module.exports = roleBuilder;
