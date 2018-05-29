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
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
        
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
            for(var i = 0;i<this.lenght;i++){
                //如果颜色坐标都一样就返回true
                if(this[i].shape.x === shape.x && this[i].shape.y === shape.y && this[i].shape.prefabNode.color.toHEX() === shape.prefabNode.color.toHEX()){
                    return true;
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
        //如果当前状态是处于可以改变状态
        // if(this.shapeNode.allowRotate){
        //     this.updatePrefatY(dt);
        // }
        // cc.log("当前行是："+ this.getRow() + " 当前列是：" + this.getColumn());
    },
    //定时器控制下落
    downFunction : function(nodeArr,time){
        //一秒下落一次
        this.schedule(function(){
            this.updatePrefatY(nodeArr);
        }.bind(this),time);
    },
    // //计时器回调函数
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
                }
            }else{
                //固定完之后重新生成随机预制体节点
                this.nodeArr = this.generateNext(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
                //开启计时器
                this.downFunction(this.nodeArr,1);
                //如果是不能下落的话就是前一个条形已经固定下来了，固定下来之前已经生成了下一个的形状
                for(var j = 0;j<3;j++){
                    this.nodeArr[j].prefabNode.y -= this.speed;
                }
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
        cc.log("before0 is " + before0);
        var before1 = this.nodeArr[1].prefabNode.color;
        cc.log("before1 is " + before1);
        var before2 = this.nodeArr[2].prefabNode.color;
        cc.log("before2 is " + before2);
        //分别改变颜色
        this.nodeArr[0].prefabNode.color = before2;
        this.nodeArr[1].prefabNode.color = before0;
        this.nodeArr[2].prefabNode.color = before1;
    },
    //左移方法
    moveLeft    : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            if(this.CheckIsLeft() && this.canChangeStatu){
                this.nodeArr[i].prefabNode.x -= this.speed;
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
                    for(var i = 0;i<nodeArr.length;i++){
                        if((nodeArr[i].prefabNode.y <= -this.nodeHeight/2 + this.prefabHeight)){
                        //撞到地面了
                        //停止方块的移动记录下当前处于哪一行那一列并改变这一行这一列的背景方格的状态
                        this.changeBackBlockStatus(nodeArr);
                        return false;
                        }
                    }
                    //如果最大行下方方格的状态为1的话就是不能下落
                    if(this.backGroundArr[rowN + 1][colN].prefabNode.isFilled === 1){
                        //将对应的背景方格的状态改为1
                        this.changeBackBlockStatus(nodeArr);
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    this.changeBackBlockStatus(nodeArr);
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
            var row = [];
            for(var i = 0;i<nodeArr.length;i++){
                row[i] = this.getRow(nodeArr[i].prefabNode);
            }
            var col = this.getColumn(nodeArr[nodeArr.length - 1].prefabNode);
            //将接触地面或者是下方网格为1的背景网格即将消除的当前形状的行和列保存下来
            this.beforChangeBack=[];
            for(var i = 0;i<nodeArr.length;i++){ 
                this.beforChangeBack.push(row[i]);
            }
            //满足条件进行消除
            // if(this.removeBox())
            //将停止的方块所处的行和列记录并保存起来
            this.beforChangeBack.push(col);
            //将背景方格的属性修改为1
            for(var n=0;n<row.length;n++){
                //设置对应格的数据为1
                this.backGroundArr[row[n]][col].prefabNode.isFilled = 1;
                //将背景方格的颜色属性改为下落方格的颜色
                this.backGroundArr[row[n]][col].prefabNode.color = this.nodeArr[n].prefabNode.color;
                //设置类型值
                this.backGroundArr[row[n]][col].type = this.nodeArr[n].type;
            }
            //将this.nodeArr上的所有节点都删掉
            //查看每个方格的周围是否可以消除
            for(var m = 0;m<row.length;m++){
                // cc.log(this.backGroundArr[row[m]]);
                //获得该方块的类型
                var type = this.nodeArr[m].type;
                //依据方块类型去除对应的数组
                var colorBlockTypeArr = this.getTypeArrByType(type);
                //将对应的类型数组串到放发里去，判断是否可以消除如果可以消除的话消除并更新地图，不可以的话搜索下一个节点是否可以消除；
                this.find(nodeArr[m].prefabNode,colorBlockTypeArr);
            }
            //关闭所有计时器
            this.unscheduleAllCallbacks();
        }
        
        
    },
    find(node,colorBlockTypeArr){
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
        var color = node.color.toHEX();
        //获得当前方格节点所在的行
        var row = this.getRow(node);
        //获得当前节点所在的列
        var col = this.getColumn(node);
        for(var i = 0;i<4;i++){
            //135度和-45度两个方向寻找
            if(i === 0){
               this.directorFind(slant0Arr,row,col,i,color);
            }else if(i === 1){
             //45度和-135度方向寻找
              this.directorFind(slant1Arr,row,col,i,color);
            }else if(i === 2){
                this.directorFind(slant2Arr,row,col,i,color);
            }else if(i === 3){
                this.directorFind(slant3Arr,row,col,i,color);
            }
        }
        //这时候colorBlockTypeArr里面是有东西的或者没东西，遍历该数组
        for(var i = 0;i<4;i++){
            var len = colorBlockTypeArr[i].length;
            if(len < 2){
                continue;
            }else{
                //消除的时候需要关闭计时器
                //重新开始一个计时器处理消除后的方格上面的其他方格的下落
                 this.unscheduleAllCallbacks();
                //更新地图（先把自己删除）
                this.updateMap(node,row,col);
                for(var j = 0;j<len;j++){
                    //将背景方格的颜色重置为原来的颜色来达到消除的目的
                    var willRemoveRowNumber = this.getRow(colorBlockTypeArr[i][j].prefabNode);
                    var willRemoveColNumber = this.getColumn(colorBlockTypeArr[i][j].prefabNode);
                    var waitRemoveNode = this.backGroundArr[willRemoveRowNumber][willRemoveColNumber].prefabNode;
                    //更新地图
                    this.updateMap(waitRemoveNode,willRemoveRowNumber,willRemoveColNumber);
                    //从父节点的72个节点开始查查找到跟要删除的节点的坐标一样的时候将这个节点从根节点中删除掉
                    // this.removeNodeFromGameScene(waitRemoveNode);
                    // // delete colorBlockTypeArr[i][j];
                    // //重新设置背景方格的颜色
                    // waitRemoveNode.color = cc.Color.WHITE;
                    // waitRemoveNode.opacity = 50;
                    // waitRemoveNode.isFilled = 0;
                    // this.backGroundArr[willRemoveRowNumber][willRemoveColNumber].type = -1;
                }
                
                
            }
        }
    },
    //从父节点清除符合条件的节点
    removeNodeFromGameScene : function(waitRemoveNode){
        for(var child = 72;child < this.node.children.length;child++){
            if(this.node.children[child].x === waitRemoveNode.x && this.node.children[child].y === waitRemoveNode.y){
                 //销毁该节点
                 this.node.children[child].destroy();
            }
        }
    },
    /*
            更新地图方法并且将该节点从其父节点中移出
      因为消除动作需要进行更新地图操作
      @param : removeNode --- > 待消除的节点
      @param : row        ---->当前节点的行号
      @param ：col        ---->当前节点的列号 
     */
    updateMap : function(removeNode,row,col){
        this.removeNodeFromGameScene(removeNode);
        this.backGroundArr[row][col].prefabNode.color = cc.Color.WHITE;
        this.backGroundArr[row][col].prefabNode.opacity = 50;
        this.backGroundArr[row][col].prefabNode.isFilled = 0;
        this.backGroundArr[row][col].type = -1;
        //该节点上的预制节点的位置变化对每一个节点上的位置进行判断
        this.moveDownUpOfRemoveNode(removeNode,row,col);
    },
    /*
        移动将要消除方格的上方方块
        @param removeNode ----> 将要消除的方块
        @param row        ---->将要消除方块的行
        @param col        ---->将要消除方块的列
    */
    moveDownUpOfRemoveNode : function(removeNode,row,col){
        //待下落方块的数组（背景方格的属性）
        var waitDownBlock = [];
        //重置nodeArr
        this.waitMove = [];
        while(row > 0){
            //上一行
            row = row - 1;
            var upBlock = this.backGroundArr[row][col];
            if(upBlock.prefabNode.isFilled === 1){
                waitDownBlock.push(upBlock);
            }else{
                break;
            }
        }
        for(var i = 0;i<waitDownBlock.length;i++){
            //将背景方格的颜色属性设置为初始值
            waitDownBlock[i].prefabNode.color = cc.Color.WHITE;
            waitDownBlock[i].prefabNode.opacity = 50;
            waitDownBlock[i].prefabNode.isFilled = 0;
        }
        //从节点树中找出对应的节点(这就是将要移动的节点)
        for(var child = 72;child < this.node.children.length;child++){
            for(var co = 0 ;co < waitDownBlock.length;co++){
                if(this.node.children[child].x === waitDownBlock[co].prefabNode.x && 
                this.node.children[child].y === waitDownBlock[co].prefabNode.y){
                this.waitMove.push(this.node.children[child]);
                // this.node.children[child].destroy();
                }
            }
            
        }
        cc.log("willMoveNode is " + this.waitMove);
        //下降将要移动的节点数组
        this.xiaochuDown(this.waitMove);
    },
    xiaochuDown : function(willMoveNodeArr){
        this.downFunction(willMoveNodeArr,0.02);
    },
    /*根据角度填充各个方向数组
     *@param :removeArr -->待消除队列
     *@param : row ------->当前节点所在的行
     *@param : col ------->当前节点所在的列 
     *@param : type ------>需要搜索的方向 
     */
    directorFind : function(removeArr,row,col,type,color){
        //45度和-135度方向检测
        var leftRow = row;
        var leftCol = col;
        while(leftRow >= 0 || leftRow <= 11 || leftCol >= 0 || leftCol <=5){
             //行和列都减1
             if(type === 0){
                leftRow--;
                leftCol--;
             }else if(type === 1){
                 //45度和-135度方向
                 leftRow--;
                 leftCol++;
             }else if(type === 2){
                 //90度方向寻找
                 leftRow--;
             }else if(type === 3){
                 leftCol++;
             }
             //如果寻找的行或者列超出边界
             if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                 break;
             }
             if(this.backGroundArr[leftRow][leftCol].prefabNode.color.toHEX() === color){
                 //如果当前数组里有当前的元素就不加进去了
                 if(!removeArr.contain(this.backGroundArr[leftRow][leftCol])){
                    //如果找到跟自己颜色一样的话将它放到消除队列里面
                    removeArr.push(this.backGroundArr[leftRow][leftCol]);
                 }
                  
             }else{
                 break;
             }
        }
        leftRow = row;
        leftCol = col;
        while(leftRow >= 0 || leftRow <= 11 || leftCol >=0 || leftCol <= 5){
            if(type === 1){
                leftRow++;
                leftCol--;
            }else if(type === 0){
                leftRow++;
                leftCol++;
            }else if(type === 2){
                leftRow++;
            }else if(type === 3){
                leftCol--;
            }
            //如果超出了边界就退出当前循环
            if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                break;
            }
            if(this.backGroundArr[leftRow][leftCol].prefabNode.color.toHEX() === color){
                 if(!removeArr.contain(this.backGroundArr[leftRow][leftCol])){
                    removeArr.push(this.backGroundArr[leftRow][leftCol]);
                 }
            }else{
                break;
            }
        }
        if(removeArr.length >= 2){
             //加上自己就满足消除条件了
             return removeArr;
        }
    },
    /**
     * 
      查找一个给定坐标的精灵
     */
    findOneBoxInTheShapeArr : function(startRow,col){
        //得到要删除的精灵坐标
        var xLocation = this.getLocationByRow(startRow);
        var yLocation = this.getLocationByCol(col);
        //遍历所有的形状数组找到对应的坐标节点
        for(var i =0;i<this.shapeArr.length;i++){
            for(var j = 0;j<this.shapArr[i].length;j++){
                if((xLocation === this.shapeArr[i][j].x) && (yLocation === this.shapeArr[i][j].y)){
                    //将背景方格的属性设置为0
                    this.backGroundArr[startRow][col].isFilled = 0;
                    //如果找到该精灵的话就把该精灵所在的形状节点的该精灵pop出该形状数组
                    
                    var willDeleteSprite = this.shapeArr[i][j];  //将二维数组的i返回出去
                }
            }
        }
        return null;
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
    //检查某一行某一列下的网格属性是否为1
    checkGridIsOne : function(row,col){
        if(row < 11){
            for(var i = row;i<11;i++){
                //检查i行col列背景方格是否为1
                if(this.backGroundArr[row][col].isFilled === 1){
                    return row;
                }
            }
        }else{
            return 11;
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
    // //当前方格节点周围是不是有相同的颜色(方块停止的时候)
    // hasCommonColor :  function(shape,row,col){
    //     //创建一个8行2列的二维数组
    //     this.directoArr = this.createMatrix(8,2,null);
    //     this.directoArr[0][0]=row-1;
    //     this.directoArr[0][1]=col-1;
    //     this.directoArr[1][0]=row-1;
    //     this.directoArr[1][1]=col;
    //     this.directoArr[2][0]=row-1;
    //     this.directoArr[2][1]=col+1;
    //     this.directoArr[3][0]=row;
    //     this.directoArr[3][1]=col-1;
    //     this.directoArr[4][0]=row;
    //     this.directoArr[4][1]=col+1;
    //     this.directoArr[5][0]=row+1;
    //     this.directoArr[5][1]=col-1;
    //     this.directoArr[6][0]=row+1;
    //     this.directoArr[6][1]=col;
    //     this.directoArr[7][0]=row+1;
    //     this.directoArr[7][1]=col+1;
    //     var color = shape.prefabNode.color;

    //     //两个点的最长就是100*sin(45);
    //     var mostLong = node.width*Math.sin(45*Math.PI/180)*2;
    //     var angle = 0;
    //     //遍历八个方向
    //     for(var i = 0;i<3;i++){
    //             var rx = node.x + 100;
    //             var lx = node.x - 100;
            

    //     }
    // },
    // //生成方格类型数组
    // /**
    //  * 如果有三种类型的方格就生成三个方格类型数组每个类型数组存放待消除的个数
    //  * 如果有两种类型的方格就生成两个方格类型数组
    //  * 如果有一种类型的方格就生成一个方格类型数组
    //  */
    // typeArr : function(){
    //     Array.prototype.setColor = function(colorType){
    //         this.colorType = colorType;
    //     }
    //     Array.prototype.getColor = function(){
    //         return this.colorType;
    //     }
    //     this.typeArr;
    //     if(this.getColorCount() === 1){
    //         //如果只有一种颜色的时候
    //         this.oneTypeBoxArr.setColor(this.boxColorArr[0]);
    //     }else if(this.getColorCount() === 2){

    //     }

    // }   
});
