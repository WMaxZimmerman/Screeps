var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairman = require('role.repairman');
var roleFighter = require('role.fighter');

var roomManager = {

    manageRoom: function(room) {
        //Setup the memory object for the room if it isn't set.
        if (room.memory.properties == null || room.memory.properties == undefined) {
            room.memory.properties = {
                workerLvl: 1,
                workerLimit: room.find(FIND_SOURCES).length * 3
            };
        }

        let workers = room.find(FIND_MY_CREEPS, {filter: (c) => { c.memory.class == 'worker' }});

        //Check worker level
        if (workers.length == 0) room.memory.properties.workerLvl = 1;
        else {
            let energyLvl = Math.trunc(room.energyAvailable / 200);
            if (energyLvl > room.memory.properties.workerLvl) room.memory.properties.workerLvl = energyLvl;
            if (room.memory.properties.workerLvl > 5) room.memory.properties.workerLvl = 5;
        }

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                var closestStruct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER||
                            structure.structureType == STRUCTURE_CONTAINER) &&
                            (structure.energy < structure.energyCapacity);
                    }, algorithm: 'astar', ignoreRoads: true, swampCost: 1, plainCost: 1
                });
                if (closestStruct == null) {
                    roleUpgrader.run(creep);
                } else {
                    roleHarvester.run(creep);
                }
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                if (creep.room.find(FIND_MY_CREEPS, { filter: (c) => { return c.memory.role == 'harvester' }}).length == 0) {
                    roleHarvester.run(creep);
                } else if (creep.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
                //    roleRepairman.run(creep);
                //} else if (creep.room.find(FIND_STRUCTURES, { filter: (cs) =>  {
                //    return ((cs.structureType == STRUCTURE_WALL || cs.structureType == STRUCTURE_RAMPART) && cs.hits < cs.hitsMax);
                //}}).length == 0) {
                    roleUpgrader.run(creep);
                } else {
                    roleBuilder.run(creep);
                }
            }
            if(creep.memory.role == 'repairman') {
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
            if(creep.memory.role == 'guard') {
                console.log('found guard');
                roleFighter.guard(creep, 'Flag3', 'flag');
            }
            if(creep.memory.role == 'claimer') {
                roleFighter.claim(creep);
            }
            if(creep.memory.role == 'invader') {
                roleFighter.guard(creep, 'Hole', 'flag');
                //roleFighter.invade(creep);
            }
        }
    },

    manageWorkers: function(room) {
        let structuresNeedingEnergy = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER||
                        structure.structureType == STRUCTURE_CONTAINER) &&
                    (structure.energy < structure.energyCapacity);
            }
        }).length;
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES).length;

        let neededBuilders = constructionSites > 0 ? room.memory.properties.workerLimit / 3 : 0;
        let neededHarvesters = structuresNeedingEnergy > 0 ? room.memory.properties.workerLimit / 3 : 0;
        var workers = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.class == 'worker');

        var harvesters = _.filter(workers, (creep) => creep.memory.role == 'harvester');
        if (neededHarvesters == 0) {
            for(var harvester in harvesters) {
                harvester.memory.role = 'builder';
            }
        }

        var builders = _.filter(workers, (creep) => creep.memory.role == 'builder');
        if (neededBuilders == 0) {
            for(var builder in builders) {
                harvester.memory.role = 'upgrader';
            }
        }

        var upgraders = _.filter(workers, (creep) => creep.memory.role == 'upgrader');

        //harvester values
        //var harvesterLimit = room.energyCapacityAvailable / 100;
        //var neededHarvesters = ((room.energyCapacityAvailable - room.energyAvailable) / room.energyCapacityAvailable) * harvesterLimit;
        //var currentHarvesters = harvesters.length;
        //var harvesterDelta = neededHarvesters - currentHarvesters;

        //builder values
        //var constructionSites = room.find(FIND_CONSTRUCTION_SITES).length;
        //var builderLimit = (constructionSites / 2);
        //if (builderLimit > 10) builderLimit = 10;
        //var neededBuilders = (constructionSites / 100) * 1;
        //var currentBuilders = builders.length;
        //var builderDelta = neededBuilders - currentBuilders;
    },

    oldCreepManager: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                var closestStruct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER||
                            structure.structureType == STRUCTURE_CONTAINER) &&
                            (structure.energy < structure.energyCapacity);
                    }, algorithm: 'astar', ignoreRoads: true, swampCost: 1, plainCost: 1
                });
                if (closestStruct == null) {
                    roleUpgrader.run(creep);
                } else {
                    roleHarvester.run(creep);
                }
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                if (creep.room.find(FIND_MY_CREEPS, { filter: (c) => { return c.memory.role == 'harvester' }}).length == 0) {
                    roleHarvester.run(creep);
                } else if (creep.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
                //    roleRepairman.run(creep);
                //} else if (creep.room.find(FIND_STRUCTURES, { filter: (cs) =>  {
                //    return ((cs.structureType == STRUCTURE_WALL || cs.structureType == STRUCTURE_RAMPART) && cs.hits < cs.hitsMax);
                //}}).length == 0) {
                    roleUpgrader.run(creep);
                } else {
                    roleBuilder.run(creep);
                }
            }
            if(creep.memory.role == 'repairman') {
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
            if(creep.memory.role == 'guard') {
                console.log('found guard');
                roleFighter.guard(creep, 'Flag3', 'flag');
            }
            if(creep.memory.role == 'claimer') {
                roleFighter.claim(creep);
            }
            if(creep.memory.role == 'invader') {
                roleFighter.guard(creep, 'Hole', 'flag');
                //roleFighter.invade(creep);
            }
        }
    },

    spawnWorker: function(spawn, role, workerLvl) {
        let workerCost = (200 * workerLvl);

        function getWorkerBody(workerLvl){
            var body = [];

            for(var i = 0; i < workerLvl; i++)
            {
                if (body.length >= 47) break; //Max amount of body parts is 50
                body.push(WORK);
                body.push(CARRY);
                body.push(MOVE);
            }

            return body;
        }

        let workerBody = getWorkerBody(workerLvl);
        let workerName = 'Worker_' + workerLvl + '_' + Game.time;
        console.log('Spawning new Worker: ' + workerName + ' ('+ role + ')');
        spawn.spawnCreep(workerBody, workerName, {memory: {class: 'worker', role: role}});
    }
};

module.exports = roomManager;
