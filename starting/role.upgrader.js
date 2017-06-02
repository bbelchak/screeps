require('prototype.creep')();

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let containerStorage = Game.getObjectById(creep.room.memory.containerStorageId);
        if(creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.withdrawFromStorage(containerStorage);
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }
        if(!creep.memory.upgrading && creep.carry.energy !== creep.carryCapacity) {
            creep.memory.upgrading = false;
            creep.withdrawFromStorage(containerStorage);
        }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleUpgrader;
