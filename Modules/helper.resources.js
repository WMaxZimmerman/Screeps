var helperResources = {

    /** @param {Creep} creep **/
    findClosestEnergy: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var totalDelta = -1;
        var currentSource;

        for(var source in sources) {
            var xDelta = source.getPositionAt().

            if (totalDelta < 0) currentSource = source;


            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }

        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
        }

        return currentSource;
	},

	spawn: function(spawn, name, big) {
	    if (big){
	        Game.spawns[spawn].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], name, { memory: { role: 'harvester' } } );
	    } else {
	        Game.spawns[spawn].spawnCreep( [WORK, CARRY, MOVE], name, { memory: { role: 'harvester' } } );
	    }
	}
};

module.exports = helperResources;
