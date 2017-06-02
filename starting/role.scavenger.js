require('prototype.creep')();

var roleScavenger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if(creep.carry.energy !== creep.carryCapacity && !creep.memory.hauling) {
            if(source){
                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            creep.memory.hauling = true;
        }
        if(creep.memory.hauling === true && creep.carry.energy > 0) {
            creep.depositEnergy();
        } else {
            creep.memory.hauling = false;
        }
	}
};

module.exports = roleScavenger;
