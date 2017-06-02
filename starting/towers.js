var towers = {

    /** @param {Game} game **/
    run: function() {
        // TODO: Change this to not rely on the spawn existing
        _.forEach(Game.rooms, function(room) {
            towers = room.find(FIND_MY_STRUCTURES, {
                        filter: { structureType: STRUCTURE_TOWER }
                    });
            /*
            * Order of tower priority:
            * 1. Attack hostile creeps
            * 2. Repair very damaged ramparts/walls
            * 3. Repair damaged structures
            */
            _.forEach(towers, function(tower) {
                // Find the closest hostile creep and destroy it!
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    tower.attack(closestHostile);
                    return;
                }

                // Find the closest, most damaged rampart/wall
                var closestDamagedRampart = _.min(tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => (structure.structureType === STRUCTURE_RAMPART ||
                                            structure.structureType === STRUCTURE_WALL) &&
                                            structure.hits < 1000000
                }), function(o) { return o.hits; });

                if(closestDamagedRampart) {
                    tower.repair(closestDamagedRampart);
                    return;
                }

                // Find the closest, most damaged structure
                var closestDamagedStructure = _.min(tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits !== structure.hitsMax &&
                                        structure.id !== tower.id
                }), function(o) { return o.hits });

                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            });
    	});
    }
};

module.exports = towers;
