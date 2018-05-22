// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //获取地板预制体元素
        groundPrefab:{
            default:null,
            type:cc.Prefab
        },
        //获取地板父节点
        groundParent:{
            default:null,
            type:cc.Node
        }
        ,
        //获取L形状方块预制体
        prefabL:{
            default:null,
            type:cc.Prefab
        },
         //获取正方形方块预制体
         prefabSquare:{
            default:null,
            type:cc.Prefab
        },
         //获取Z形状方块预制体
         prefabZ:{
            default:null,
            type:cc.Prefab
        }, //获取长条形状方块预制体
        prefabLong:{
            default:null,
            type:cc.Prefab
        },
         //获取T形状方块预制体
         prefabT:{
            default:null,
            type:cc.Prefab
        },
        //获取俄罗斯方块父节点
        blockParent:{
            default:null,
            type:cc.Node
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化背景子节点
        this.groundChild=[];
        for(var i=0;i<=9;i++)
         {
             this.groundChild[i]=[];
         }
         //初始化当前俄罗斯方块颜色
         this.stringColor="";
          //初始化当前俄罗斯方块形状
          this.stringShape="";
           //初始化当前俄罗斯方块角度
         this.stringRotate="";
         //生成游戏背景
         this.GetGround();
         this.GetBlock();
      
    },
    start () {
    },
   
    //生成背景
    GetGround:function(){
        for(var i=0;i<=9;i++)
        {
            for(var j=0;j<=19;j++)
            {
                var groundNode=cc.instantiate(this.groundPrefab);
                groundNode.parent=this.groundParent;
                groundNode.setPosition(cc.p(i*65,j*65));
                this.groundChild[i].push(groundNode);
            }
        }    
    },
    //生成方块
    CopyBlock:function(prefabLBlock){
          this.nodeBlock=cc.instantiate(prefabLBlock);
          this.nodeBlock.parent=this.blockParent;
          this.nodeBlock.setPosition(227.5+cc.random0To1()*625,2017.5);
        //   this.nodeBlock.setPosition(300,300);
         cc.log(this.nodeBlock);
    },
     //判断方块颜色
    IsColor:function(stringColor,nColor){
        switch(stringColor[nColor])
        {
            case "blue":  
                     this.ChangeColor(20,10,140,255);
                     break;
            case "green":    
                     this.ChangeColor(20,250,0,255);
                      break;
            case "red":
                     this.ChangeColor(250,0,50,255);
                      break;
        }    
    },
    //改变方块颜色
    ChangeColor:function(a,b,c,d){
        var  nodeBlockChild=this.nodeBlock.getChildren();
        for(var i=0;i<=nodeBlockChild.length-1;i++)
        {
            nodeBlockChild[i].setColor(cc.color(a,b,c,d));  
        }  
    },
    //判断方块形状
    IsShape:function(stringShape,nShape){
      
        switch(stringShape[nShape])
        {
            case "T":
                    //生成方块
                     this.CopyBlock(this.prefabT);
                     //判断方块颜色
                     this.IsColor(this.colorBlock,this.nColor);
                     this.IsRotate(this.rotateBlock,this.nRotate);        
                     break;
            case "L":    
                      this.CopyBlock(this.prefabL); 
                      //判断方块颜色
                      this.IsColor(this.colorBlock,this.nColor);   
                      this.IsRotate(this.rotateBlock,this.nRotate);     
                      break;
            case "Long":
                     this.CopyBlock(this.prefabLong);
                     //判断方块颜色
                     this.IsColor(this.colorBlock,this.nColor);   
                     this.IsRotate(this.rotateBlock,this.nRotate);     
                      break;
            case "Z":
                     this.CopyBlock(this.prefabZ);
                     //判断方块颜色
                     this.IsColor(this.colorBlock,this.nColor);   
                     this.IsRotate(this.rotateBlock,this.nRotate);     
                      break;
            case "Square":
                      this.CopyBlock(this.prefabSquare);
                       //判断方块颜色
                     this.IsColor(this.colorBlock,this.nColor);    
                     this.IsRotate(this.rotateBlock,this.nRotate);     
                      break;
        }    
    },
    //改变角度
    ChangeRotate:function(angle){
         this.nodeBlock.rotation=angle;
    },
     //判断方块角度
     IsRotate:function(stringRotate,nRotate){
        switch(stringRotate[nRotate])
        {
            case "0":
                     this.ChangeRotate(0);
                     break;
            case "180":  
                      this.ChangeRotate(180);  
                      break;
        }    
    },
    //随机生成俄罗斯方块
    GetBlock:function(){
        //声明颜色数组
          this.colorBlock=["blue","green","red"];
        //声明形状数组
         this.shapeBlock=["T","L","Long","Z","Square"];
        //声明角度数组
         this.rotateBlock=["0","180"]; 
         this.nColor=Math.floor(cc.random0To1()*3);
        this.nShape=Math.floor(cc.random0To1()*5);
        this.nRotate=Math.floor(cc.random0To1()*2);
        this.IsShape(this.shapeBlock,this.nShape);
    },
    update (dt) {
      
    },
});
