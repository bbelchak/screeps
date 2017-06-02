require('prototype.creep')();

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let creepsOnDropped = 1;
        let creepsPerContainer = 2;

        if (creep.memory.hauling) {
            creep.depositEnergy();
        }
	    if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.hauling = true;
	    }
        if (creep.carry.energy !== creep.carryCapacity && !creep.memory.hauling) {
            if(!creep.memory.containerId) {
                var covering = _.filter(Game.creeps, (c) => c.memory.containerId !== undefined);
                let covered = [];
                _.forEach(covering, function(v) {
                    covered.push(v.memory.containerId);
                });
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return s.structureType == STRUCTURE_CONTAINER &&
                               !covered.includes(s.id) &&
                               creep.room.memory.sourceContainers.includes(s.id);
                    }
                });
                if(!container) {
                    container = _.sample(creep.room.memory.sourceContainers);
                }
                creep.memory.containerId = container.id;
            }
            container = Game.getObjectById(creep.memory.containerId);
            
            if (container.store[RESOURCE_ENERGY] > 0) {
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: 'yellow'}});
                }
            } else {
                container = creep.findClosestStoredEnergy();
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: 'yellow'}});
                }
            }
        } else if (creep.carry.energy === 0 && creep.memory.hauling) {
            creep.memory.hauling = false;
        }
	}
};

module.exports = roleHauler;
