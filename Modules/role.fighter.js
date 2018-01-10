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

        if (!creep.pos.isNearTo(target)) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ba2807'}});
        }

        for(var hostileCreep in creep.room.find(FIND_HOSTILE_CREEPS)) {
            if(creep.pos.inRangeTo(target, 3)) {
                creep.rangedAttack(target);
            }
        }
    }
};

module.exports = roleFighter;
