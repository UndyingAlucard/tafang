//W2Attack.js

cc.Class({
    extends: cc.Component,

    properties: {
        w2BulletPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //创建一个子弹对象池
        this.w2BulletPool = new cc.NodePool();
        this.w2BulletPoolSize = 10;
        this.w2BulletPoolInit();

        this.newW2Bullet = null;

        this.attackTime = this.node.parent.getComponent("Wall2").attackSpeed - 1;
        this.attackSpeed = this.node.parent.getComponent("Wall2").attackSpeed;
    },

    start () {

    },

    // update (dt) {},

    //初始化子弹对象池
    w2BulletPoolInit: function () {
        var w2BulletNode = null;

        for (var i = 0; i < this.w2BulletPoolSize; i++) {
            w2BulletNode = cc.instantiate(this.w2BulletPrefab);
            this.w2BulletPool.put(w2BulletNode);
        }
    },

    //生成一个子弹
    spawnBullet: function (other, self) {
        //var newW2Bullet = null;
        this.attackTime += 1;
        if (this.attackTime >= this.attackSpeed) {
            this.attackTime -= this.attackSpeed;

            if (this.w2BulletPool.size() > 0) {
            this.newW2Bullet = this.w2BulletPool.get(this);
            } else {
                this.newW2Bullet = cc.instantiate(this.w2BulletPrefab);
            }
            //将子弹放入wall2节点下
            this.newW2Bullet.parent = this.node.parent;
            //this.node.parent.addChild(newW2Bullet);
            //设置子弹起始位置
            this.newW2Bullet.setPosition(this.node.getPosition());
            this.newW2Bullet.getComponent("W2Bullet").w2 = this;
            this.newW2Bullet.getComponent("W2Bullet").targetNode = other.node;            
        }
    },

    //移除子弹，返回对象池
    despawnBullet: function (bullet) {
        this.w2BulletPool.put(bullet)
    },

    //碰撞检测，碰撞状态中
    onCollisionStay: function (other, self) {
        if (other.node.name == "Monster1" || other.node.name == "Monster2") {
            //按wall2的攻击速度发射子弹攻击怪物
            self.node.getComponent("W2Attack").spawnBullet(other, self);
        }
    },

    onCollisionExit: function (other, self) {
        if (other.node.name == "Monster1" || other.node.name == "Monster2") {
            //怪物被消灭，首先判断Wall2节点下是否有W2Bullet节点，如果有就回收
            if (self.node.parent.getChildByName("W2Bullet") != null) {
                this.despawnBullet(self.node.parent.getChildByName("W2Bullet"));
            }
        }
    },
});
