var roomManager = require('room.manager');
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
	try {
	    var room = Game.rooms[roomName];
            var controller = room.controller;

            roomManager.manageRoom(room);

            if (controller.owner.username == 'SmileyFace') {
		var spawns = room.find(FIND_MY_SPAWNS);
		room.find(FIND_MY_SPAWNS).map( (spawn) => {
                    autoSpawner.run(spawn);
		});
            }
	} catch(err) {
	    console.log(Game.rooms);
	    console.log('and error occurred in main: ' + err.message);
	}
    }
}
