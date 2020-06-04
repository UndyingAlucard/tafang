//monsters.js
//初始化不同种类的怪物，将怪物预制节点放入对象池，每一个关卡生成一定量的m1怪物

const Monster1 = require('Monster1');
const Monster2 = require("Monster2");

cc.Class({
    extends: cc.Component,

    properties: {
        monster1Total: 0,

        monster2Total: 0,

       // monster3Count: 0,

        monster1Prefab: {
            default: null,
            type: cc.Prefab
        },

        monster2Prefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.monster1Pool = new cc.NodePool('Monster1');
        this.monster1Count = 0; //计数Monster1的个数
        this.monster2Pool = new cc.NodePool("Monster2");
        this.monster2Count = 0;
        
        this.monsterPoolSize = 8; //对象池的大小
        this.leftBornDirection  = 0;
        this.rightBornDirection = 1;

        this.monsterPoolInit();
    },

    //初始化对象池
    monsterPoolInit: function () {
        var m1Node = null;
        var m2Node = null;
        for (var i = 0; i < this.monsterPoolSize; i++) {
            m1Node = cc.instantiate(this.monster1Prefab);
            m2Node = cc.instantiate(this.monster2Prefab);
            this.monster1Pool.put(m1Node);
            this.monster2Pool.put(m2Node);
        }
    },

    start: function () {
        //怪物的出场方式，如何出怪
        //this.spawnMonster1(this.rightBornDirection);
        this.spawnMonster2(this.rightBornDirection);
        this.scheduleOnce(function () {
            this.spawnMonster2(this.leftBornDirection);
            this.spawnMonster1(this.rightBornDirection);
         }, 30);

         this.despawnMonster1(this.leftBornDirection);
        
        /*
        this.schedule(function () {
            this.spawnMonster1(this.leftBornDirection);
            this.spawnMonster1(this.rightBornDirection);
        }, 90, 5, 90);
        */
    },

    //生成Monster1，从Monster1对象池中请求一个对象
    spawnMonster1: function (mDirection) {
        var newM1Node = null;
        //生成一个monster1怪物
        if (this.monster1Pool.size() > 0) {
            newM1Node = this.monster1Pool.get(this);
        } else {
            newM1Node = cc.instantiate(this.monster1Prefab);
        }
        //
        this.monster1Count ++;
        //放入monsters节点下
        this.node.addChild(newM1Node);
        newM1Node.setPosition(this.getGroundPosition(mDirection, newM1Node));
        newM1Node.getComponent('Monster1').game = this; //在monster1中引用这个实例
        //newM1Node.getComponent('Monster1').m1MoveStart();
    },
    //生成Monster2，从Monster2对象池中请求一个对象
    spawnMonster2: function (mDirection) {
        var newM2Node = null;
        //生成一个monster2怪物
        if (this.monster2Pool.size() > 0) {
            newM2Node = this.monster2Pool.get(this);
        } else {
            newM2Node = cc.instantiate(this.monster2Prefab);
        }

        this.monster2Count ++;
        //放入monsters节点下
        this.node.addChild(newM2Node);
        newM2Node.setPosition(this.getGroundPosition(mDirection, newM2Node));
        newM2Node.getComponent("Monster2").game = this;
    },

    despawnMonster1: function (m1) {
        this.monster1Pool.put(m1);
    },

    despawnMonster2: function (m2) {
        this.monster2Pool.put(m2);
    },

    //获取地上怪物的出生坐标
    getGroundPosition: function (mDirection, childNode) {
        var monsterX = 0;
        var monsterY = -(290 - childNode.height/2);  //只要父节点位置和ground节点位置不移动，该值不变
        var leftDir = 0;  //标志，0表示在场景左侧生成一个怪物,1表示右侧

        //在场景左侧边界获取一个怪物坐标
        if (leftDir == mDirection) {
            monsterX = -this.node.width/2 - childNode.width/2;
            //console.log(monsterX);
        } else {  //非左即右
            monsterX = this.node.width/2 + childNode.width/2;
            childNode.scaleX = -1; //怪物图是向右移动的，向左移动将怪物图转一个方向
        }

        //console.log(cc.v2(monsterX, monsterY));
        return cc.v2(monsterX, monsterY);
    },

    //获取空中怪物的出生坐标

    //如何出怪（写个方法）
    
    // update (dt) {},
});
