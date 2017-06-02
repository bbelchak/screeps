require('prototype.creep')();

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.harvestSourceId === undefined) {
            var covering = _.filter(Game.creeps, (c) => c.memory.harvestSourceId !== undefined);
            var covered = [];
            _.forEach(covering, function(v) {
                covered.push(v.memory.harvestSourceId);
            });
            creep.memory.harvestSourceId = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (s) => {
                    return !covered.includes(s.id);
                }
            }).id;
        }
	    if(!creep.memory.buildingContainer && creep.carryCapacity > 0 && creep.carry.energy === creep.carryCapacity) {
            try {
                creep.memory.containerSiteId = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                    filter: (s) => {
                        return (s.structureType === STRUCTURE_CONTAINER)
                    }
                }).id;
                if(creep.build(Game.getObjectById(creep.memory.containerSiteId)) !== ERR_NOT_IN_RANGE) {
                    creep.memory.buildingContainer = true;
                }
            } catch(err) {
                creep.memory.buildingContainer = false;
            }
            if(!creep.memory.buildingContainer) {
                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_CONTAINER)
                    }
                });
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	               creep.dropEnergy();
                }
            }
        } else if(creep.memory.buildingContainer && creep.carry.energy > 0) {
            if(creep.build(Game.getObjectById(creep.memory.containerSiteId)) !== ERR_NOT_IN_RANGE) {
                console.log(creep.name + ' is doing stuff');
            }
        } else {
            creep.memory.buildingContainer = false;
            var harvestSource = Game.getObjectById(creep.memory.harvestSourceId);
            if(creep.memory.moving) {
                let container = harvestSource.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return s.structureType == STRUCTURE_CONTAINER
                    }
                });
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                if(creep.pos.x === container.pos.x && creep.pos.y === container.pos.y) {
                    creep.memory.moving = false;
                }
            } else {
                if(creep.harvest(harvestSource) == ERR_NOT_IN_RANGE) {
                    creep.memory.moving = true;
                }
            }
        }
	}
};

module.exports = roleHarvester;
