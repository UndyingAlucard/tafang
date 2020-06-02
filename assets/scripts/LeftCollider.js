//LeftCollider.js

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    onCollisionEnter: function (other, self) {
        //远程怪物的子弹碰撞
    },

    onCollisionStay: function (other, self) {
        //与近程怪物碰撞
        if (other.node.name == "Monster1") {
            self.node.parent.getComponent(self.node.parent.name).HPSub(other.node.getComponent("Monster1").m1AttackHP);
            self.node.getComponent("LeftCollider").schedule(function () {
                self.node.parent.getComponent(self.node.parent.name).HPSub(other.node.getComponent("Monster1").m1AttackHP);
            }, other.node.getComponent("Monster1").m1AttackSpeed);
        }
    },

    onCollisionExit: function (other, self) {
        self.node.getComponent("LeftCollider").unscheduleAllCallbacks();
    },

    // update (dt) {},
});
