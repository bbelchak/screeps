var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHauler = require('role.hauler');
var roleScavenger = require('role.scavenger');
var spawner = require('spawner');
var towers = require('towers');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // TODO: Test this on a from scratch room
    var mainRoom = Game.rooms['W46N97'];
    mainRoom.memory.containersBySource = {};
    mainRoom.memory.sourceContainers = [];

    var sources = mainRoom.find(FIND_SOURCES);

    _.forEach(sources, function(source) {
        let container = source.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_CONTAINER;
            }
        });
        mainRoom.memory.containersBySource[source.id] = container.id;
        mainRoom.memory.sourceContainers.push(container.id);
    });

    mainRoom.memory.controllerContainerId = mainRoom.controller.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
            return s.structureType == STRUCTURE_CONTAINER;
        }
    }).id;

    spawner.run();
    towers.run();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'scavenger') {
            roleScavenger.run(creep);
        }
    }

}
