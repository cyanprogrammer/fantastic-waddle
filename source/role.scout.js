var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
      const exit = creep.room.find(FIND_EXIT);
      const item = exit[Math.floor(Math.random()*exit.length)];
      
      creep.moveTo(exit[2]);
    }
};

module.exports = roleScout;
