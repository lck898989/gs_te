var Shape = require("Shape");
cc.Class({
    extends: cc.Component,

    properties: {
        //预制体数组
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
        },
        //下落按钮
        downButton  : {
            default : null,
            type    : cc.Node,
        }

    },
    // use this for initialization
    onLoad: function () {
        //消除之后待下落数组的集合
        this.afterMoveNodeArr = [];
        this.myyy=0;
        this.myy = ['3'];
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
        this.timeDao = 0;
        cc.log("this.nodeWidth is " + this.nodeWidth + "this.nodeHeight is " + this.nodeHeight);
        //定义消除次数
        this.eliminateCount = 0;
        //定义得分
        this.score = 0;
        //存放方格的颜色数组
        this.boxColorArr = [];
        //背景二位数组
        this.backGroundArr = null;
        //形状集合二维数组,将每次生成的形状添加到二维数组里面
        // this.shapeArr = [];
        //预制体的下落速度
        this.speed = 100;
        //这个预制体是否可以改变状态比如旋转，移动
        this.IsChange = true;
        this.createBack();
        //保存临时的形状
        // this.shapeNode = new Shape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
        //存放每次生成的预制体数组即是活动的条
        this.nodeArr =this.createShape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
        this.downFunction(this.nodeArr,1);
        //将x的所有可能坐标存到一个数组里面
        this.locationSet = null;
        cc.log("this.nodeArr is " + this.nodeArr);
        
        //创建下一个旋转体
        // this.nextShape = new Shape(this.nextShape,0,0);
        
        //当前条是否还可以改变状态
        this.canChangeStatu = true;
        Array.prototype.contain = function(shape){
            if(shape != undefined){
                for(var i = 0;i<this.length;i++){
                    if(shape instanceof Shape){
                        //如果颜色坐标都一样就返回true
                        if(this[i].x === shape.x && this[i].y === shape.y && this[i].prefabNode.color.toHEX() === shape.prefabNode.color.toHEX()){
                            return true;
                        }
                    }else if(shape instanceof cc.Node){
                        if(this[i].x === shape.x && this[i].y === shape.y && this[i].prefabNode.color.toHEX() === shape.color.toHEX()){
                            return true;
                        }
                    }
                    
                }
            }
            return false;
        }
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
    //查看当前的棍处于哪一列
    getColumn : function(node){
            //竖行的条
            var indexGrid = this.chooseColumnByLocation(node.x);
            //放回列号
            return indexGrid;
    },
    //根据坐标选择位于哪个列
    chooseColumnByLocation : function(x){
        switch(x){
            case -250:
                return 0;
            case -150:
                return 1;
            case -50 : 
                return 2;
            case 50  : 
                return 3;
            case 150 :
                return 4;
            case 250 :
                return 5;                 
        }
    },
    //根据坐标获得位于哪一行
    getRow : function(node){
        var yIndexResult;
        yIndexResult = this.chooseRawByLocation(node.y);
        return yIndexResult;
    },
    /***
        根据y坐标数值得到对应的行
        返回对应的行数
        @param : y 传入方法中的y坐标
        @return 返回坐标对应的行号
    * */
    chooseRawByLocation : function(y){
        switch(y){
            case -550:
                return 11;
            case -450:
                return 10;
            case -350 : 
                return 9;
            case -250  : 
                return 8;
            case -150 :
                return 7;
            case -50 :
                return 6;
            case   50:
                return 5;
            case  150:
                return 4;
            case 250 : 
                return 3;
            case 350  : 
                return 2;
            case 450 :
                return 1;
            case 550 :
                return 0;    
        }
    },
    //初始化游戏场景主背景12行6列的网格
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
                var shape = new Shape(tempPrefab,-1);
                tempPrefab.isFilled = 0;
                var shape = new Shape(tempPrefab,-1);
                outArr[j]=shape;

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
    createShape : function(parentNode,x,y){
        cc.log("322222222222222" + (this.node.childrenCount-72));
        //创建类型数组
        this.type0Arr = [];
        this.type1Arr = [];
        this.type2Arr = [];
        //动态生成一个新的节点将生成的预制体节点加入到该父节点上
        // var newNode = new cc.Node();
        // parentNode.addChild(newNode);
        //用来存放预制体的数组
        var prefabArrTemp = [];
        //盛放颜色代码的数组每次重新生成预制体节点的时候将之前的颜色代码数组置空
        this.boxColorArr = [];
        for(var i = 0;i < 3;i++){
            var offSet = i * this.prefabHeight * 2;
            cc.log("offSet is " + offSet);
            //产生0-3的随机数
            var index = Math.floor(Math.random()*3);
            //将对应的颜色索引存放到该数组中
            this.boxColorArr.push(this.prefabArr[index].color);
            cc.log("index is " + index);
            //将对应的预制体取出来转化为节点然后显示
            var prefabNode = this.createPrefab(this.prefabArr[index]);
            cc.log("x is " + x + " and y is "+ y - offSet);
            //设置预制节点的位置
            prefabNode.setPosition(x,y - offSet);
            //将该预制节点添加为parentNode的孩子
            parentNode.addChild(prefabNode);
            var shape = new Shape(prefabNode,index);
            cc.log("shape's type is " + index);
            //将当前预制体节点存放到预制体临时数组里面
            prefabArrTemp.push(shape);
        }
        console.log(prefabArrTemp);
        //将当前生成的预制体拼成的形状加到形状数组中去
        // this.shapeArr.push(prefabArrTemp);
        // cc.log("shapeArr is " + this.shapeArr);
        // cc.log("shapeArr's length is " + this.shapeArr.length);
        //显示下一个预制体拼成的图形
        // this.generateNext(this.nextShape,0,0);
        this.getColorCount();
        return prefabArrTemp;
    },
    // called every frame
    update: function (dt) {
        // this.timeDao += dt;
        // if(this.timeDao >= 1){
        //     this.timeDao = 0;
        //     this.updatePrefatY(this.nodeArr);
        // }
        //如果当前状态是处于可以改变状态
        // if(this.shapeNode.allowRotate){
        //     this.updatePrefatY(dt);
        // }
        // cc.log("当前行是："+ this.getRow() + " 当前列是：" + this.getColumn());
    },
    //定时器控制下落
    downFunction : function(nodeArr,time){
        var self = this;
        // var promise = new Promise(function(resolve){
        //      //一秒下落一次
        //     self.schedule(function(){
                
        //     }.bind(self),time);
        // });
        // promise.then(function(){
        //     cc.log("222222222222222222222222");
        //     self.updatePrefatY(nodeArr);
        // });
        self.schedule(function(dt){
            cc.log("dt is " + dt);
            self.updatePrefatY(nodeArr);
        }.bind(self),time);
    },
    //计时器回调函数
    // callBack     : function(){
    //     this.updatePrefatY();
    // },
    //更新预制体节点的y坐标
    updatePrefatY : function(nodeArr){
        if(nodeArr.length != 0){
            cc.log("-------->>>>>>>" + nodeArr[0].prefabNode.y);
            //如果允许下落的话条的y坐标向下移动
            if(this.CheckIsDown(nodeArr)){
                //判断方格是否可以消除
                //位移3个方格
                for(var i = 0;i < 3;i++){
                    nodeArr[i].prefabNode.y -= this.speed;
                    nodeArr[i].y = nodeArr[i].prefabNode.y;
                }
            }else{
                //如果不能下落的话改变背景方格状态(背景方格更新完成之后进行再次生成节点数组)
                this.changeBackBlockStatus(nodeArr);
                //固定完之后重新生成随机预制体节点
                this.nodeArr = this.generateNext(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
                //开启计时器
                this.downFunction(this.nodeArr,1);
                //如果是不能下落的话就是前一个条形已经固定下来了，固定下来之前已经生成了下一个的形状
                // for(var j = 0;j<3;j++){
                //     nodeArr[j].prefabNode.y -= this.speed;
                // }
                
            }
        }
    },
    //判断下落方块中的颜色个数
    getColorCount : function(){
        var difColorCount = 0;
        for(var i = 0;i<3;i++){
            if(i != 2){
                if(this.boxColorArr[i] != this.boxColorArr[i+1]){
                    difColorCount++;
                }
            }else{
                if(this.boxColorArr[2] != this.boxColorArr[0]){
                    difColorCount++;
                }
            }
        }
        cc.log("*******************" + difColorCount);
        return difColorCount;
    },
    /*创建一个二维数组的方法
     *@param rows : 二维数组的行数
      @param cols : 二维数组的列数
     *@param initial : 二维数组的初始值
    */
    createMatrix : function(rows,cols,initial){
        var arr = [];
        for(var i = 0;i < rows;i++){
            var columns = [];
            for(var j = 0;j<cols;j++){
                columns[j] = initial;
            }
            arr[i] = columns;
        }
        return arr;
    },
    /**
        1：旋转的时候判断旋转的坐标对应的背景方格的状态是否为1
        2：当竖条出现在最左边的时候改变旋转中心为最上面的预制体节点
        3：当竖条出现在最右边的时候改变旋转中心为最下面的预制节点
    **/
    rotate       : function(){
        //判断周围的网格状态是否为true
        /**
         * 
         * 旋转之后方块的颜色变换，第一个变成第二个，第二个变成第三个，第三个变成第一个
         * 
         * ** */
        cc.log(this.boxColorArr);
        var before0 = this.nodeArr[0].prefabNode.color;
        var before0Name = this.nodeArr[0].prefabNode.name;
        var before0Type = this.nodeArr[0].type;
        cc.log("before0 is " + before0);
        var before1 = this.nodeArr[1].prefabNode.color;
        var before1Name = this.nodeArr[1].prefabNode.name;
        var before1Type = this.nodeArr[1].type;
        cc.log("before1 is " + before1);
        var before2 = this.nodeArr[2].prefabNode.color;
        var before2Name = this.nodeArr[2].prefabNode.name;
        var before2Type = this.nodeArr[2].type;
        cc.log("before2 is " + before2);
        //分别改变颜色
        this.nodeArr[0].prefabNode.color = before2;
        this.nodeArr[0].prefabNode.name = before2Name;
        this.nodeArr[0].type = before2Type;
        this.nodeArr[1].prefabNode.color = before0;
        this.nodeArr[1].prefabNode.name = before0Name;
        this.nodeArr[1].type = before0Type;
        this.nodeArr[2].prefabNode.color = before1;
        this.nodeArr[2].prefabNode.name = before1Name;
        this.nodeArr[2].type = before1Type;
    },
    //左移方法
    moveLeft    : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            if(this.CheckIsLeft() && this.canChangeStatu){
                this.nodeArr[i].prefabNode.x -= this.speed;
                this.nodeArr[i].x = this.nodeArr[i].prefabNode.x;
                if((this.nodeArr[i].prefabNode.x <= -this.nodeWidth/2 + this.prefabHeight)){
                    this.nodeArr[i].prefabNode.x = -this.nodeWidth/2 + this.prefabHeight;
                }
            }
        }
    },
    //右移方法
    moveRight   : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            if(this.CheckIsRight()){
                this.nodeArr[i].prefabNode.x += this.speed;
                this.nodeArr[i].x = this.nodeArr[i].prefabNode.x;
                if((this.nodeArr[i].prefabNode.x >= this.nodeWidth/2 - this.prefabHeight)){
                    this.nodeArr[i].prefabNode.x = this.nodeWidth/2 - this.prefabHeight;
                }
            }
        }
    },
    /**
        检测是否可以向下移动
        返回true或者false
        @return true  : 可以下落
        @return false : 不可以下落
    **/
    CheckIsDown : function(nodeArr){
        if(nodeArr.length != 0){
            //如果是整个方块下落的时候的方法
            var row = [];
            for(var i = 0;i<nodeArr.length;i++){
                row[i] = this.getRow(nodeArr[i].prefabNode);
            }
            var col = this.getColumn(nodeArr[nodeArr.length - 1].prefabNode);
            //每下降一个格检测一次
            //遍历3格预制体方格看是否可以下落
            //如果是横着的条就检测下面三个背景方格的属性isFilled是不是为1如果为1的话不允许下落
                //判断最大行下面方格的状态是否为1
                cc.log("array of row is " + row);
                var rowN = row[nodeArr.length - 1];
                var colN = col;
                //如果最大的行号是11的话不用再这里判断这样的情况是触底的情况
                if(rowN != 11){
                    if(this.backGroundArr[rowN + 1][colN].prefabNode.isFilled === 1){
                        //将对应的背景方格的状态改为1
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
        }
    },
    //快速下落
    quickDown : function(){
         //停止正常下落的计时器
         this.unscheduleAllCallbacks();
         //开始快速下落的计时器
         this.downFunction(this.nodeArr,0.02);
        //  for(var i = 2;i >= 0;i--){
        //      this.checkDownHasBlock(this.nodeArr[i].prefabNode);
        //  }
    },
    //改变背景方格的状态
    changeBackBlockStatus : function(nodeArr){
        if(nodeArr.length != 0){
            this.willDeleteArr = [];
            //定义访问removeAndDown方法的次数
            this.visitRemoveAndDownFunctionCount = 0;
            this.hasBlockUpNode = false;
            var row = [];
            for(var i = 0;i<nodeArr.length;i++){
                row[i] = this.getRow(nodeArr[i].prefabNode);
            }
            var col = this.getColumn(nodeArr[nodeArr.length - 1].prefabNode);
            for(var n=0;n<row.length;n++){
                //设置对应格的数据为1
                this.backGroundArr[row[n]][col].prefabNode.isFilled = 1;
                //将背景方格的颜色属性改为下落方格的颜色
                // this.backGroundArr[row[n]][col].prefabNode.color = nodeArr[n].prefabNode.color;
                //设置类型值
                this.backGroundArr[row[n]][col].type = nodeArr[n].type;
            }
            //待移动队列
            this.willMoveNodes = [];
            for(var m = 0;m<row.length;m++){
                //依据方块类型取得色块类型数组
                this.colorBlockTypeArr = this.getTypeArrByType(nodeArr[m].type);
                // cc.log(m + "行的colorBlockTypeArr is " + this.colorBlockTypeArr);
                // for(let c = 0;c < this.colorBlockTypeArr.length;c++){
                //     cc.log(this.colorBlockTypeArr[c]);
                // }
                //如果该节点上满足消除条件
                if(this.canRemove(nodeArr[m],this.colorBlockTypeArr)){
                    this.findDiffFromRemoveNode(nodeArr,this.getTypeByColor(this.waitRemoveNodeArr[0].prefabNode.color),this.willMoveNodes);
                    
                    var targetY = this.waitRemoveNodeArr[this.waitRemoveNodeArr.length-1].y;
                    //定义是否可以退出当前循环
                    var canBreak = false;
                    //如果待消除队列是一列的话就等这些行遍历完之后再处理下落色块
                    if(this.isCommonX(this.waitRemoveNodeArr)){
                        for(let b = 0;b<this.waitRemoveNodeArr.length;b++){
                            if(nodeArr[m].x === this.waitRemoveNodeArr[b].prefabNode.x &&
                               nodeArr[m].y === this.waitRemoveNodeArr[b].prefabNode.y &&
                               nodeArr[m].waitRemove === true){
                                   //如果该节点上的待消标记为true的话退出当前循环
                                canBreak = true;    
                            }
                        }
                        if(canBreak = true){
                            break;
                        }
                    }else{
                        cc.log("this.waitRemoveNodeArr is " + this.waitRemoveNodeArr);
                        cc.log(m+"行色块类型相同的数组是：" + this.waitRemoveNodeArr);
                        //关闭所有下落计时器
                        this.unscheduleAllCallbacks();
                        //消除和下落操作
                        this.removeAndDown(this.waitRemoveNodeArr);
                    }
                }
                //不消除
                
                //将颜色类型数组清空，如果该行已经清除成功重置色块类型数组
                this.type0Arr = [];
                this.type1Arr = [];
                this.type2Arr = [];
            }
            if(this.waitRemoveNodeArr != undefined){
                if(this.isCommonX(this.waitRemoveNodeArr)){
                    //如果待消除队列是一列的话执行该代码
                    if(this.willMoveNodes.length != 0){
                        cc.log(this.willMoveNodes);
                        this.willMoveNodes.reverse();
                        this.removeAndDown(this.waitRemoveNodeArr,this.willMoveNodes);
                        // this.changeBackBlockStatus(this.willMoveNodes);
                    }else{
                        for(let j =0;j<this.waitRemoveNodeArr.length;j++){
                            this.directDeletNodeFromGameScene(this.waitRemoveNodeArr[j]);
                        }
                    }
                }
            }
                // if(this.willMoveNodes.length === 0){
                //     //如果是一列三个相同类型的话直接消除
                //     for(let c = 0;c<this.waitRemoveNodeArr.length;c++){
                //         this.removeNodeFromGameScene(this.waitRemoveNodeArr[c].prefabNode);
                //     }
                // }
                //确保行数是依次增大的
                this.willMoveNodes.reverse();
                //查看是否可以重复消除
                // this.changeBackBlockStatus(this.willMoveNodes);
        }
            this.willMoveNodes = [];
            //将颜色类型数组清空
            this.type0Arr = [];
            this.type1Arr = [];
            this.type2Arr = [];
            //将清除过的数组清空
            this.waitRemoveNodeArr = [];
            this.unscheduleAllCallbacks();
            this.willDeleteArr = [];
    },
    //判断如果待消队列在同一列的话判断是否可以退出当前循环
    commonColCanBreak : function(node){
        if(this.isCommonX(this.waitRemoveNodeArr)){
                for(let b = 0;b<this.waitRemoveNodeArr.length;b++){
                    if(node.x === this.waitRemoveNodeArr[b].prefabNode.x &&
                       node.y === this.waitRemoveNodeArr[b].prefabNode.y &&
                       node.waitRemove === true){
                        //如果该节点上的待消标记为true的话退出当前循环
                        return true;   
                    }
                }
            return false;
        }
    },
    findDiffFromRemoveNode : function(nodeArr,moveNodeType,diffArr){
        for(let i = 0;i<nodeArr.length;i++){
            if(nodeArr[i].type != moveNodeType){
                if(!diffArr.contain(nodeArr[i]))
                    diffArr.push(nodeArr[i]);
            }
        }
    },
    canRemove(shape,colorBlockTypeArr){
        for(var count = 0;count < 4;count++){
            colorBlockTypeArr[count] = [];
        }
        //定义一个存放135度和-45度方向需要消除的队列
        var slant0Arr = colorBlockTypeArr[0];
        //定义存放45度和-135度方向需要消除的队列
        var slant1Arr = colorBlockTypeArr[1];
        //定义存放0度和270度方向需要消除的队列
        var slant2Arr = colorBlockTypeArr[2];
        //定义存放90度和180度方向需要消除的队列
        var slant3Arr = colorBlockTypeArr[3];
        var color = shape.prefabNode.color;
        //获得宝石的类型
        var type = this.getTypeByColor(color);
        //获得当前方格节点所在的行
        var row = this.getRow(shape.prefabNode);
        //获得当前节点所在的列
        var col = this.getColumn(shape.prefabNode);
        for(var i = 0;i<4;i++){
            //135度和-45度两个方向寻找
            if(i === 0){
               this.directorFind(slant0Arr,row,col,i,type,shape);
            }else if(i === 1){
             //45度和-135度方向寻找
              this.directorFind(slant1Arr,row,col,i,type,shape);
            }else if(i === 2){
                this.directorFind(slant2Arr,row,col,i,type,shape);
            }else if(i === 3){
                this.directorFind(slant3Arr,row,col,i,type,shape);
            }
        }
        //这时候colorBlockTypeArr里面是有东西的或者没东西遍历该数组
        for(var i = 0;i<4;i++){
            var len = colorBlockTypeArr[i].length;
            if(len < 3){
                continue;
            }else{
                //有三个或者三个以上类型相同的宝石
                //定义一个全局的等待消除的节点数组每次消除完之后将其还原
                this.waitRemoveNodeArr = colorBlockTypeArr[i];
                //证明是可以消除的
                return true;
            }
        }
        return false;
    },
    //消除和下落操作
    removeAndDown : function(waitRemoveNodeArr){
             var x;
            //  var backArr = [];
            //  for(var i = 0;i<waitRemoveNodeArr.length;i++){
            //     var backP = this.backGroundArr[this.getRow(waitRemoveNodeArr[i].prefabNode)][this.getColumn(waitRemoveNodeArr[i].prefabNode)].prefabNode;
            //     backArr.push(backP);
            //  }
             if(arguments.length === 2){
                 //如果参数个数为2的话说明有upNodes
                 for(let m = 0;m<waitRemoveNodeArr.length;m++){
                    x = this.removeNodeFromGameScene(waitRemoveNodeArr[m].prefabNode,arguments[1]);
                }
                //同一列的待消节点上方的待下落节点全都下落完毕检查是否可以连消传入的参数也是一个形状数组
                cc.log("arguments is " + arguments[1]);
                arguments[1].reverse();
                //将之前的this.waitRemoveNodeArr置空
                this.waitRemoveNodeArr = [];
                this.changeBackBlockStatus(arguments[1]);
             }else{
                //删除需要消除的节点,不是同一列的情况下每下落一个待消节点上方的待移动节点检查一遍是否可以重复消除
                for(let m = 0;m<waitRemoveNodeArr.length;m++){
                    //删除一个节点然后接着下落上面的节点
                    x = this.removeNodeFromGameScene(waitRemoveNodeArr[m].prefabNode);
                }
                //将之前的this.waitRemoveNodeArr置空
                this.waitRemoveNodeArr = [];
                for(let i = 0;i<this.afterMoveNodeArr.length;i++){
                    this.changeBackBlockStatus(this.afterMoveNodeArr[i]);
                }
                this.afterMoveNodeArr = [];
             }
            this.type0Arr = [];
            this.type1Arr = [];
            this.type2Arr = [];
    },
    //直接删除从节点树中删除该节点
    directDeletNodeFromGameScene : function(waitRemoveNode){
        for(var child = 72;child < this.node.children.length;child++){
            if(this.node.children[child].x === waitRemoveNode.x && this.node.children[child].y === waitRemoveNode.y){
                 //销毁该节点
                 this.node.children[child].destroy();
                 cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].x);
                 cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].y);
                //  waitRemoveNode.color = cc.Color.WHITE;
                //  waitRemoveNode.opacity = 50;
                 //从节点树的孩子移出该节点防止下次遍历出错
                 //  this.node.children.splice(child,1);
                 var row = this.getRow(waitRemoveNode);
                 var col = this.getColumn(waitRemoveNode);
                 //设置该节点对应的背景方格的属性
                 this.backGroundArr[row][col].prefabNode.isFilled = 0;
                 this.backGroundArr[row][col].type = -1;
                 return true;
            }
        }
        return false;
    },
    //检查待消除的节点数组是否在同一列上
    isCommonX : function(waitRemoveNodeArr,backArr){
        if(arguments.length === 2){
            if(backArr != undefined && backArr.length > 0){
                var commonCount = 0;
                var originX = backArr[0].x;
                for(var i = 1;i<backArr.length;i++){
                    if(backArr[i].x === originX){
                        commonCount++;
                    }
                }
                if(commonCount === backArr.length - 1){
                    return true;
                }else{
                    return false;
                }
            }
        }else{
            if(waitRemoveNodeArr != undefined && waitRemoveNodeArr.length > 0){
                var commonCount = 0;
                var originX = waitRemoveNodeArr[0].prefabNode.x;
                for(var i = 1;i<waitRemoveNodeArr.length;i++){
                    if(waitRemoveNodeArr[i].prefabNode.x === originX){
                        commonCount++;
                    }
                }
                if(commonCount === waitRemoveNodeArr.length - 1){
                    return true;
                }else{
                    return false;
                }
            }
        }
    },
    //获得将要删除的节点上的节点数组
    getWillRemoveUpNode : function(row,col,willDeleteArr){
        var waitMoveNode = [];
        if(arguments.length === 2){
            while(row > 0){
                row--;
                var targetNode = this.findPrefabNodeFromGameScene(row,col);
                if(this.getTypeByColor(targetNode.color) != undefined && !targetNode.isRemove){
                    //将该目标节点添加进数组中去
                    waitMoveNode.push(targetNode);
                }
            }
            return waitMoveNode;
        }else{
            
            // var node = this.findPrefabNodeFromGameScene(row,col);
            // var mx=this.getRow(node);
            // var my=this.getColumn(node);
            // var back = this.backGroundArr[mx][my].prefabNode;
            while(row > 0){
                row--;
                var node = this.findPrefabNodeFromGameScene(row,col); 
                //如果找出来的节点不包含之前需要消除的节点话就加入进来
                cc.log("node is " + node);     
                // var back = this.backGroundArr[mx][my].prefabNode;
                if(node != undefined){
                    //并且这个节点的状态不是待消状态的话就添加到待移动队列
                    if(!node.getComponent("Stone").isRemove){
                        var shape = new Shape(node,this.getTypeByColor(node.color));
                        waitMoveNode.push(shape);
                    }
                }else{
                   break;
                }
                // mx--;
            }
            // this.myy = waitMoveNode;
            return waitMoveNode;
        }
        
    },
     /*根据角度填充各个方向数组
     *@param :removeArr -->待消除队列
     *@param : row ------->当前节点所在的行
     *@param : col ------->当前节点所在的列 
     *@param : direction ------>需要搜索的方向(0表示水平方向的消除，1表示竖直方向，2表示45度方向消除，3表示135度方向消除)
      @param : type   ----->当前需要寻找的宝石的类型
      @param : node   ----->当前需要检查的节点
     */
    directorFind : function(commonColorArr,row,col,direction,type,shape){
        //45度和-135度方向检测
        var leftRow = row;
        var leftCol = col;
        //先把自己push进去(前提是类型相同)
        commonColorArr.push(shape);
        while(leftRow >= 0 || leftRow <= 11 || leftCol >= 0 || leftCol <= 5){
             //行和列都减1
             //0度方向
             if(direction === 0){
                leftCol++;
             }else if(direction === 1){
                 //90度方向
                 leftRow--;
             }else if(direction === 2){
                 //45度方向
                 leftRow--;
                 leftCol++;
             }else if(direction === 3){
                 //135度方向
                 leftCol--;
                 leftRow--;
             }
             //如果寻找的行或者列超出边界
             if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                 break;
             }
             if(this.isCommonType(leftRow,leftCol,type)){
                 //将该节点标记为待消状态
                 //如果当前数组里有当前的元素就不加进去了
                 
                 if(!commonColorArr.contain(this.findPrefabNodeFromGameScene(leftRow,leftCol,type))){
                     var nextShape = new Shape(this.findPrefabNodeFromGameScene(leftRow,leftCol,type),type);
                    //如果找到跟自己颜色一样的话将它放到消除队列里面
                    commonColorArr.push(nextShape);
                 }
             }else{
                 break;
             }
        }
        leftRow = row;
        leftCol = col;
        while(leftRow >= 0 || leftRow <= 11 || leftCol >=0 || leftCol <= 5){
            if(direction === 1){
                //-90度方向
                leftRow++;
            }else if(direction === 0){
                //180度方向
                leftCol--;
            }else if(direction === 2){
                //-135度方向
                leftRow++;
                leftCol--;
            }else if(direction === 3){
                //-45度方向
                leftCol++;
                leftRow++;
            }
            //如果超出了边界就退出当前循环
            if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                break;
            }
            if(this.isCommonType(leftRow,leftCol,type)){
                //将该节点的待消状态设置为true
                if(!commonColorArr.contain(this.findPrefabNodeFromGameScene(leftRow,leftCol,type))){
                    var nextShape = new Shape(this.findPrefabNodeFromGameScene(leftRow,leftCol,type),type);
                    //如果找到跟自己颜色一样的话将它放到消除队列里面
                    commonColorArr.push(nextShape);
                 }
            }else{
                break;
            }
        }
        if(commonColorArr.length >= 3){
             //加上自己就满足消除条件了
            //  return commonColorArr;
             for(let j = 0;j<commonColorArr.length;j++){
                 //将这些节点的待消状态改为true
                 commonColorArr[j].waitRemove = true;
             }
        }
    },
    //根据行和列查找到节点树当中的预制节点而不是背景节点,并且类型相同
    findPrefabNodeFromGameScene : function(row,col,type){
        var targetX = this.backGroundArr[row][col].prefabNode.x;
        var targetY = this.backGroundArr[row][col].prefabNode.y;
        if(arguments.length === 3){
            for(var i = 72;i<this.node.children.length;i++){
                //如果孩子节点的坐标等于目标节点的坐标的时候将这个节点返回回去
                if(this.node.children[i].x === targetX && this.node.children[i].y === targetY && this.getTypeByColor(this.node.children[i].color) === type){
                    return this.node.children[i];
                }
            }
        }else{
            for(var i = 72;i<this.node.children.length;i++){
                //如果孩子节点的坐标等于目标节点的坐标的时候将这个节点返回回去
                if(this.node.children[i].x === targetX && this.node.children[i].y === targetY){
                    return this.node.children[i];
                }
    
            }
        }
    },
    //从父节点清除符合条件的节点
    removeNodeFromGameScene : function(waitRemoveNode){
        waitRemoveNode.getComponent("Stone").isRemove = true;
        //定义一个数组专门负责记录每下落一次需要消除的节点数组（预制节点数组）
        var deleteShape = new Shape(waitRemoveNode,this.getTypeByColor(waitRemoveNode.color));
        this.willDeleteArr.push(deleteShape);
        //查找待消除节点上方的待下落方块时候看看是否在willDeleteArr里面如果再的话就不找了
        if(arguments.length === 2){
            //如果待消节点是处于同一列的时候让上面的节点下落完毕再进行判断是否可以连消
            //shape类型
             var upNodes = arguments[1];
             cc.log("upNodes is " + upNodes);
             for(var child = 72;child < this.node.children.length;child++){
                if(this.node.children[child].x === waitRemoveNode.x && this.node.children[child].y === waitRemoveNode.y){
                    var row = this.getRow(waitRemoveNode);
                    var col = this.getColumn(waitRemoveNode);
                    cc.log("row is " + row + " col is " + col);
                    this.backGroundArr[row][col].prefabNode.isFilled = 0;
                    this.backGroundArr[row][col].type = -1;
                    cc.log(this.backGroundArr[row][col].prefabNode.isFilled + "******" + this.backGroundArr[row][col].type);
                    //销毁该节点
                     this.node.children[child].destroy();
                     this.node.children[child].x = Math.floor(Math.random()*100000);
                     cc.log("该节点是否可用 : " + this.node.children[child].isValid);
                    //找到上面的格子
                    cc.log("upNodes is " + upNodes.length);
                    if(upNodes.length != 0){
                        //下落格子
                        for(var i = 0;i<upNodes.length;i++){
                            //改变背景方格的状态
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 0;
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = -1;
                            upNodes[i].prefabNode.y -= 100;
                            upNodes[i].y = upNodes[i].prefabNode.y;
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 1;
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = upNodes[i].type;
                        }
                        cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].x);
                        cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].y);
                        //  waitRemoveNode.color = cc.Color.WHITE;
                        //  waitRemoveNode.opacity = 50;
                        //从节点树的孩子移出该节点防止下次遍历出错
                        //  this.node.children.splice(child,1);
                        break;
                    }
                    
                }
            }
        }else{
            for(var child = 72;child < this.node.children.length;child++){
                if(this.node.children[child].x === waitRemoveNode.x && this.node.children[child].y === waitRemoveNode.y){
                    var row = this.getRow(waitRemoveNode);
                    var col = this.getColumn(waitRemoveNode);
                    cc.log("row is " + row + " col is " + col);
                    this.backGroundArr[row][col].prefabNode.isFilled = 0;
                    this.backGroundArr[row][col].type = -1;
                    cc.log(this.backGroundArr[row][col].prefabNode.isFilled + "******" + this.backGroundArr[row][col].type);
                    //销毁该节点
                    this.node.children[child].destroy();
                    this.node.children[child].x = Math.floor(Math.random()*100000);
                    //找到上面的格子
                    var upNodes = this.getWillRemoveUpNode(row,col,this.willDeleteArr);
                    cc.log("upNodes is " + upNodes.length);
                    //下落格子
                    for(var i = 0;i<upNodes.length;i++){
                        //改变背景方格的状态
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 0;
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = -1;
                        upNodes[i].prefabNode.y -= 100;
                        upNodes[i].y = upNodes[i].prefabNode.y;
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 1;
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = upNodes[i].type;
                    }
                     cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].x);
                     cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].y);
                    //  waitRemoveNode.color = cc.Color.WHITE;
                    //  waitRemoveNode.opacity = 50;
                     //从节点树的孩子移出该节点防止下次遍历出错
                     //  this.node.children.splice(child,1);
                     //检查是否可以重复消除如果可以连消的话进行连消
                     this.afterMoveNodeArr.push(upNodes);
                    return upNodes;
                }
            }
        }
        return false;
    },
    //判断类型是否和传进来的类型相同
    isCommonType : function(row,col,type){
          if(this.findPrefabNodeFromGameScene(row,col,type) === undefined){
              return false;
          }else{
              return this.getTypeByColor(this.findPrefabNodeFromGameScene(row,col,type).color) === type ? true : false;
          }
          
    },
   
    getTypeByColor : function(color){
        var colorValue = color.toHEX("#rrggbb").toLocaleUpperCase();
        cc.log("------------>colorValue is " +colorValue);
        switch(colorValue){
            case 'FF0000':
                return 2;
            case '00FF00':
                return 0;
            case '0000FF':
                return 1;        
        }

    },
    /**
       检测是否可以向左移动
    **/
    CheckIsLeft : function(){
        var row = [];
        for(var i = 0;i<3;i++){
            row[i] = this.getRow(this.nodeArr[i].prefabNode);
        }
        var col = this.getColumn(this.nodeArr[2].prefabNode);
        //每下降一个格检测一次
        //如果列的个数为1的话
        for(var m = 0;m<row.length;m++){
            //获得行数
            var mr = row[m];
            //只要一个方格的左边的背景方格的状态为1的话就停止移动
            if(this.backGroundArr[mr][col - 1].prefabNode.isFilled === 1){
                //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                return false;
            }
        }
        return true;
    },
    //检测是否可以向右移动
    CheckIsRight : function(){
        var row = [];
        for(var i = 0;i<3;i++){
            row[i] = this.getRow(this.nodeArr[i].prefabNode);
        }
        var col = this.getColumn(this.nodeArr[2].prefabNode);
        //每下降一个格检测一次
        //如果列的个数为1的话说明是竖条的形状
        for(var m = 0;m<row.length;m++){
            //获得行数
            var mr = row[m];
            //只要一个方格的左边的背景方格的状态为1的话就停止移动
            if(this.backGroundArr[mr][col + 1].prefabNode.isFilled === 1){
                //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                return false;
            }
        }
        return true;
    },
    //生成下一个形状
    generateNext : function(parentNode,x,y){
        return this.createShape(parentNode,x,y);

    },
    //通过列号获得对应的X坐标
    getLocationByCol:function(colNumber){
        switch(colNumber){
            case 0:
                return -250;
            case 1:
                return -150;  
            case 2:
                return -50;
            case 3:
                return 50;   
            case 4:
                return 150;
            case 5:
                return 250;             
        }
    },
    getLocationByRow:function(rowNumber){
        switch(rowNumber){
            case 0:
                return -550;
            case 1:
                return -450;
            case 2:
                return -350;
            case 3:
                return -250;
            case 4:
                return -150;
            case 5:
                return -50;
            case 6:
                return 50;
            case 7:
                return 150;      
            case 8:
                return 250;
            case 9:
                return 350;
            case 10:
                return 450;
            case 11:
                return 550;            
        }
    },
    //根据方块类型得到对应的类型数组
    getTypeArrByType : function(type){
        switch(type){
            case 0:
                return this.type0Arr;
            case 1:
                return this.type1Arr;
            case 2:
                return this.type2Arr;        
        }
    },
});
