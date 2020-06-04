//W2Bullet.js

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.targetNode = null;
        this.bulletSpeed = 250;
    },

    start () {

    },

    update (dt) {
        //console.log("目标：" + this.targetNode.name);
        if (this.targetNode.name == null) {
            this.w2.despawnBullet(this.node);
        } else {
            var targetPos = this.targetNode.getPosition();
            //console.log("怪物1的位置：" + this.targetNode.getPosition());
            var bulletPos = cc.v2(this.node.x + this.node.parent.x, this.node.y + this.node.parent.y);
            var normalizeVec = targetPos.sub(bulletPos).normalize();
            //console.log("子弹的轨迹坐标：" + normalizeVec);
            this.node.x += normalizeVec.x * this.bulletSpeed * dt;
            this.node.y += normalizeVec.y * this.bulletSpeed * dt;

            //console.log("子弹的位置：" + bulletPos);
            //调整子弹头的角度
            this.node.angle = cc.v2(1, 0).signAngle(normalizeVec) * 180 / Math.PI;
        }
    },

    //碰撞后，子弹回收
    onCollisionEnter: function (other, self) {
        if (other.node.name == "Monster1" || other.node.name == "Monster2") {
            //怪物掉血，判断W2Bullet节点是否还挂载在Wall2节点下，如果是，则子弹返回对象池
            if (self.node.parent != null) {
                other.node.getComponent(other.node.name).HPSub(self.node.parent.getComponent("Wall2").attackHP);
                self.node.getComponent("W2Bullet").w2.despawnBullet(self.node);
            }
            
        }
    }

});
