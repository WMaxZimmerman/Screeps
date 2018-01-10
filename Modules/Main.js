var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFighter = require('role.fighter');
var autoSpawner = require('auto.spawner');
var eventHandler = require('event.handler');

module.exports.loop = function () {

    eventHandler.creepCountChanged();

    var tower = Game.getObjectById('19734ca1ab589c19300246d1');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    autoSpawner.run(Game.spawns['Spawn1']);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
                if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                    roleBuilder.run(creep);
                } else {
                    roleUpgrader.run(creep);
                }
            } else {
                roleHarvester.run(creep);
            }
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            if (creep.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
                roleUpgrader.run(creep);
            } else {
                roleBuilder.run(creep);
            }
        }
        if(creep.memory.role == 'fighter') {
            roleFighter.guard(creep, 'UnclaimedSource', 'flag');
        }
    }
}
