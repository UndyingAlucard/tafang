//monster1.js

cc.Class({
    extends: cc.Component,

    properties: {
        HP: 0,      //怪物血量
        moveSpeed: 0,   //怪物移动速度
        attackHP: 0,    //怪物的攻击力
        attackSpeed: 0,  //怪物的攻击速度（攻击间隔）
        attackSize: 0,   //怪物的攻击范围
        isFlyMonster: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);
        this.moveAnim;   //移动动画
        this.attackAnim; //攻击动画
        this.HPMax = this.HP;
        this.HPNow = this.HP;
        this.isFly = false;
        this.attackTime = this.attackSpeed / 2;
    },

    start: function () {
        var self = this;
        //初始化Monster1移动动画
        var m1MoveAnimUrl = "clip/monsters/monster1/monster1Move";
        cc.loader.loadRes(m1MoveAnimUrl, cc.AnimationClip, function (err, anim) {
            if (err) {
                console.log("m1MoveAnimUrl: error");
                return;
            }
            self.node.getComponent(cc.Animation).addClip(anim);
            self.moveAnim = self.anim.getAnimationState("monster1Move");
            self.moveAnim.repeatCount = Infinity;

            self.moveStart(); //开始移动
        });
        //初始化Monster1攻击动画
        var m1AttackAnimUrl = "clip/monsters/monster1/monster1Attack";
        cc.loader.loadRes(m1AttackAnimUrl, cc.AnimationClip, function (err, anim) {
            if (err) {
                console.log("m1AttackAnimUrl: error");
                return;
            }
            self.node.getComponent(cc.Animation).addClip(anim);
            self.attackAnim = self.anim.getAnimationState("monster1Attack");
            self.attackAnim.repeatCount = Infinity;
        });
        
    },

    update: function (dt) {
        //血量监听
        if (this.HPNow > 0) {
            this.node.getChildByName("m1HPProgressBar").getComponent(cc.ProgressBar).progress = this.HPNow / this.HPMax;
        } else if (this.HPNow == 0) {
            this.node.getChildByName("m1HPProgressBar").getComponent(cc.ProgressBar).progress = this.HPNow / this.HPMax;
            //停止动画
            this.moveAnim.stop();
            this.attackAnim.stop();
            //将节点放回对象池
            this.game.despawnMonster1(this.node);  //引用Monsters.js组件的方法
        } else {
            console.log("Monster1血量不能为负数");
            return;
        }
    },

    
    //显示血量
    HPShow: function () {
        return this.HPNow;
    },

    //受到攻击扣血
    HPSub: function (HPSubX) {
        if (this.HPNow > 0 && this.HPNow >= HPSubX) {
            this.HPNow -= HPSubX;
        } else {
            this.HPNow = 0;
        }
        
    },

    //开始移动
    moveStart: function () {
        //向右移动
        if (this.node.position.x < 0) {
            //设置速度的移动方式
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.moveSpeed, this.node.getComponent(cc.RigidBody).linearVelocity.y);
            this.moveAnim.play();
        }
        //向左移动
        if (this.node.position.x > 0) {
            //设置速度的移动方式
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.moveSpeed, this.node.getComponent(cc.RigidBody).linearVelocity.y);
            this.moveAnim.play();
        }
    },

    //停止移动
    moveStop: function () {
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.moveAnim.stop();
    },

    //碰撞检测，碰撞产生时
    onCollisionEnter: function (other, self) {
        if (other.node.name == "Wall1" || other.node.name == "Wall2") {
            //被墙压死
            self.node.getComponent("Monster1").HPNow = 0;
        }
        
    },

    //碰撞检测，碰撞结束后
    onCollisionExit: function (other, self) {
       
    },
});
