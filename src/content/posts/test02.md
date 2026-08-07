---
title: "这是一篇凑数的文章(也是测试)"
published: 2025-08-08
description: '一篇测试文章，包含 Java 拼图游戏完整源码。'
category: '其他'
draft: false
---

```
package com.yu.ui;

import javax.swing.*;
import javax.swing.border.BevelBorder;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.Random;

public class GameJFrame extends JFrame implements KeyListener, ActionListener {

//创建二维数组,用来存放图片的编号
int[][] data = new int[4][4];
//图片偏移量
int offsetX = 83;
int offsetY = 134;
//空白方块在二维数组的位置
int zeroX ;
int zeroY ;
//当前展示图片的路径
String ImagePath = "image/animal/animal3/";
//定义一个二维数组用来存储胜利时的坐标数据
int[][] win = new int[][]{
{1,2,3,4},
{5,6,7,8},
{9,10,11,12},
{13,14,15,0}
};
//用于计步
int step = 0;

//创建菜单选项下的条目选项
JMenuItem replayItem = new JMenuItem("重新游戏");
JMenuItem reLoginItem = new JMenuItem("重新登录");
JMenuItem closeItem = new JMenuItem("关闭游戏");

JMenuItem accountItem = new JMenuItem("作者");

public GameJFrame() {
//初始化界面
initJFrame();

//初始化菜单
initJMenuBar();

//初始化数据(打乱图片)
initData();

//初始化图片
initImage();

//让界面显示
this.setVisible(true);
}

private void initData() {
//定义一个数组,存放图片的编号
int[] numbers = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15};
Random r = new Random();
//打乱数组
for (int i = 0; i < numbers.length; i++) {
int index = r.nextInt(numbers.length);
int temp = numbers[i];
numbers[i] = numbers[index];
numbers[index] = temp;
}

//将打乱的数组赋值给二维数组
for(int i = 0 ;i<numbers.length;i++){
if(numbers[i] == 0) {
zeroX = i/4;
zeroY = i%4;
}
data[i/4][i%4] = numbers[i];
}
}

//初始化图片
private void initImage() {
//清空原本已经出现的图片
this.getContentPane().removeAll();

//做胜利判断
if(isWin()){
//显示胜利图片
JLabel winJlabel = new JLabel(new ImageIcon("image/win.png"));
winJlabel.setBounds(203,283,197,73);
this.getContentPane().add(winJlabel);
}

//显示步数
JLabel stepCount = new JLabel("步数:"+step);
stepCount.setBounds(50,30,100,20);
this.getContentPane().add(stepCount);

for (int i = 0; i < 4; i++) {
for(int j = 0 ; j < 4 ; j++){
//获取图片的编号
int num = data[i][j];
//创建一个JLabel对象(管理容器)
JLabel jLabel = new JLabel(new ImageIcon(ImagePath+num+".jpg"));
//指定图片的位置
jLabel.setBounds(105*j+offsetX,105*i+offsetY,105,105);
//给图片添加边框
jLabel.setBorder(new BevelBorder(BevelBorder.RAISED));//斜面边框(RAISED这个常量的值是0)
//把管理容器添加到界面当中
this.getContentPane().add(jLabel);
}
}
//细节：先加载的图片会在上方，后加载的图片会在下方，所以要把背景图片放在最下面
//添加背景图片
JLabel backGround = new JLabel(new ImageIcon("image/background.png"));
backGround.setBounds(40, 40, 508, 560);
this.getContentPane().add(backGround);

//刷新界面
this.getContentPane().repaint();

}

private void initJMenuBar() {
//创建菜单栏
JMenuBar jMenuBar = new JMenuBar();
//创建菜单选项
JMenu fuctionJMenu = new JMenu("功能");
JMenu aboutJMenu = new JMenu("关于");

//将每一个条目添加到菜单选项当中
fuctionJMenu.add(replayItem);
fuctionJMenu.add(reLoginItem);
fuctionJMenu.add(closeItem);

aboutJMenu.add(accountItem);

//为每一个条目添加事件监听器
replayItem.addActionListener(this);
reLoginItem.addActionListener(this);
closeItem.addActionListener(this);
accountItem.addActionListener(this);

//将菜单选项添加到菜单栏
jMenuBar.add(fuctionJMenu);
jMenuBar.add(aboutJMenu);

//给整个界面设置菜单
this.setJMenuBar(jMenuBar);
}

private void initJFrame() {
//设置界面的宽高
this.setSize(603, 680);
//设置界面标题
this.setTitle("拼图游戏 v1.0");
//设置界面置顶
this.setAlwaysOnTop(true);
//设置界面居中(窗口对于屏幕的位置)
this.setLocationRelativeTo(null);
//设置关闭模式(使其关闭窗口时停止)
this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

//取消对于组件的居中放置(只有取消了才会按照XY轴的方式添加组件)
this.setLayout(null);

//给整个界面添加键盘监听器
this.addKeyListener(this);

}

@Override
public void keyTyped(KeyEvent e) {

}

//按下不松时会调用这个方法
@Override
public void keyPressed(KeyEvent e) {
if(isWin()) return;

int code = e.getKeyCode();
//A 65
if(code == 65){
//把界面中所有的图片删除
this.getContentPane().removeAll();
//加载完整图片
JLabel all = new JLabel(new ImageIcon(ImagePath+"all.jpg"));
all.setBounds(83, 134, 420, 420);
this.getContentPane().add(all);
//加载背景图片
JLabel backGround = new JLabel(new ImageIcon("image/background.png"));
backGround.setBounds(40, 40, 508, 560);
this.getContentPane().add(backGround);
//刷新界面
this.getContentPane().repaint();
}
}

@Override
public void keyReleased(KeyEvent e) {
//做胜利判断
if(isWin()){
return;
}

//对上下左右键进行处理
//左：37，上：38，右：39，下：40
int code = e.getKeyCode();
if(code == 37){
//System.out.println("左");
if(zeroY == 3) return;
data[zeroX][zeroY]=data[zeroX][zeroY+1];
data[zeroX][zeroY+1]=0;
zeroY++;
step++;
initImage();
}else if(code == 38){
//System.out.println("上");
if(zeroX == 3) return;
//逻辑：
//把空白方块下方的图片往上移动
//zeroX zeroY 空白方块的位置
//zeroX+1 zeroY 空白方块下方的图片的位置
//把空白方块下方的图片的编号赋值给空白方块
data[zeroX][zeroY]=data[zeroX+1][zeroY];
data[zeroX+1][zeroY]=0;
zeroX++;
step++;
//刷新界面
initImage();

}else if(code == 39){
//System.out.println("右");
if(zeroY == 0)return;
data[zeroX][zeroY]=data[zeroX][zeroY-1];
data[zeroX][zeroY-1]=0;
zeroY--;
step++;
initImage();
}else if(code == 40){
//System.out.println("下");
if(zeroX == 0)return;
data[zeroX][zeroY]=data[zeroX-1][zeroY];
data[zeroX-1][zeroY]=0;
zeroX--;
step++;
initImage();
}else if(code == 65){
initImage();
}else if(code == 87){
data=new int[][]{
{1,2,3,4}
,{5,6,7,8}
,{9,10,11,12}
,{13,14,15,0}
};
initImage();
}
}

//判断data数组是否和win数组相同
public boolean isWin(){
for(int i=0;i<4;i++){
for(int j=0;j<4;j++){
if(data[i][j]!=win[i][j]){
return false;
}
}
}
return true;
}

@Override
public void actionPerformed(ActionEvent e) {
//获取事件源(被点击的菜单项)
Object obj = e.getSource();
if(obj == replayItem){
//调试信息
System.out.println("重新游戏");

//计步器清零
step = 0;
//初始化数据(打乱图片)
initData();
//初始化图片
initImage();

}else if(obj == reLoginItem){
System.out.println("重新登录");
//关闭当前窗口
this.setVisible(false);
//打开登录窗口
new LoginJFrame();
}else if(obj == closeItem){
System.out.println("关闭游戏");
System.exit(0);
}else if(obj == accountItem){
System.out.println("作者");
//弹出作者信息框
JDialog dialog = new JDialog(this,"作者信息");
JLabel label = new JLabel(new ImageIcon("image/about.png"));
label.setBounds(0,0,258,258);
dialog.getContentPane().add(label);
dialog.setSize(344,344);
dialog.setAlwaysOnTop(true);
dialog.setLocationRelativeTo(null);
//弹窗不关闭则无法操作下面的界面
dialog.setModal(true);
//显示弹窗
dialog.setVisible(true);
}
}
}
```
