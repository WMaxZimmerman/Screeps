var autoSpawner = {

    /** @param {Creep} creep **/
    run: function(spawn) {
        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
            return;
        }

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var fighters = _.filter(Game.creeps, (creep) => creep.memory.role == 'fighter');
        var totalCreepCount = harvesters.length + builders.length + upgraders.length + fighters.length;
        var roleCap = 6;
        var roleCount = 4

        if(harvesters.length < (totalCreepCount / roleCount + 3) && harvesters.length < roleCap + 3 && spawn.room.energyAvailable >= 400) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                {memory: {role: 'harvester'}});
        } else if(upgraders.length < (totalCreepCount / roleCount) && upgraders.length < roleCap && spawn.room.energyAvailable >= 400) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                {memory: {role: 'upgrader'}});
        } else if(builders.length < (totalCreepCount / roleCount) && builders.length < roleCap && spawn.room.energyAvailable >= 400) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder'}});
        } else if(fighters.length < (totalCreepCount / roleCount) && fighters.length < roleCap / 2 && spawn.room.energyAvailable >= 250 && harvesters.length > 5 && upgraders.length > 2 && builders.length > 2) {
            var newName = 'Fighter' + Game.time;
            console.log('Spawning new fighter: ' + newName);
            spawn.spawnCreep([MOVE,RANGED_ATTACK,MOVE], newName,
                {memory: {role: 'fighter'}});
        } else if (spawn.room.energyAvailable >= 400 && harvesters.length < roleCap + 3) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                {memory: {role: 'harvester'}});
        }
    }
};

module.exports = autoSpawner;
