//Monster2.js  

//远程怪
cc.Class({
    extends: cc.Component,

    properties: {
        HP: 0,
        moveSpeed: 0,
        attackHP: 0,
        attackSpeed: 0,
        attackSize: 0,
        isFlyMonster: false
    },

    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);
        this.moveAnim;   //移动动画
        this.attackAnim; //攻击动画
        this.HPMax = this.HP;
        this.HPNow = this.HP;
        this.isFly = false;
        this.attackTime = this.attackSpeed / 2;
    },

    start () {
        var self = this;
        
        //初始化Monster2移动动画
        var m2MoveAnimUrl = "clip/monsters/monster2/monster2Move";
        cc.loader.loadRes(m2MoveAnimUrl, cc.AnimationClip, function (err, anim) {
            if (err) {
                console.log("m2MoveAnimUrl: error");
                return;
            }
            self.node.getComponent(cc.Animation).addClip(anim);
            self.moveAnim = self.anim.getAnimationState("monster2Move");
            self.moveAnim.repeatCount = Infinity;

            self.moveStart(); //开始移动
        });
        //初始化Monster2攻击动画
        var m2AttackAnimUrl = "clip/monsters/monster2/monster2Attack";
        cc.loader.loadRes(m2AttackAnimUrl, cc.AnimationClip, function (err, anim) {
            if (err) {
                console.log("m2AttackAnimUrl: error");
                return;
            }
            self.node.getComponent(cc.Animation).addClip(anim);
            self.attackAnim = self.anim.getAnimationState("monster2Attack");
            //self.attackAnim.repeatCount = Infinity;
        });
    },

    update: function (dt) {
        //血量监听
        if (this.HPNow > 0) {
            this.node.getChildByName("m2HPProgressBar").getComponent(cc.ProgressBar).progress = this.HPNow / this.HPMax;
        } else if (this.HPNow == 0) {
            this.node.getChildByName("m2HPProgressBar").getComponent(cc.ProgressBar).progress = this.HPNow / this.HPMax;
            //停止动画
            this.moveAnim.stop();
            this.attackAnim.stop();
            //将节点放回对象池
            this.game.despawnMonster2(this.node);  //引用Monsters.js组件的方法
        } else {
            console.log("Monster2血量不能为负数");
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
            self.node.getComponent("Monster2").HPNow = 0;
        }
        
    },

});
