/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.creep');
 * mod.thing == 'a thing'; // true
 */

 // TODO: Make it so creeps can't take energy from spawn/extensions if we're trying to spawn something

module.exports = function () {
    Creep.prototype.findClosestStoredEnergy = function() {
        let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType === STRUCTURE_CONTAINER ||
                        s.structureType === STRUCTURE_STORAGE) &&
                    !this.room.memory.sourceContainers.includes(s.id) &&
                    _.sum(s.store) > 0;
            }
        });
        return target;
    };

    Creep.prototype.findClosestContainer = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER
                }
        });
    };

    Creep.prototype.findClosestUnfilledStructure = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy < structure.energyCapacity;
                }
        });
    };

    Creep.prototype.findClosestUnfilledSpawnOrExtension = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity;
                }
        });
    };

    Creep.prototype.findClosestEnergySource = function() {
        return this.pos.findClosestByPath(FIND_SOURCES);
    };

    Creep.prototype.findWithdrawOrHarvestSource = function() {
        let stored = this.findClosestStoredEnergy();
        if (stored) {
            return stored;
        } else {
            return this.findClosestEnergySource();
        }
    };

    Creep.prototype.withdrawFromStorage = function(target) {
        if (target == undefined) {
            target = this.findClosestStoredEnergy();
        }

        if(target) {
            if(this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    };

    Creep.prototype.dropEnergy = function() {
        console.log(this.name + "dropped " + this.drop(RESOURCE_ENERGY) + " energy");
    }

    Creep.prototype.depositEnergy = function() {
        // Prefer containers to spawns or extensions
        let dest = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType === STRUCTURE_SPAWN ||
                        s.structureType === STRUCTURE_EXTENSION)  &&
                        s.energy < s.energyCapacity;
            }
        });
        if(!dest) {
            dest = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity * 0.25;
                }
            });
        }

        if(!dest) {
            dest = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return ((s.structureType === STRUCTURE_CONTAINER ||
                            s.structureType === STRUCTURE_STORAGE) &&
                            !this.room.memory.sourceContainers.includes(s.id) &&
                            _.sum(s.store) < s.storeCapacity) ||
                            s.structureType === STRUCTURE_TOWER

                }
            });
        }
        if(this.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(dest, {visualizePathStyle: {stroke: 'yellow'}});
        }
    };

    Creep.prototype.depositEnergyInSpawnsOrExtensions = function() {
        let target = this.findClosestUnfilledSpawnOrExtension();
        if(target) {
            if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: 'lightgreen'}});
            }
        }
    };

    Creep.prototype.harvestEnergy = function() {
        let source = this.pos.findClosestByPath(FIND_SOURCES);
        if (this.room.find(FIND_DROPPED_RESOURCES).length > 0) {
            this.pickupDroppedEnergy();
        } else if(this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };

    Creep.prototype.pickupDroppedEnergy = function() {
        let source = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
		if(source){
    		if(this.pickup(source) == ERR_NOT_IN_RANGE) {
    		    this.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
    		}
		}
    };

    Creep.prototype.findUsableEnergy = function() {
    }
}
