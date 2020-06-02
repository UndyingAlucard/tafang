//king.js

cc.Class({
    extends: cc.Component,

    properties: {
        kingHP: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);
        this.kingHPMax = this.kingHP;
        this.kingHPNow = this.kingHP;
        this.animKingBeAttacked; //被攻击时的动画效果
        this.animKingStand; //平常状态下的动画效果
    },

    start: function () {
        var self = this;

        //初始化King平常状态下的动画
        var kingStandAnimUrl = "clip/king/KingStand";
        cc.loader.loadRes(kingStandAnimUrl, cc.AnimationClip, function(err, anim) {
            if (err) {
                console.log("kingStandAnimUrl: error");
                return;
            }
            self.node.getComponent(cc.Animation).addClip(anim);
            self.animKingStand = self.anim.getAnimationState("KingStand");
            self.animKingStand.repeatCount = Infinity;
            //self.animKingStand.play();
        });

        //初始化King被攻击时的动画
        var kingBeAttackedAnimUrl = "clip/king/KingBeAttack";
        cc.loader.loadRes(kingBeAttackedAnimUrl, cc.AnimationClip, function(err, anim) {
            if (err) {
                console.log("kingBeAttackedAnimUrl: error");
                return;
            }
            self.node.getComponent(cc.Animation).addClip(anim);
            self.animKingBeAttacked = self.anim.getAnimationState("KingBeAttack");
        });
    },

    update: function (dt) {
        if (this.kingHPNow > 0) {
            this.node.getChildByName("HPprogressBar").getComponent(cc.ProgressBar).progress = this.kingHPNow / this.kingHPMax;
        } else if (this.kingHPNow == 0) {
            this.node.getChildByName("HPprogressBar").getComponent(cc.ProgressBar).progress = this.kingHPNow / this.kingHPMax;
            console.log("game over");
            //预留gameover接口

        } else {
            console.log("血量不能为负数");
        }
    },

    kingHPShow: function () {
        return this.kingHPNow;
    },

    kingHPAdd: function (HPAddX) {
        this.kingHPNow += HPAddX;
    },

    kingHPSub: function (HPSubX) {
        if (this.kingHPNow >= HPSubX) {
            this.kingHPNow -= HPSubX;
            //console.log("kingHPNow: " + this.kingHPNow);
        } else {
            this.kingHPNow = 0;
        }
        
    },

    //King被远程怪攻击，传入怪物的攻击力参数
    kingBeAttackedByBullet: function (monsterAttackHP) {
        //播放被攻击时的动画
        this.animKingBeAttacked.play();
        this.animKingBeAttacked.stop();
        //掉血
        this.kingHPSub(monsterAttackHP);
    },

    //king被近程怪攻击，传入攻击速度（攻击间隔）和攻击力
    kingBeAttackedByMon: function (monsterAttackSpeed, monsterAttackHP) {
        this.kingHPSub(monsterAttackHP);
        this.animKingBeAttacked.play();
        this.animKingBeAttacked.stop();
        this.schedule(function () {
            this.animKingBeAttacked.play();
            this.animKingBeAttacked.stop();
            this.kingHPSub(monsterAttackHP);
        }, monsterAttackSpeed);
    },

    //碰撞产生时，一般对于远程怪发射的子弹而言
    onCollideronEnter: function (other, self) {
        var monsterAttackHP = 0;
        //判断攻击的是远程怪，目前只设计了Monster2是远程，后续可添加（后续添加的近程怪太多，可考虑用switch语句）
        if (other.node.name == "M2Bullet") {
            monsterAttackHP = other.node.getComponent("M2Bullet").game.m2AttackHP; //在M2Bullet.js中调用Monster2的引用实例（未完成）
            self.node.getComponent("King").kingBeAttackedByBullet(monsterAttackHP);
        }
    },

    //碰撞状态中，对于近程怪来说，目前只有Monster1为近程怪（后续可加其他近程怪）
    onCollideronStay: function () {
        var monsterAttackSpeed = 0;
        var monsterAttackHP = 0;

        if (other.node.name == "Monster1") {
            monsterAttackSpeed = other.node.getComponent("Monster1").m1AttackSpeed;
            monsterAttackHP = other.node.getComponent("Monster1").m1AttackHP;
            this.kingBeAttackedByMon(monsterAttackSpeed, monsterAttackHP);
        }
    },

    //碰撞结束后，似乎不需要做什么（对于King来说）
    onCollideronExit: function () {
        
    },
});
