var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairman = require('role.repairman');
var roleFighter = require('role.fighter');
var autoSpawner = require('auto.spawner');
var eventHandler = require('event.handler');
var constructionManager = require('construction.manager');

module.exports.loop = function () {

    //Temporary cleanup of roads
    // for (var index in Game.constructionSites) {
    //     var cs = Game.constructionSites[index];
    //     if (cs != undefined && cs.room != undefined && cs.room.name != 'W25N38' || cs.pos.y < 9) {
    //         cs.remove();
    //     }
    // }

    // for (var index in Game.rooms['W27N38'].find(FIND_STRUCTURES)) {
    //     var cs = Game.rooms['W27N38'].find(FIND_STRUCTURES)[index];
    //     if (cs.structureType == 'road') {
    //         cs.destroy();
    //     }
    // }

    eventHandler.creepCountChanged();

    for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var owner = room.controller.owner;
        if (owner != undefined && owner != null) {
            if (room != undefined && room.controller.owner.username == "SmileyFace") {
                eventHandler.rclUpgrade(room);
            }
        }
    }

    constructionManager.setPrioritySite();

    for(var structureId in Game.structures) {
        var structure = Game.structures[structureId];
        if(structure != null && structure != undefined && structure.structureType == 'tower') {
            var closestDamagedStructure = structure.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < 100000) && (structure.structureType == 'rampart');
                }
            });
            if(closestDamagedStructure) {
                structure.repair(closestDamagedStructure);
            }

            var closestHostile = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                structure.attack(closestHostile);
            }
        }
    }

    //Memory Management
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(var index in Memory.sites) {
        var site = Memory.sites[index];
        //console.log(site.roomName);
        var siteRoom = Game.rooms[site.roomName];
        if (siteRoom == undefined) {
            Memory.sites.splice(index, 1);
            //console.log('Clearing constructionSite memory in non-found room.');
        } else if(siteRoom.lookForAt(LOOK_CONSTRUCTION_SITES, site.pos.x,  site.pos.y).length == 0) {
            Memory.sites.splice(index, 1);
            //console.log('Clearing non-existing constructionSite memory.');
        }
    }

    constructionManager.cleanUselessRoads();

    for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var controller = room.controller;

        if (controller.owner.username == 'SmileyFace') {
            var spawns = room.find(FIND_MY_SPAWNS);
            room.find(FIND_MY_SPAWNS).map( (spawn) => {
                var lvl = Math.trunc(room.energyCapacityAvailable / 200);
                let creepCount = room.find(FIND_MY_CREEPS).length;
                if (creepCount <= 2) lvl = 1;
                autoSpawner.run(spawn, lvl);
            });
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
    }
}
