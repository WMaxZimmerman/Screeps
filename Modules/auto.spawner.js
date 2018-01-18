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
        var repairmen = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairman');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var fighters = _.filter(Game.creeps, (creep) => creep.memory.class == 'fighter');
        var totalCreepCount = harvesters.length + builders.length + upgraders.length + fighters.length;
        var roleCap = 2;
        var roleCount = 4;
        var workerLvl = 4;
        var workerCost = (200 * workerLvl) + 50;
        var workerBody = [WORK,CARRY,MOVE];
        if (workerLvl == 2) workerBody = [WORK,CARRY,CARRY,WORK,CARRY,MOVE];
        if (workerLvl == 3) workerBody = [WORK,CARRY,CARRY,WORK,CARRY,WORK,WORK,CARRY,MOVE];
        if (workerLvl == 4) workerBody = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];

        if(harvesters.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep(workerBody, newName,
                {memory: {role: 'harvester'}});
        } else if(upgraders.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep(workerBody, newName,
                {memory: {role: 'upgrader'}});
        } else if(builders.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder'}});
        }
        else if(repairmen.length < roleCap && spawn.room.energyAvailable >= workerCost) {
            var newName = 'Repairman' + Game.time;
            console.log('Spawning new repairman: ' + newName);
            //spawn.spawnCreep([WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName, {memory: {role: 'repairman'}});
        }
        else if(fighters.length < roleCap / 2 && spawn.room.energyAvailable >= 250) { //&& harvesters.length > 3 && upgraders.length > 2 && builders.length > 2 && Game.gcl >= 3) {
            var newName = 'Fighter' + Game.time;
            console.log('Spawning new fighter: ' + newName);
            //spawn.spawnCreep([MOVE,MOVE,RANGED_ATTACK], newName,{memory: {class: 'fighter', role: 'invader'}});
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
