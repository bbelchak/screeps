require('prototype.creep')();

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy === 0) {
            creep.memory.building = false;
        }

        if(!creep.memory.building) {
            if(creep.carry.energy > 0) {
                creep.memory.building = true;
            } else {
                creep.withdrawFromStorage();
            }
        }

        if(creep.memory.building && creep.carry.energy > 0) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: 'red'}});
            }
        }
	}
};

module.exports = roleBuilder;
