require('prototype.creep')();

var roleRepairer = {
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy === 0) {
            creep.memory.repairing = false;
            creep.withdrawFromStorage();
        }

        var containerToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_CONTAINER) && s.hits / s.hitsMax < 0.75
        });

        if(containerToRepair) {
            creep.memory.repairing = true;
            if(creep.repair(containerToRepair) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containerToRepair);
            }
            return;
        }

        var wallOrRampartToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < 10000
        });

        if(wallOrRampartToRepair) {
            creep.memory.repairing = true;
            creep.memory.repairingWalls = true;
            if(creep.repair(wallOrRampartToRepair) == ERR_NOT_IN_RANGE) {
                creep.moveTo(wallOrRampartToRepair);
            }
        } else {
            creep.memory.repairingWalls = false;
            creep.memory.repairing = false;
        }

        var roadToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_ROAD && s.hits / s.hitsMax < 0.5
        });

        if(roadToRepair && !creep.memory.repairing) {
            creep.memory.repairing = true;
            if(creep.repair(roadToRepair) == ERR_NOT_IN_RANGE) {
                creep.moveTo(roadToRepair);
            }
        }
    }
}

module.exports = roleRepairer;
