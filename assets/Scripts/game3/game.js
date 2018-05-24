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
        }

    },
    // use this for initialization
    onLoad: function () {
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
        cc.log("this.nodeWidth is " + this.nodeWidth + "this.nodeHeight is " + this.nodeHeight);
        //存放方格的颜色数组
        this.boxColorArr = [];
        //背景二位数组
        this.backGroundArr = null;
        //形状集合二维数组,将每次生成的形状添加到二维数组里面
        this.shapeArr = [];
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
    getColumn : function(){
        var nx = [];
        if(this.nodeArr[0].x === this.nodeArr[1].x && this.nodeArr[1].x === this.nodeArr[2].x){
            //是竖行的条
            nx.push(this.nodeArr[0].x);
        }else{
            //说明是横条
            for(var i = 0;i < 3;i++){
                nx.push(this.nodeArr[i].x);
            }
        }
        var resultIndex = [];
        if(nx.length === 1){
            //竖行的条
            var indexGrid = this.chooseColumnByLocation(nx[0]);
            resultIndex.push(indexGrid);
        }else{
            //将横向的条的x坐标遍历出来
            for(var j = 0;j < 3;j++){
                var index = this.chooseColumnByLocation(nx[j]);
                //将结果push到结果数组中去
                resultIndex.push(index);
            }
        }
        return resultIndex;
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
    getRow : function(){
        var yArr = [];
        for(var i = 0;i < 3;i++){
            yArr.push(this.nodeArr[i].y);
        }
        var yIndexResult = [];
        if(yArr[0] === yArr[1] && yArr[1] === yArr[2]){
               yIndexResult.push(this.chooseRawByLocation(yArr[0]));
        }else{
            for(var j = 0;j < 3;j++){
                yIndexResult.push(this.chooseRawByLocation(yArr[j]));
            }
        }
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
    createShape : function(parentNode,x,y){
        //用来存放预制体的数组
        var prefabArrTemp = [];
        for(var i = 0;i < 3;i++){
            var offSet = i * this.prefabHeight * 2;
            cc.log("offSet is " + offSet);
            //产生0-3的随机数
            var index = Math.floor(Math.random()*3);
            //将对应的颜色索引存放到该数组中
            this.boxColorArr.push(index);
            cc.log("index is " + index);
            //将对应的预制体取出来转化为节点然后显示
            var prefabNode = this.createPrefab(this.prefabArr[index]);
            cc.log("x is " + x + " and y is "+ y - offSet);
            //设置预制节点的位置
            prefabNode.setPosition(x,y - offSet);
            //将该预制节点添加为parentNode的孩子
            parentNode.addChild(prefabNode);
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
        cc.log("当前行是："+ this.getRow() + " 当前列是：" + this.getColumn());
        
        
    },
    //定时器控制下落
    downFunction : function(){
        //一秒下落一次
        this.schedule(function(){
            cc.log(this.CheckIsDown());
            this.updatePrefatY();
        },1);
    },
    //更新预制体节点的y坐标
    updatePrefatY : function(dt){
        cc.log(this.nodeArr[0].y);
        //如果允许下落的话条的y坐标向下移动
        if(this.CheckIsDown()){
            
            //位移3个方格
            for(var i = 0;i < 3;i++){
                this.nodeArr[i].y -= this.speed;
            }
        }else{
            //如果是不能下落的话就是前一个条形已经固定下来了，固定下来之前已经生成了下一个的形状
            for(var j = 0;j<3;j++){
                this.nodeArr[j].y -= this.speed;
            }
        }
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
        var before0 = this.nodeArr[0].color;
        cc.log("before0 is " + before0);
        var before1 = this.nodeArr[1].color;
        cc.log("before1 is " + before1);
        var before2 = this.nodeArr[2].color;
        cc.log("before2 is " + before2);
        //分别改变颜色
        this.nodeArr[0].color = before2;
        this.nodeArr[1].color = before0;
        this.nodeArr[2].color = before1;
    },
    //左移方法
    moveLeft    : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            if(this.CheckIsLeft() && this.canChangeStatu){
                this.nodeArr[i].x -= this.speed;
                if((this.nodeArr[i].x <= -this.nodeWidth/2 + this.prefabHeight)){
                    this.nodeArr[i].x = -this.nodeWidth/2 + this.prefabHeight;
                }
            }
        }
    },
    //右移方法
    moveRight   : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            if(this.CheckIsRight()){
                this.nodeArr[i].x += this.speed;
                if((this.nodeArr[i].x >= this.nodeWidth/2 - this.prefabHeight)){
                    this.nodeArr[i].x = this.nodeWidth/2 - this.prefabHeight;
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
        //获得当前的行数
        var row = this.getRow();
        //获得当前的列数
        var col = this.getColumn();
        //每下降一个格检测一次
        //遍历3格预制体方格看是否可以下落
        //如果是横着的条就检测下面三个背景方格的属性isFilled是不是为1如果为1的话不允许下落
        if(row.length === 1){
            //遍历它的数组的状态
            //遍历三个列对应的下一行是否为1
            for(var j = 0;j<col.length;j++){
                var nc = col[j];
                //判断一下下一行的状态
                if(row[0] != 11){
                    if(this.backGroundArr[row[0] + 1][nc].isFilled === 1){
                        //如果下方方格有一个状态为1的时候将返回不能下落并改变背景方格的状态
                        this.changeBackBlockStatus();
                        return false;
                    }
                }else{
                    this.changeBackBlockStatus();
                    return false;
                }
            }
            //如果当前条下方格的状态部位1的话就返回可以下落
            return true;
        }else if(col.length === 1){
            //判断最大行下面方格的状态是否为1
            cc.log("array of row is " + row);
            var rowN = row[2];
            var colN = col[0];
            //如果最大的行号是11的话不用再这里判断这样的情况是触底的情况
            if(rowN != 11){
                for(var i = 0;i<3;i++){
                    if((this.nodeArr[i].y <= -this.nodeHeight/2 + this.prefabHeight)){
                    //撞到地面了
                    //停止方块的移动记录下当前处于哪一行那一列并改变这一行这一列的背景方格的状态
                    this.changeBackBlockStatus();
                    return false;
                }
            }
                //如果最大行下方方格的状态为1的话就是不能下落
                if(this.backGroundArr[rowN + 1][colN].isFilled === 1){
                    //将对应的背景方格的状态改为1
                    this.changeBackBlockStatus();
                    return false;
                }else{
                    return true;
                }
            }else{
                this.changeBackBlockStatus();
                return false;
            }
            
        }
        return true;
    },
    //改变背景方格的状态
    changeBackBlockStatus : function(){
        var row = this.getRow();
        cc.log("row is " + row);
        var col = this.getColumn();
        cc.log("col is " + col);
        //将背景方格的属性修改为1
        for(var m = 0;m<row.length;m++){
            // cc.log(this.backGroundArr[row[m]]);
            for(var n = 0;n<col.length;n++){
                cc.log(this.backGroundArr[row[m]][col[n]]);
                //设置对应格的数据为1
                this.backGroundArr[row[m]][col[n]].isFilled = 1;
                cc.log(this.backGroundArr[row[m]][col[n]].isFilled);
            }
        }
        //固定完之后重新生成随机预制体节点
        this.nodeArr = this.generateNext(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
    },
    /**
       检测是否可以向左移动
    **/
    CheckIsLeft : function(){
        //获得当前的行数
        var row = this.getRow();
        //获得当前的列数
        var col = this.getColumn();
        //每下降一个格检测一次
        //如果是横着的条就检测下面三个背景方格的属性isFilled是不是为1如果为1的话不允许下落
        if(row.length === 1){
            //遍历它的数组的状态
            //遍历三个行对应的左一行是否为1
            var nc = col[0];
            //当列数是左边界是不用判断左边的背景网格的状态的
            if(nc != 0){
                //判断一下下一行的状态
                if(this.backGroundArr[row[0]][nc - 1].isFilled === 1){
                    //不允许向左移动
                    return false;
                }
            }
        }else if(col.length === 1){
            //如果列的个数为1的话
            for(var m = 0;m<row.length;m++){
                //获得行数
                var mr = row[m];
                //只要一个方格的左边的背景方格的状态为1的话就停止移动
                if(this.backGroundArr[mr][col[0] - 1].isFilled === 1){
                    //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                    return false;
                }
            }
        }
        return true;
    },
    //检测是否可以向右移动
    CheckIsRight : function(){
        //获得当前的行数
        var row = this.getRow();
        //获得当前的列数
        var col = this.getColumn();
        //每下降一个格检测一次
        //如果是横着的条就检测下面三个背景方格的属性isFilled是不是为1如果为1的话不允许下落
        if(row.length === 1){
            //遍历它的数组的状态
            //遍历三个行对应的左一行是否为1
            var nc = col[2];
            //当列数是左边界是不用判断左边的背景网格的状态的
            if(nc != 5){
                //判断一下下一行的状态
                if(this.backGroundArr[row[0]][nc + 1].isFilled === 1){
                    //不允许向左移动
                    return false;
                }
            }
        }else if(col.length === 1){
            //如果列的个数为1的话说明是竖条的形状
            for(var m = 0;m<row.length;m++){
                //获得行数
                var mr = row[m];
                //只要一个方格的左边的背景方格的状态为1的话就停止移动
                if(this.backGroundArr[mr][col[0] + 1].isFilled === 1){
                    //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                    return false;
                }
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
        switch(currentCol){
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
    }
    //快速下落:横条快速下落，竖条快速下落
    quickDown : function(){
        //获得当前列
        var currentCol = this.getColumn();
        //获得当前行
        var currentRow = this.getRow();
        //获得最大行
        var currentMaxRow = currentRow[2];
        //获取最大值对应的坐标
        var maxRowLocationY = this.getLocationByRow(currentMaxRow);
        var colNu = this.getLocationByCol(currentCol);
        var originPMax = cc.p(colNu,maxRowLocationY);
        var originPMaxSO = cc.p(colNu,maxRowLocationY-100);
        var originPMaxSO1 = cc.p(colNu,maxRowLocationY-200);
        //从最大值下面的一行开始遍历看看背景方格中的属性是否为1
        var targetY = this.getLocationByRow(this.checkGridIsOne(currentMaxRow,currentCol));
        var downAction = cc.moveTo(0.5,cc.p(colNu,targetY));
        var downActionOfpre = cc.moveTo(0.5,cc.p(colNu,targetY - 100));
        var downActionOfPreP = cc.moveTo(0.5,cc.p(colNu,targetY - 200));
        //顺序执行动作
        cc.sequence(downAction,downActionOfpre,downActionOfPreP);
        

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
        }
    }
});
