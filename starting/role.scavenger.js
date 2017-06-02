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
            return;
        } else {
            creep.memory.hauling = true;
        }
        if(creep.memory.hauling === true && creep.carry.energy > 0) {
            creep.depositEnergy();
        } else {
            creep.memory.hauling = false;
        }

        if(!creep.memory.restocking && !creep.memory.hauling) {
            creep.memory.towerToRestock = _.min(creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity * 0.5;
                }
            }), function(o) { o.energy; });
            if(!creep.memory.hauling && creep.memory.towerToRestock !== Infinity) {
                creep.withdrawFromStorage();
                creep.memory.restocking = true;
            }
        } else {
            if(creep.transfer(creep.memory.towerToRestock) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.towerToRestock);
            } else {
                creep.memory.restocking = false;
                creep.memory.towerToRestock = null;
            }
        }
	}
};

module.exports = roleScavenger;
