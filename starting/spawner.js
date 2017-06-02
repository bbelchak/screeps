/*
 * TODO:
 *   * Make this into a prototype on spawner
 *   * Make the spawner spawn the biggest possible unit
 *   * Make the spawner spawn roles
 */

 var spawner = {
    run: function() {
        var wanted = {
            'harvesters': 2,
            'upgraders': 3,
            'builders': 2,
            'haulers': 2,
            'repairers': 1,
            'scavengers': 1
        }

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');

        if(haulers.length < wanted['haulers']) {
            var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'hauler'});
            console.log('Spawning new hauler: ' + newName);
            return;
        }

        if(harvesters.length < wanted['harvesters']) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: 'harvester'});
            // if (newName === ERR_NOT_ENOUGH_ENERGY) {
            //     var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
            // }
            console.log('Spawning new harvester: ' + newName);
            return;
        }

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

        if(upgraders.length < wanted['upgraders'] && harvesters.length >= 1) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'upgrader'});
            console.log('Spawning new upgrader: ' + newName);
            return;
        }

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        if(builders.length < wanted['builders'] && harvesters.length >= 1) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'builder'});
            console.log('Spawning new builder: ' + newName);
            return;
        }

        var repairNeeded = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_ROAD && s.hits / s.hitsMax < 0.25) ||
                          (s.structureType === STRUCTURE_WALL && s.hits < 1000) ||
                          (s.structureType === STRUCTURE_CONTAINER && s.hits / s.hitsMax < 0.75)
        });

        if(repairNeeded !== "") {
            var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
            if(repairers.length < wanted['repairers'] && harvesters.length >= 1) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'repairer'});
                console.log('Spawning new repairer: ' + newName);
                return;
            }
        }

        var scavengers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scavenger');

        if(scavengers.length < wanted['scavengers']) {
            var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'scavenger'});
            console.log('Spawning new scavenger: ' + newName);
            return;
        }



       if(Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
 }

module.exports = spawner;
