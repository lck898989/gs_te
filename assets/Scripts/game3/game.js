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
        //保存临时的形状
        // this.shapeNode = new Shape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
        //存放每次生成的预制体数组即是活动的条
        this.nodeArr =this.createShape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
        //将x的所有可能坐标存到一个数组里面
        this.locationSet = null;
        cc.log("this.nodeArr is " + this.nodeArr);
        this.createBack();
        //创建下一个旋转体
        // this.nextShape = new Shape(this.nextShape,0,0);
        this.downFunction();
        //当前条是否还可以改变状态
        this.canChangeStatu = true;
        //判断是否是快速下落监听
        this.quickDownListener();
        //看看数组中是否包含一个元素,专门为精灵数组定义的一个数组方法
        Array.prototype.contain = function(val){
            for(var i=0;i<this.length;i++){
                if((this[i].x === val.x && this[i].y === val.y) && (this[i].color.toHEX() === val.color.toHEX())){
                    return true;
                }
            }
            return false;
        }
        //定义可以消除的方格的数量
        this.canRemove = 0;
    },
    quickDownListener : function(){
        this.downButton.on('touchstart',function(){
            //将下落速度修改为300
            this.speed = 600;
        }.bind(this));
        this.downButton.on('touchend',function(){
            this.speed = 100;
        }.bind(this));
        this.downButton.on('touchcancel',function(){
            this.speed = 100;
        }.bind(this));
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
        var columnNumber;
        //竖行的条
        var indexGrid = this.chooseColumnByLocation(node.x);
        columnNumber = indexGrid;
        return columnNumber;
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
        var yIndexResult = this.chooseRawByLocation(node.y);
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
        //声明一个色块类型的数组
        this.type0Arr = new Array();
        this.type1Arr = new Array();
        this.type2Arr = new Array();
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
        // cc.log("当前行是："+ this.getRow(this.nodeArr[]) + " 当前列是：" + this.getColumn());
    },
    //定时器控制下落
    downFunction : function(){
        //一秒下落一次
        this.schedule(this.callBack,1);
    },
    //计时器回调函数
    callBack     : function(){
        this.updatePrefatY();
    },
    //更新预制体节点的y坐标
    updatePrefatY : function(dt){
        cc.log("-------->>>>>>>" + this.nodeArr[0].y);
        //如果允许下落的话条的y坐标向下移动
        if(this.CheckIsDown()){
            //判断方格是否可以消除
            //位移3个方格
            for(var i = 0;i < 3;i++){
                this.nodeArr[i].prefabNode.y -= this.speed;
            }
        }else{
            //如果是不能下落的话就是前一个条形已经固定下来了，固定下来之前已经生成了下一个的形状
            for(var j = 0;j<3;j++){
                this.nodeArr[j].prefabNode.y -= this.speed;
            }
        }
    },
    isEliminate : function(){
        //讨论方块下落后与已经下落的方块接触时候产生的情况，反映出相连结果对消除
        //的有利程度，相邻颜色越多有利值越大
        if(this.getColorCount() === 1){
            //当下落方块中之后一个颜色时候，产生的结果为消除
            return true;
        }else if(this.getColorCount() === 2){

        }else{

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
    CheckIsDown : function(){
        var row = [];
        for(var i = 0;i<3;i++){
            row.push(this.getRow(this.nodeArr[i].prefabNode));
        }
        //获得当前的行数
        //获得当前的列数
        var col = this.getColumn(this.nodeArr[0].prefabNode);
        //每下降一个格检测一次
        //遍历3格预制体方格看是否可以下落
        //如果是横着的条就检测下面三个背景方格的属性isFilled是不是为1如果为1的话不允许下落
        //判断最大行下面方格的状态是否为1
        cc.log("array of row is " + row);
        var rowN = row[2];
        var colN = col;
        //如果最大的行号是11的话不用再这里判断这样的情况是触底的情况
        if(rowN != 11){
            for(var i = 0;i<3;i++){
                if((this.nodeArr[i].prefabNode.y <= -this.nodeHeight/2 + this.prefabHeight)){
                //撞到地面了
                //停止方块的移动记录下当前处于哪一行那一列并改变这一行这一列的背景方格的状态
                this.changeBackBlockStatus(row,col);
                return false;
                }
            }
            //如果最大行下方方格的状态为1的话就是不能下落
            if(this.backGroundArr[rowN + 1][colN].prefabNode.isFilled === 1){
                //将对应的背景方格的状态改为1
                this.changeBackBlockStatus(row,col);
                return false;
            }else{
                return true;
            }
        }else{
            this.changeBackBlockStatus(row,col);
            return false;
        }
    },
    /**
       检测是否可以向左移动
    **/
    CheckIsLeft : function(){
        //获得当前的行数
        var row = [];
        for(var i = 0;i<3;i++){
            row.push(this.getRow(this.nodeArr[i].prefabNode));
        }
        //获得当前的列数
        var col = this.getColumn(this.nodeArr[2].prefabNode);
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
        //获得当前的行数
        var row = [];
        for(var i = 0;i<3;i++){
            row.push(this.getRow(this.nodeArr[i].prefabNode));
        }
        //获得当前的列数
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
    //改变背景方格的状态
    changeBackBlockStatus : function(row,col){
        // var row = this.getRow();
        // cc.log("row is " + row);
        // var col = this.getColumn();
        // cc.log("col is " + col);
        //将接触地面或者是下方网格为1的背景网格即将消除的当前形状的行和列保存下来
        this.beforChangeBack=[];
        for(var i = 0;i<3;i++){ 
            this.beforChangeBack.push(row[i]);
        }
        //满足条件进行消除
        // if(this.removeBox())
        //将停止的方块所处的行和列记录并保存起来
        this.beforChangeBack.push(col);
        //将背景方格的属性修改为1，修改为相对应的颜色和方块类型
        for(var m = 0;m<row.length;m++){
                //将各个有用的状态值设到背景方格中去
                this.backGroundArr[row[m]][col].prefabNode.isFilled = 1;
                //将背景方格的颜色属性改为下落方格的颜色
                this.backGroundArr[row[m]][col].prefabNode.color = this.nodeArr[m].prefabNode.color;
                //将图片的类型赋值给背景方格的属性type
                this.backGroundArr[row[m]][col].type = this.nodeArr[m].type;
        }
        for(var m = 0;m<row.length;m++){
            // cc.log(this.backGroundArr[row[m]]);
            cc.log(this.backGroundArr[row[m]][col]);
            //设置对应格的数据为1
            //打印背景网格的状态
            cc.log(this.backGroundArr[row[m]][col].prefabNode.isFilled);
            //查看是否可以消除
            this.hasCommonColor(this.nodeArr[m]);
            //消除完刷新地图
        }
        //固定完之后重新生成随机预制体节点
        this.nodeArr = this.generateNext(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
    },
    //当前方格节点周围是不是有相同的颜色(方块停止的时候)
    hasCommonColor :  function(shape){
        var color = shape.prefabNode.color;
        var type = shape.type;
        //遍历八个点
        //声明色块类型数组
        var colorBlockTypeArr = this.returnColorBlockArrByType(type);
        //生成待消队列
        var waitRemoveQueue = this.find(shape.prefabNode,colorBlockTypeArr);
        //如果待消队列的长度大于2的时候检查是否可以消除
        if(waitRemoveQueue.length > 2){
            //遍历待消除队列
            //随机选择两个点组成一个方程，再将剩余点依次代入方程看看剩余的点是否在这条直线方程上如果在这条直线方程上就进行消除
            var random = this.createRandom(0,waitRemoveQueue.length);
            this.willMovedArr = this.createMatrix(waitRemoveQueue.length,2,null);
            //将待消队列返回出去
            


            //消除完之后将colorBlockTypeArr清空
        }   

    },
    //查看待消队列是否可以消除
    IsCanRemove : function(waitRemoveQueue,prefabNode){
        //定义一个消除队列
        var removeQueue = [];
        var commonXCount = 0;
        var commonYCount = 0;
        var slantCommon = 0;
        removeQueue.push(prefabNode);
        for(var i = 0;i < waitRemoveQueue.length;i++){
            cc.log("waitRemoveQueue's x is " + waitRemoveQueue[i].x);
            cc.log("waitRemoveQueue's y is " + waitRemoveQueue[i].y);
            if(prefabNode.x === waitRemoveQueue[i].x && prefabNode.y === waitRemoveQueue[i].y){
                continue;
            }
            //横向检测
            if(prefabNode.y === waitRemoveQueue[i].y && prefabNode.x != waitRemoveQueue[i].x){
                removeQueue.push(waitRemoveQueue[i]);
                commonYCount++;
            }
            //纵向检测
            if(prefabNode.x === waitRemoveQueue[i].x && prefabNode.y != waitRemoveQueue[i].y){
                removeQueue.push(waitRemoveQueue[i]);
                commonXCount++;
            }
            //斜向检测45度方向
            if(((prefabNode.x - waitRemoveQueue[i].x === 100)&&(prefabNode.y - waitRemoveQueue[i].y === 100))){
                    var k = 1;
                    removeQueue.push(waitRemoveQueue[i]);
                    for(var j = 0;j<waitRemoveQueue.length;j++){
                        if((waitRemoveQueue[j].x === prefabNode.x && waitRemoveQueue[j].y === prefabNode.y) ||
                            (waitRemoveQueue[j].x === waitRemoveQueue[i].x && waitRemoveQueue[j].y === waitRemoveQueue[i].y)){
                            continue;
                        }else{
                            var result;
                            result = prefabNode.y - waitRemoveQueue[j].y - k *(prefabNode.x - waitRemoveQueue[j].x);
                            if(result === 0){
                                //可以斜着消
                                removeQueue.push(waitRemoveQueue[j]);
                            }
                        }
                    }
            }
            //斜向检测-45度方向
            if(((prefabNode.x - waitRemoveQueue[i].x) === 100)&&(prefabNode.y + 100 === waitRemoveQueue[i].y)){
                    var k = -1;
                    removeQueue.push(waitRemoveQueue[i]);
                    for(var j = 0;j<waitRemoveQueue.length;j++){
                        if((waitRemoveQueue[j].x === prefabNode.x && waitRemoveQueue[j].y === prefabNode.y) ||
                            (waitRemoveQueue[j].x === waitRemoveQueue[i].x && waitRemoveQueue[j].y === waitRemoveQueue[i].y)){
                            continue;
                        }else{
                            var result;
                            result = prefabNode.y - waitRemoveQueue[j].y - k *(prefabNode.x - waitRemoveQueue[j].x);
                            if(result === 0){
                                //可以斜着消
                                removeQueue.push(waitRemoveQueue[j]);
                            }
                        }
                    }
            }
        }
    },
    //根据色块类型返回色块类型数组方法
    returnColorBlockArrByType : function(type){
        cc.log("type is " + type);
        switch(type){
            case 0:
                return this.type0Arr;
            case 1:
                return this.type1Arr;
            case 2:
                return this.type2Arr;        
        }
    },
    //寻找与该预制节点相同的类型的方块
    find  : function(node,commonColorArr){
            cc.log("%%%%%%%%%%%%");
            var row = this.getRow(node);
            var col = this.getColumn(node);
            //创建一个8行2列的二维数组
            var directoArr = this.createMatrix(8,2,null);
            directoArr[0][0]=(row-1);
            directoArr[0][1]=(col-1);
            directoArr[1][0]=(row-1);
            directoArr[1][1]=(col);
            directoArr[2][0]=(row-1);
            directoArr[2][1]=(col+1);
            directoArr[3][0]=(row);
            directoArr[3][1]=(col-1);
            directoArr[4][0]=(row);
            directoArr[4][1]=(col+1);
            directoArr[5][0]=(row+1);
            directoArr[5][1]=(col-1);
            directoArr[6][0]=(row+1);
            directoArr[6][1]=(col);
            directoArr[7][0]=(row+1);
            directoArr[7][1]=(col+1);
            //遍历每个方格中周围对应的八个位置
            for(var i =0;i<directoArr.length;i++){
                var backRow =directoArr[i][0];
                var backCol =directoArr[i][1];
                //边界判断
                if(backRow > 11 || backRow < 0){
                    continue;
                }
                if(backCol > 5 || backCol < 0){
                    continue;
                }
                var currentNode = this.backGroundArr[backRow][backCol].prefabNode;
                cc.log("currentNode is " + currentNode);
                //如果两个颜色的val值相同就是一样的
                if(node.color.toHEX() === currentNode.color.toHEX()){
                    //如果当前格子已经在数组中了就不加进去了
                    if(!commonColorArr.contain(currentNode)){
                        //将相同颜色的节点加入到数组中去
                        commonColorArr.push(currentNode);
                        this.find(currentNode,commonColorArr);
                    }
                }else{
                    continue;
                }
                
            }
            //判断push进去的数组不是之前的节点
            return commonColorArr;
    },
    //判断js数组中是否有重复值
    isRepeat  : function(arr){
        var hash = {};
        for(var i in arr){
            if(hash[arr[i]]){
                return true;
            }
            hash[arr[i]] = true;
        }
        return false;
    },
    //消除方块
    removeBox : function(){
        //显示当前落下的方格所处的行和列
        cc.log(this.beforChangeBack);
        var len = this.beforChangeBack.length;
        //最底下的那一行
        var bottomRow = this.beforeChangeBack[2];
        //列数
        var colNums = this.beforChangeBack[len - 1];
        if(this.getColorCount() === 1){
            //如果只有一个颜色的话看看下面有没有待消除的方块如果下方没有待消除的就暂时先消除这三个方块
            if(this.backGroundArr[bottomRow + 1][colNums].color === this.shapeArr[this.shapeArr.length - 1][2].color){
                //将产生连消一次消除四个
                this.shapArr.pop();
                //消除另外一个形状里的一个方格并将另外一个方格所对应的背景方格的状态改变为0
                this.findOneBoxInTheShapeArr(bottomRow+1,this.beforChangeBack[3]);
            }else{
                //直接消除将形状数组中的已经固定下来的最后一个形状给删除
                this.shapeArr.pop();
            }
           return true;            
        }else if(this.getColorCount() === 2){
            //如果是两种或者三种颜色的话要考虑上面方格的下落问题
        }else{
            //三个方格颜色各不相同

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
});