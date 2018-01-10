var eventHandler = {

    /** @param {Creep} creep **/
    creepCountChanged: function() {
        //console.log(Memory.currentCreepCount);
        var currentCreepCount = _.filter(Game.creeps, (creep) => creep.memory.role != '').length;
        if (Memory.currentCreepCount == undefined) Memory.currentCreepCount = currentCreepCount;

        if (currentCreepCount != Memory.currentCreepCount) {
            Memory.currentCreepCount = currentCreepCount;
            console.log('Current Creeps: ' +  Memory.currentCreepCount + ' -------------------------------');
            console.log('Harvesters: ' + _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length);
            console.log('Upgraders: ' + _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length);
            console.log('Builders: ' + _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length);
            console.log('Fighters: ' + _.filter(Game.creeps, (creep) => creep.memory.role == 'fighter').length);
        }
    }
};

module.exports = eventHandler;
