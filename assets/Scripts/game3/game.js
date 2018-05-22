var Shape = require("Shape");
cc.Class({
    extends: cc.Component,

    properties: {
        prefabArr : {
            default : [],
            type    : [cc.Prefab],
        },
        prefabHeight : 20,
        backPrefab  : {
            default : null,
            type    : cc.Prefab,
        },
        //下一个形状显示区域节点
        nextShape   : {
            default : null,
            type    : cc.Node,
        },
        rivalInfoNode : {
            default : null,
            type    : cc.Node,
        }

    },
    // use this for initialization
    onLoad: function () {
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
        cc.log("this.nodeWidth is " + this.nodeWidth + "this.nodeHeight is " + this.nodeHeight);
        //背景二位数组
        this.backGround = null;
        //形状集合二维数组,将每次生成的形状添加到二维数组里面
        this.shapeArr = [];
        //预制体的下落速度
        this.speed = 100;
        //这个预制体是否可以改变状态比如旋转，移动
        this.IsChange = true;
        //保存临时的形状
        this.shapeNode = new Shape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
        //存放每次生成的预制体数组
        this.nodeArr =this.createShape(this.shapeNode);
        //将x的所有可能坐标存到一个数组里面
        this.locationSet = null;
        cc.log("this.nodeArr is " + this.nodeArr);
        this.createBack();
        //创建下一个旋转体
        this.nextShape = new Shape(this.nextShape,0,0);
        this.downFunction();
    },
    //产生x坐标为[-250,-150,-50,50,150,250]
    createRandomX : function(randomNumber){
        var XArray = [];
        for(var i = 0;i < 6;i++){
            XArray.push((-this.nodeWidth/2 + this.prefabHeight) + i * 100);
        }
        return XArray[randomNumber];
    },
    //产生随机数
    createRandom : function(min,max){
         return Math.floor(Math.random()*(max - min) + min);
    },
    //将四个可能的点位加入到相对应的数组中去
    addPointXOrY : function(locationSet,nodeArr){
       
    },
    //检查是否触底
    setGridFilled : function(){
        for(var i = 0;i < 12;i++){
            //列检查
            for(var j = 0;j < 6;j++){
                for(var k = 0;k < this.nodeArr.length;k++){
                    //如果当前网格的坐标等于节点数组中的坐标就把当前节点预制体的状态改为true
                    if((this.backGrid[i][j].x === this.nodeArr[k].x) && (this.backGrid[i][j].y === this.nodeArr[k].y)){
                           //将网格的填充状态重置为true
                           this.backGrid[i][j].getComponent("Back").isFilled = 1;
                        //    //返回不可下落状态
                        //    return false;
                    }
                }
            }
        }
        // //返回可下落状态 
        // return true;
    },
    //初始化游戏场景主背景20行10列的网格
    createBack : function(){
        //初始化y坐标
        var y = this.nodeHeight/2 - this.prefabHeight;
        //初始化x坐标
        var x = -this.nodeWidth/2 + this.prefabHeight;
        cc.log("x is " + x);
        this.backGroundArr = [];
        //12行6列的网格
        for(var i = 0;i < 12; i++){
            //设置它的y坐标
            var tempY =y - i * this.prefabHeight*2;
            cc.log("tempY is " + tempY);
            this.backGroundArr[i] = [];
            for(var j = 0; j < 6;j++){
                var outArr = this.backGroundArr[i];
                var tempX = x + j * this.prefabHeight*2;
                cc.log("tempX is " + tempX);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(this.backPrefab,tempX,tempY,this.node);
                tempPrefab.isFilled = 0;
                outArr[j]=tempPrefab;
                // outArr[j] = 
            }
        }
        cc.log("backGroundArr is " +this.backGroundArr);
    },
    /**
    @param prefab:将要生成预制节点的预制体
    @param x     :将要生成预制节点的x坐标
    @param y     :将要生成预制节点的y坐标
    @param parentNode : 生成的预制节点的父节点
     */
    setPrefabPosition : function(prefab,x,y,parentNode){
           var prefab = this.createPrefab(prefab);
           prefab.setPosition(x,y);
           parentNode.addChild(prefab);
           return prefab;
    },
    createPrefab : function(prefab){
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
    //生成形状
    createShape : function(shape){
        //用来存放预制体的数组
        var prefabArrTemp = [];
        for(var i = 0;i < 3;i++){
            var offSet = i * this.prefabHeight * 2;
            cc.log("offSet is " + offSet);
            //产生0-3的随机数
            var index = Math.floor(Math.random()*3);
            cc.log("index is " + index);
            //将对应的预制体取出来转化为节点然后显示
            var prefabNode = this.createPrefab(this.prefabArr[index]);
            cc.log("x is " + shape.x + " and y is "+ shape.y - offSet);
            //设置预制节点的位置
            prefabNode.setPosition(shape.x,shape.y - offSet);
            //将该预制节点添加为parentNode的孩子
            shape.parentNode.addChild(prefabNode);
            //将当前预制体节点存放到预制体临时数组里面
            prefabArrTemp.push(prefabNode);
        }
        console.log(prefabArrTemp);
        //将当前生成的预制体拼成的形状加到形状数组中去
        this.shapeArr.push(prefabArrTemp);
        cc.log("shapeArr is " + this.shapeArr);
        //显示下一个预制体拼成的图形
        // this.generateNext(this.nextShape,0,0);
        return prefabArrTemp;
    },
    // called every frame
    update: function (dt) {
        //如果当前状态是处于可以改变状态
        // if(this.shapeNode.allowRotate){
        //     this.updatePrefatY(dt);
        // }
        
    },
    //定时器控制下落
    downFunction : function(){
        //一秒下落一次
        this.schedule(function(){
            this.updatePrefatY();
        },1);
    },
    checkAroundStatu : function(){
        for(var i = 0;i < 12;i++){
            //列检查
            for(var j = 0;j < 6;j++){
                // for(var k = 0;k < this.nodeArr.length;k++){
                //     //如果当前网格的坐标等于节点数组中的坐标就把当前节点预制体的状态改为true
                //     // if((this.backGrid[i + 1][j].x === this.nodeArr[k].x) && (this.backGrid[i + 1][j].y === this.nodeArr[k].y)){
                //     //        //返回不可下落状态
                //     //        return false;
                //     // }
                //     if(this.backGrid[i + 1][j].getComponent("Back").isFilled === true){
                //         //为不可下落状态
                //         return false;
                //     }
                // }
                //如果x坐标一样只比较最下面的y坐标
                if((this.nodeArr[0].x === this.nodeArr[1].x)&&(this.nodeArr[2].x === this.nodeArr[1].x)){
                    if(this.backGrid[i + 1][j].getComponent("Back").isFilled === 0){
                        return false;
                    }
                }
            }
        }
        //可以下落
        return true;
    },
    //跟新预制体节点的y坐标
    updatePrefatY : function(dt){
        cc.log("#####################");
        for(var i = 0; i < this.nodeArr.length;i++){
            //每下一个判断网格是否占用

            //如果返回true表示可以下落
            this.nodeArr[i].y -= this.speed;
            cc.log("!!!!!!!!---->>" + this.nodeArr[i].y);
            //查看第三个方格是否着地或者超出边界
            console.log(-this.nodeHeight/2 + this.prefabHeight);
            cc.log(-this.nodeHeight/2 + this.prefabHeight);
            //如果到达游戏视图的底部的话新生成一个形状视图
            if((this.nodeArr[i].y <= -this.nodeHeight/2 + this.prefabHeight)){
                cc.log("this.nodeArr is " + this.nodeArr[i].y);
                //这个预制体已经触底了将这个预制体修改为不可改变状态
                //修改可改变状态为false
                this.shapeNode.allowRotate = false;
                //如果触底就显示或者生成下一个,将nodeArr重置,新建一个形状
                this.shapeNode = new Shape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
                this.nodeArr = this.createShape(this.shapeNode);
                //将网格中被填充的标记为true
                this.setGridFilled();
            }
        }
    },
    //旋转方法
    rotate       : function(){
        //判断周围的网格状态是否为true
        //保留之前的坐标节点作为旋转的基础
        cc.log("中心点的坐标为：" + this.nodeArr[1].x + "," + this.nodeArr[1].y);
        //第一个预制体节点的x,y坐标
        var changeBeforeX = this.nodeArr[0].x;
        var changeBeforeY = this.nodeArr[0].y;
        //第二个预制体节点的x,y坐标
        var changeBeforeX2 = this.nodeArr[2].x;
        var changeBeforeY2 = this.nodeArr[2].y;
        //遍历预制节点数组使它的x,y坐标都进行旋转，将第一个预制节点进行旋转
        this.nodeArr[0].x = this.nodeArr[1].y - this.nodeArr[0].y + this.nodeArr[1].x;
        cc.log("旋转后的x坐标是："+ this.nodeArr[0].x);
        this.nodeArr[0].y = changeBeforeX - this.nodeArr[1].x + this.nodeArr[1].y;
        cc.log("旋转后的y坐标是："+this.nodeArr[0].y);
        //将第二个预制节点进行旋转
        this.nodeArr[2].x = this.nodeArr[1].y - this.nodeArr[2].y + this.nodeArr[1].x;
        this.nodeArr[2].y = changeBeforeX2 - this.nodeArr[1].x + this.nodeArr[1].y;
    },
    afterRotate : function(n,nChangeBoforeX){
            //遍历预制节点数组使它的x,y坐标都进行旋转，将第一个预制节点进行旋转
            this.nodeArr[i].x = this.nodeArr[1].y - this.nodeArr[i].y + this.nodeArr[1].x;
            cc.log("旋转后的x坐标是："+ this.nodeArr[0].x);
            this.nodeArr[i].y = nChangeBoforeX - this.nodeArr[1].x + this.nodeArr[1].y;
            cc.log("旋转后的y坐标是:" + this.nodeArr[0]);
    },
    //左移方法
    moveLeft    : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            this.nodeArr[i].x -= this.speed;
            if((this.nodeArr[i].x <= -this.nodeWidth/2 + this.prefabHeight)){
                this.nodeArr[i].x = -this.nodeWidth/2 + this.prefabHeight;
            }
        }
    },
    moveRight   : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            this.nodeArr[i].x += this.speed;
            if((this.nodeArr[i].x >= this.nodeWidth/2 - this.prefabHeight)){
                this.nodeArr[i].x = this.nodeWidth/2 - this.prefabHeight;
            }
        }
    },
    //生成下一个形状
    generateNext : function(parentNode,x,y){
        return this.createShape(parentNode,x,y);

    },
    // @brief 消行个数
    rowsEliminated :function(backGrid, shape) {
        var rownum = backGrid.length;
        var colnum = backGrid[0].length;

        var tx = shape.x;
        var ty = shape.y;
        var shapeArr = shape.shapeArr;

        var eliminatedNum = 0;
        var eliminatedGridNum = 0;
        for ( var i = 0; i < rownum; i++) {
            var flag = true;
            for ( var j = 0; j < colnum; j++) {
                if ( backGrid[i][j] === false ) {
                    flag = false;
                    break;
                }
            }
            if ( flag === true ) {
                eliminatedNum++;
                if ( i >= ty && i < ty + 4 ) {
                    for ( var s = 0; s < 4; s++ ) {
                        if ( shapeArr[i - ty][s] === 1 ) {
                            eliminatedGridNum++;
                        }
                    }
                }
            }
        }
        return eliminatedNum * eliminatedGridNum;
    },
    //创建游戏场景主背景20行10列
    // createBackOfGame : function(){
    //     for(var i = 0;i < 20;i++){
    //         for(var j = 0;j < 10;j++){
    //             var backPrefabNode = this.createPrefab(this.backPrefab);
    //             backPrefabNode.setPosition();
    //             this.node.addChild(backPrefabNode);
    //         }
    //     }
    // }
});
