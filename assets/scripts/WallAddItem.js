//WallAddItem.js

const Wall1 = require('Wall1');
const Wall2 = require('Wall2');

cc.Class({
    extends: cc.Component,

    properties: {
        wallType: {
            default: 1,
            displayName: "怪物类型"
        },

        wall1Prefab: {
            default: null,
            type: cc.Prefab
        },

        wall2Prefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad () {
        //获取当前场景
        this.Scence = cc.director.getScene();
        //this.Game = this.Scence.getChildByName("Canvas").getComponent("Game");

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        //获取动画组件
        //this.anim = this.getComponent(cc.Animation);
        //记录初始位置
        this.startPos = this.node.getPosition();
    
        this.wallPrefab = null; //选中的wall类型预制资源
        //this.wallPool = null; //选中的哪种wall对应的对象池
        this.wallCount = 0; //添加的wall的数量


        //创建wall预制节点的对象池
        this.wallPool = new cc.NodePool();
        //this.wall1Pool = new cc.NodePool('Wall1');
        //this.wall2Pool = new cc.NodePool('Wall2');

        this.wallPoolSize = 10; //对象池大小
        this.wallPoolInit();
    },

    //初始化wall对象池
    wallPoolInit: function() {
        var wNode = null;

        switch (this.wallType) {
            case 1: 
                this.wallPrefab = this.wall1Prefab;
                break;

            case 2: 
                this.wallPrefab = this.wall2Prefab;
                break;

            default: 
                break;
        }

        for (var i = 0; i < this.wallPoolSize; i++) {
            wNode = cc.instantiate(this.wallPrefab);
            this.wallPool.put(wNode);
        }
    },

    //添加wall，从对象池中申请，调用switch语句判别添加的是哪种wall
    spawnWall: function () {
        var newWallNode = null;

        if (this.wallPool.size() > 0) {
            newWallNode = this.wallPool.get();
        } else {
            newWallNode = cc.instantiate(this.wallPrefab);
        }
        //将该节点放在节点Walls下面
        newWallNode.parent = this.Scence.getChildByName("Canvas").getChildByName("Walls");
        newWallNode.getComponent(newWallNode.name).game = this;
        //设置生成的坐标
        newWallNode.setPosition(this.nodePos);
        this.node.setPosition(this.startPos);
        this.nodePos = this.node.getPosition();
    },

    //删除预制节点，即将该节点返回对应的对象池
    despawnWall: function (wall) {
        this.wallPool.put(wall);
    },

    start () {
        
    },

    // update (dt) {},

    onTouchStart: function () {
        this.nodePos = this.node.getPosition();
    },

    onTouchMove: function (event) {
        var self = this;
        var touches = event.getTouches();
        //触摸刚开始的位置
        var oldPos = self.node.parent.convertToNodeSpaceAR(touches[0].getStartLocation());
        //触摸时不断变更的位置
        var newPos = self.node.parent.convertToNodeSpaceAR(touches[0].getLocation());
        var subPos = oldPos.sub(newPos);

        self.node.x = self.nodePos.x - subPos.x;
        self.node.y = self.nodePos.y - subPos.y;

        //控制节点移不出屏幕
        var minX = -self.node.parent.width / 2 + self.node.width / 2; //最小X坐标；
        var maxX = Math.abs(minX);
        var minY = -self.node.parent.height / 2 + self.node.height / 2; //最小Y坐标；
        var maxY = Math.abs(minY);
        var nPos = self.node.getPosition(); //节点实时坐标；

        if (nPos.x < minX) {
            nPos.x = minX;
        };
        if (nPos.x > maxX) {
            nPos.x = maxX;
        };
        if (nPos.y < minY) {
            nPos.y = minY;
        };
        if (nPos.y > maxY) {
            nPos.y = maxY;
        };
        self.node.setPosition(nPos);
    },

    onTouchEnd: function () {
        var nPosx = parseInt(this.node.x / 50) * 50;
        var nPosy = (parseInt(this.node.y / 50) * 50) - 25;
        this.node.x = nPosx;
        this.node.y = nPosy;
        this.nodePos = this.node.getPosition(); //获取触摸结束之后的node坐标；
        //在触摸结束之后的nodePos生成一个Wall,将此Item回归原位
        this.spawnWall();
    },

    onTouchCancel: function () {
        var nPosx = parseInt(this.node.x / 50) * 50;
        var nPosy = (parseInt(this.node.y / 50) * 50) - 25;
        this.node.x = nPosx;
        this.node.y = nPosy;
        this.nodePos = this.node.getPosition(); //获取触摸结束之后的node坐标；
        //在触摸结束之后的nodePos生成一个Wall,将此Item回归原位
        this.spawnWall();
    },
});
