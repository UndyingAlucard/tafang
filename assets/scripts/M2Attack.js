//M2Attack.js

cc.Class({
    extends: cc.Component,

    properties: {
        m2ArrowPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function () {
        //创建一个箭矢对象池
        this.m2ArrowPool = new cc.NodePool();
        this.m2ArrowPoolSize = 10; //对象池的大小
        this.m2ArrowPoolInit();  //初始化对象池

        this.attackTime = this.node.parent.getComponent("Monster2").attackSpeed - 1; //m1的攻击间隔
        this.attackSpeed = this.node.parent.getComponent("Monster2").attackSpeed; //m1的攻击速度
        this.attackHP = this.node.parent.getComponent("Monster2").attackHP; //m1的攻击力
        //this.attackSize = this Monster2的攻击范围在cocos creator引擎中设置

        ////这个坐标是在cocos creator引擎中给出的
        this.arrowBornPosX = 38;
        this.arrowBornPosY = -16;
    },

    start () {

    },

    // update (dt) {},

    //初始化对象池
    m2ArrowPoolInit: function () {
        var m2ArrowNode = null;

        for (var i = 0; i < this.m2ArrowPoolSize; i++) {
            m2ArrowNode = cc.instantiate(this.m2ArrowPrefab);
            this.m2ArrowPool.put(m2ArrowNode);
        }
        
    },

    //生成一支箭
    spawnArrow: function (other, self) {
        var newM2Arrow = null;
        //用这个逻辑来定时发射箭矢还是有点问题
        this.attackTime = this.attackTime + 1;
        if (this.attackTime >= this.attackSpeed) {
            this.attackTime = this.attackTime - this.attackSpeed;
            //射箭
            if (this.m2ArrowPool.size() > 0) {
                newM2Arrow = this.m2ArrowPool.get(this);
            } else {
                newM2Arrow = cc.instantiate(this.m2ArrowPrefab);
            }
            //播放攻击动画
            self.node.parent.getComponent("Monster2").attackAnim.play();
            //将箭矢放入Monster2节点下
            newM2Arrow.parent = this.node.parent;
            //设置子弹起始位置
            newM2Arrow.setPosition(this.arrowBornPosX, this.arrowBornPosY); 
            newM2Arrow.getComponent("M2Arrow").m2Attack = this; //将该脚本的引用给M2Arrow.js
            newM2Arrow.getComponent("M2Arrow").targetNode = other.node;
            //箭矢不需要目标，Monster2只要检测到前方有碰撞体，就射箭，箭矢笔直往前运动，直到撞到wall或king
            
        }
        
    },

    //删除箭矢节点，返回对象池
    despawnArrow: function (arrow) {
        this.m2ArrowPool.put(arrow);
    },

    //碰撞检测
    onCollisionEnter: function (other, self) {
        if (other.node.name == "LeftCollider" || other.node.name == "RightCollider" || other.node.name == "King") {
            //Monster2停止移动
            self.node.parent.getComponent("Monster2").moveStop();
        }
    },

    onCollisionStay: function (other, self) {
        if (other.node.name == "LeftCollider" || other.node.name == "RightCollider" || other.node.name == "King") {
            //Monster2开始攻击
            self.node.getComponent("M2Attack").spawnArrow(other, self);
        }
    },
    
    //这里可能有问题（注意一下）
    onCollisionExit: function (other, self) {
        if (other.node.name == "LeftCollider" || other.node.name == "RightCollider" 
        && self.node.parent.getComponent("Monster2").HPNow > 0) {
            self.node.parent.getComponent("Monster2").moveStart();
            //self.node.getComponent("M2Attack").despawnArrow(self.node.parent.getChildByName("M2Arrow"));
        }
    }, 
});
