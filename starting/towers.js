var towers = {

    /** @param {Game} game **/
    run: function() {
        // TODO: Change this to not rely on the spawn existing
        towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_TOWER }
                });
        _.forEach(towers, function(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
                return;
            }
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => ((structure.structureType === STRUCTURE_RAMPART && structure.hits < 100000) ||
                                        structure.hits !== structure.hitsMax) &&
                                        structure.id !== tower.id
            });

            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        });
	}
};

module.exports = towers;
