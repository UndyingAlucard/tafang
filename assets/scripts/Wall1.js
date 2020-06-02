//Wall.js

cc.Class({
    extends: cc.Component,

    properties: {
        HP: 0,
        //w1AttackHP: 0,
        //w1AttackSize: 0,
        //w1AttackSpeed: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //触摸监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        //获取动画组件
        this.anim = this.getComponent(cc.Animation);
        this.wall1BeAttackedAnim = null;
        this.HPNow = this.HP;
        this.HPMax = this.HP;

    },

    start () {
        //初始化被攻击动画(后续找到素材加上)

    },

    update: function (dt) {
        //血量监听
        if (this.HPNow > 0) {
            this.node.getChildByName("HPProgressBar").getComponent(cc.ProgressBar).progress = this.HPNow / this.HPMax;
        } else if (this.HPNow == 0) {
            this.node.getChildByName("HPProgressBar").getComponent(cc.ProgressBar).progress = this.HPNow / this.HPMax;
            //将该对象返回对象池
            this.game.despawnWall(this.node);
        } else {
            console.log("Wall1血量不能为负数");
            return;
        }
    },

    //获取现在的血量
    HPShow: function () {
        return this.HPNow;
    },

    //受到攻击扣血
    HPSub: function (HPSubX) {
        if (this.HPNow > 0 && this.HPNow >= HPSubX) {
            this.HPNow -= HPSubX;
            //console.log("w1HP: " + this.HPNow);
        } else {
            this.HPNow = 0;
        }
    },

    //治疗（修理）加血
    HPAdd: function (HPAddX) {
        this.HPNow += HPAddX;
    },

    onTouchStart: function () {
        this.nodePos = this.node.getPosition();
        //去除刚体影响
        this.node.getComponent(cc.RigidBody).active = false;
    },

    onTouchMove: function (event) {
        var self = this;
        var touches = event.getTouches();
        //触摸刚开始的位置
        var oldPos = self.node.parent.convertToNodeSpaceAR(touches[0].getStartLocation());
        //触摸时不断变更的位置
        var newPos = self.node.parent.convertToNodeSpaceAR(touches[0].getLocation());

        var subPos = oldPos.sub(newPos); // 2.X版本是 p1.sub(p2);

        self.node.x = self.nodePos.x - subPos.x;
        self.node.y = self.nodePos.y - subPos.y;

        // 控制节点移不出屏幕; 
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
        var nPosy = (parseInt(this.node.y / 50) * 50) + 10;
        this.node.x = nPosx;
        this.node.y = nPosy;
        this.nodePos = this.node.getPosition(); //获取触摸结束之后的node坐标；
        this.node.getComponent(cc.RigidBody).active = true;
    },

    onTouchCancel: function () {
        var nPosx = parseInt(this.node.x / 50) * 50;
        var nPosy = (parseInt(this.node.y / 50) * 50) + 10;
        this.node.x = nPosx;
        this.node.y = nPosy;
        this.nodePos = this.node.getPosition(); //获取触摸结束之后的node坐标；
        this.node.getComponent(cc.RigidBody).active = true;
    },

    //wall压死小怪，掉血计算
    monsterUnderWall1: function (mHP) {
        var mHPSubx = mHP * 0.2;
        this.HPSub(mHPSubx);
    },

    //碰撞检测函数，碰撞产生时
    onCollisionEnter: function (other, self) {
        var mHPNow = 0;
        //与怪物碰撞
        switch (other.node.name) {
            case "Monster1":
                mHPNow = other.node.getComponent("Monster1").HPNow;
                self.node.getComponent("Wall1").monsterUnderWall1(mHPNow);
                break;

            case "Monster2":
                mHPNow = other.node.getComponent("Monster2").HPNow;
                self.node.getComponent("Wall1").monsterUnderWall1(mHPNow);
                break;

            default: break;
        }
        //与远程怪物的子弹碰撞(未完)

    },

    //碰撞状态中
    onCollisionStay: function (other, self) {

    },

    //碰撞结束后
    onCollisionExit: function (other, self) {
        
    },
});
