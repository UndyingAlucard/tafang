//M2Arrow.js

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.targetNode = null;
        this.arrowSpeed = 200;
    },

    start () {
        this.arrowMoveStart();
    },

    //update (dt) {},

    arrowMoveStart: function () {
        //箭矢向右发射
        if (this.node.parent.scaleX == 1) {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.arrowSpeed, this.node.getComponent(cc.RigidBody).linearVelocity.y);
        }
        //箭矢向左发射
        if (this.node.parent.scaleX == -1) {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.arrowSpeed, this.node.getComponent(cc.RigidBody).linearVelocity.y);
        }
    },

    //碰撞检测
    onCollisionEnter: function (other, self) {
        if (other.node.name == "LeftCollider" || other.node.name == "RightCollider") {
            other.node.parent.getComponent(other.node.parent.name).HPSub(self.node.parent.getComponent("Monster2").attackHP);
            this.m2Attack.despawnArrow(self.node);
        }

        if (other.node.name == "King") {
            other.node.getComponent("King").kingHPSub(self.node.parent.getComponent("Monster2").attackHP);
            this.m2Attack.despawnArrow(self.node);
        }
        
        
    },

});
