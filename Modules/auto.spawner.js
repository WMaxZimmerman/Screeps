var roomManager = require('room.manager');

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

        let roomCreeps = spawn.room.find(FIND_MY_CREEPS);
        let harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');
        let builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
        let repairmen = _.filter(roomCreeps, (creep) => creep.memory.role == 'repairman');
        let upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
        let fighters = _.filter(roomCreeps, (creep) => creep.memory.class == 'fighter');
        let totalCreepCount = harvesters.length + builders.length + upgraders.length + fighters.length;
        let roleCap = 2;
        let roleCount = 4;
        let workerLvl = spawn.room.memory.properties.workerLvl;
        let workerCost = (200 * workerLvl);
        var workerBody = [WORK,CARRY,MOVE];
        if (workerLvl >= 2) workerBody = [WORK,CARRY,MOVE,WORK,CARRY,MOVE];
        if (workerLvl >= 3) workerBody = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
        if (workerLvl >= 4) workerBody = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
        if (workerLvl >= 5) workerBody = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];

        if(harvesters.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            roomManager.spawnWorker(spawn, "harvester", workerLvl);
        } else if(upgraders.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            roomManager.spawnWorker(spawn, "upgrader", workerLvl);
        } else if(builders.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            roomManager.spawnWorker(spawn, "builder", workerLvl);
        }
        else if(repairmen.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            //var newName = 'Repairman' + Game.time;
            //console.log('Spawning new repairman: ' + newName);
            //spawn.spawnCreep([WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName, {memory: {role: 'repairman'}});
        }
        else if(fighters.length < roleCap / 2 && spawn.room.energyAvailable >= 250) { //&& harvesters.length > 3 && upgraders.length > 2 && builders.length > 2 && Game.gcl >= 3) {
            var newName = 'Fighter' + Game.time;
            console.log('Spawning new fighter: ' + newName);
            spawn.spawnCreep([MOVE,MOVE,RANGED_ATTACK], newName,{memory: {class: 'fighter', role: 'invader'}});
        }
        // else if (spawn.room.energyAvailable >= workerCost && harvesters.length < roleCap) {
        //     var newName = 'Harvester' + Game.time;
        //     console.log('Spawning new harvester: ' + newName);
        //     spawn.spawnCreep(workerBody, newName,
        //         {memory: {role: 'harvester'}});
        // }
    }
};

module.exports = autoSpawner;
