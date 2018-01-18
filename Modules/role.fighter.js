var roleFighter = {

    /** @param {Creep} creep **/
    patrol: function(creep) {
        creep.moveTo(40, 12);
    },

    guard: function(creep, targetName, targetType) {
        var target;
        if (targetType == 'flag') {
            target = Game.flags[targetName];
        }

        var closestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (closestEnemy != null && closestEnemy != undefined) {
            if(creep.rangedAttack(closestEnemy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnemy, {visualizePathStyle: {stroke: '#ba2807'}});
            }
        }
    },

    killWall: function(creep, targetName, targetType) {
        var target;
        if (targetType == 'flag') {
            target = Game.flags[targetName];
        }

        if (!creep.pos.isNearTo(target)) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ba2807'}});
        }

        for(var wall in creep.room.find(FIND_STRUCTURES, {filter: (struct) => struct.structureType == STRUCTURE_WALL})) {
            if(creep.pos.inRangeTo(wall, 3)) {
                creep.rangedAttack(wall);
            }
        }

        if (creep.hits < (creep.hitsMax / 2)) {
            creep.heal(creep);
        }
    },

    claim: function(creep) {

        var controller = creep.room.controller;
        //creep.say(creep.claimController(controller));
        creep.say(creep.reserveController(controller));
    },

    invade: function(creep) {
        var flag = Game.flags['invade'];
        targetRoom = flag.pos.roomName;
        console.log(JSON.stringify(targetRoom));
        if (targetRoom == undefined || targetRoom == null) {

        } else {
            console.log('0');
            if (creep.room.name != targetRoom) {
                console.log(creep.room.name);
                var flagPath = creep.pos.findPathTo(flag, {algorithm: 'astar', ignoreDestructibleStructures: true});
                creep.moveTo(flag);
            } else {
                var closestSpawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS, {algorithm: 'astar', ignoreDestructibleStructures: true});

                if (closestSpawn != null) {
                    console.log('2');
                    if (creep.dismantle(closestSpawn) == ERR_NOT_IN_RANGE) {
                        creep.rangedAttack(closestSpawn);
                        var closestWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (struct) => struct.structureType == STRUCTURE_WALL});
                        var attackCode = creep.dismantle(closestWall);
                        console.log('dismantle code: ' + attackCode);
                        var path = creep.pos.findPathTo(closestSpawn, {algorithm: 'astar', ignoreDestructibleStructures: true});
                        creep.moveByPath(path);
                    }
                } else {
                    var closestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

                    if (closestEnemy != null) {
                        if(creep.pos.inRangeTo(closestEnemy, 1)) {
                            creep.attack(closestEnemy);
                        } else if(creep.pos.inRangeTo(closestEnemy, 3)) {
                            creep.rangedAttack(closestEnemy);
                        }
                        creep.moveTo(closestEnemy);
                    } else {
                        creep.moveTo(Game.spawns['Spawn1']);
                    }
                }

                if (creep.hits < (creep.hitsMax / 2)) {
                    creep.heal(creep);
                }
            }
        }
    }
};

module.exports = roleFighter;
