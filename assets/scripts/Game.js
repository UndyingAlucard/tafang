//game.js

const King = require('King');
const Monsters = require('Monsters');

cc.Class({
    extends: cc.Component,

    properties: {
        monsters: {
            default: null,
            type: Monsters
        },

        king: {
            default: null,
            type: King
        },

        ground: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        //设置调试绘制碰撞体标志
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit || cc.PhysicsManager.DrawBits.e_pairBit;
        //开启碰撞检测系统
        cc.director.getCollisionManager().enabled = true;

        this.leftBornDirection  = 0;
        this.rightBornDirection = 1;
        this.mBornSpeed = 1;
        
    },

    start () {
        
        //this.monsters.spawnMonster1(this.leftBornDirection);
        //this.monsters.spawnMonster1(this.rightBornDirection);
        
        
    },


    update (dt) {},
});
