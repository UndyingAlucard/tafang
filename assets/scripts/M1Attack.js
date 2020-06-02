

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        this.attackTime = this.node.parent.getComponent("Monster1").attackSpeed / 2; //m1的攻击间隔
        this.attackSpeed = this.node.parent.getComponent("Monster1").attackSpeed; //m1的攻击速度
        this.attackHP = this.node.parent.getComponent("Monster1").attackHP; //m1的攻击力

    },

    start () {

    },

    //m1开始攻击，被攻击目标掉血
    attackStart: function (other, self) {
        self.node.parent.getComponent("Monster1").attackAnim.play();

        this.attackTime = this.attackTime + 1;
        if (this.attackTime >= this.attackSpeed) {
            this.attackTime = this.attackTime - this.attackSpeed;
            //判定攻击目标，被攻击目标掉血
            if (other.node.name == "King") {
                other.node.getComponent("King").animKingBeAttacked.play();
                other.node.getComponent("King").kingHPSub(this.attackHP);
                //console.log("kingHP: " + other.node.getComponent("King").kingHPNow);
            }
            if (other.node.name == "LeftCollider" || other.node.name == "RightCollider") {
                other.node.parent.getComponent(other.node.parent.name).HPSub(this.attackHP);
                //console.log("wallHP: " + other.node.parent.getComponent(other.node.parent.name).HPNow);
            }
        }
        
    },

    onCollisionEnter: function (other, self) {
        if (other.node.name == "King" || other.node.name == "LeftCollider" || other.node.name == "RightCollider") {
            self.node.parent.getComponent("Monster1").moveStop();
        }
    },

    onCollisionStay: function (other, self) {
        if (other.node.name == "King" || other.node.name == "LeftCollider" || other.node.name == "RightCollider") {
            this.attackStart(other, self);
        }
    },

    onCollisionExit: function (other, self) {
        if (self.node.parent.getComponent("Monster1").HPNow > 0 && (other.node.name == "LeftCollider" || other.node.name == "RightCollider")) {
            self.node.parent.getComponent("Monster1").moveStart();
        }
    },

    // update (dt) {},
});
