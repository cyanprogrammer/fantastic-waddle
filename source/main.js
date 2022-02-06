var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
module.exports.loop = function () {
    // gets rid of creep memory once the creep dies
      for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
//tower
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
    }

    //consts for spawns
    const gcl = Game.gcl.level
    Memory.spawnz = 1
    const roomLevel = Game.spawns['Spawn' + Memory.spawnz].room.controller.level
    //consts for counting
    var gradNum = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var mineNum = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
    var buildNum = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var haulNum = _.sum(Game.creeps, (c) => c.memory.role == 'hauler');
    if (gcl >= Memory.spawni ) {
      if (gradNum < 5 * gcl * roomLevel) {
      Game.spawns['Spawn' + Memory.spawnz].spawnCreep([MOVE,WORK,CARRY,CARRY], 'upgrader' + Game.time, {memory: {role: 'upgrader'}})
      }
      if (mineNum < 5 * gcl) {
      Game.spawns['Spawn' + Memory.spawnz].spawnCreep([MOVE,WORK], 'miner' + Game.time, {memory: {role: 'miner'}})
      }
      if (buildNum < 5 * gcl) {
      Game.spawns['Spawn' + Memory.spawnz].spawnCreep([MOVE,WORK,CARRY], 'builder' + Game.time, {memory: {role: 'builder'}})
      }
      if (haulNum < 5 * gcl) {
      Game.spawns['Spawn' + Memory.spawnz].spawnCreep([MOVE,CARRY], 'hauler' + Game.time, {memory: {role: 'hauler'}})
      }
      Memory.spawnz += 1
    } else {
      Memory.spawnz = 0
    }
    if (Game.cpu.bucket > 5000) {
    Game.cpu.generatePixel()
}
}
