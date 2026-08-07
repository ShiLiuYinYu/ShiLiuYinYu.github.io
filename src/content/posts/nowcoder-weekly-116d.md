---
title: "牛客周赛116-D-小红的区间相交"
published: 2025-11-04
description: '牛客周赛 Round 116 D 题解，判断多个区间是否两两相交。'
image: '/images/2025/11/nowcoder-weekly-116d-diagram1.png'
tags: [C_C++, 算法]
category: '题解'
draft: false
---

原题链接：[D-小红的区间相交_牛客周赛 Round 116](https://ac.nowcoder.com/acm/contest/120553/D)

由题目内容可知，我们要判断n个区间是否均是两两相交。

很明显，我们会想到一种情况(其实是必须是这个样子)，假设我们有四个区间

如下图所示：

![](/images/2025/11/nowcoder-weekly-116d-diagram1.png)

我们不难想到，如果我们对输入的n个区间进行排序，按照L升序排列的结果(这个结果指的是排序后的区间顺序)应该与按照R升序排列的结果一样。也就是`maxL <= minR`

但是，有一种情况要特判，如下图：

![](/images/2025/11/nowcoder-weekly-116d-diagram2.png)

这种情况也满足`maxL <= minR`，但是`maxL` 和 `minR`来自同一个区间，我们在这里**做特判**就行。

以下是题解代码：

```
#define _CRT_SECURE_NO_WARNINGS
#include <bits/stdc++.h>
#define IOS ios::sync_with_stdio(0), cin.tie(0), cout.tie(0)
#define x first
#define y second
#define pb push_back
#define pf push_front
#define ssize(x) (int)(x.size())
#define LF "\n"

using namespace std;

typedef long long LL;
typedef pair<int, int> PII;
typedef pair<LL, LL> PLL;
const int N = 1e5 + 10;
const int dx[4] = { 0, 1, 0, -1 };
const int dy[4] = { 1, 0, -1, 0 };

typedef struct {
int l;
int r;
int id;
}qj;

bool isSame(qj a, qj b) {
return a.id == b.id;
}

bool cmpByL(qj a, qj b) {
if(a.l == b.l) return a.r < b.r;
return a.l < b.l;
}

bool cmpByR(qj a, qj b) {
if(a.r == b.r) return a.l < b.l;
return a.r < b.r;
}

void slove() {
int n;
cin >> n;
vector<qj> qjsA, qjsB;
for (int i = 0; i < n; i++) {
int l, r;
cin >> l >> r;
qjsA.pb({ l, r, i + 1 });
qjsB.pb({ l, r, i + 1 });
}
sort(qjsA.begin(), qjsA.end(), cmpByL);
sort(qjsB.begin(), qjsB.end(), cmpByR);

bool ABIsSame = true;

for (int i = 0; i < n; i++) {
if (!isSame(qjsA[i], qjsB[i])) {
ABIsSame = false;
break;
}
}

int MaxL = qjsA[n - 1].l;
int MinR = qjsB[0].r;

if (isSame(qjsA[n - 1], qjsB[0])) {
cout << "No" << LF;
return;
}
else if (MaxL <= MinR && ABIsSame) {
cout << "Yes" << LF;
return;
}
else {
cout << "No" << LF;
return;
}
}

int main() {
IOS;
int T = 1;
cin >> T;
while (T--) {
slove();
}
return 0;
}
```

说说代码思路，代码中我们创建了两个`vector`容器(你可以理解为动态数组)，存储的内容均为n个区间，并且内容完全相同。

然后我们分别对这两个容器进行升序排序，A容器以区间的L大小进行排序，**如果L相同则以R进行排序(很重要)**。B容器同理，优先以R升序，R相同则以L升序。然后找出maxL和minR(最大的起点和最小的终点)。

然后就是检查排完序后的两个容器中的区间顺序是否相同，这里用一个布尔类型的变量保存结果。

这时就要进入判断部分了，我们先要判断**maxL**和**minR**是否来自同一个区间，也就是上文说的要特判的地方，然后就是判断条件`maxL <= minR` 和 `ABIsSame`是否满足。

看到这里，我必须要解释一种情况，也就是**输入的所有区间都相同**的情况，这个代码为什么也会输出”Yes”。

![](/images/2025/11/nowcoder-weekly-116d-diagram3.png)

我们来看结构体qj的代码

```
typedef struct {
int l;
int r;
int id; //这个地方很重要
}qj;
```

有一个成员属性是id，用来**标记**此区间是第几个输入的，同时也是判断两个区间是否**相同**的重要变量。

```
bool isSame(qj a, qj b) {
return a.id == b.id;
}
```

我们现在来模拟一遍：

有一组完全相同的区间数据输入了程序。在输入时，程序**为每个输入的区间进行了id标记。**

然后就是排序，因为 sort 函数这里是稳定的，而且完全不用排序。所以这里排完序后的A、B容器里的(qj)区间**元素顺序**是完全相同的。

然后就来到了判断的地方：

```
if (isSame(qjsA[n - 1], qjsB[0])) {
cout << "No" << LF;
return;
}
else if (MaxL <= MinR && ABIsSame) {
cout << "Yes" << LF;
return;
}
else {
cout << "No" << LF;
return;
}
```

**注意**这里的`isSame(qjsA[n - 1], qjsB[0])`**这里会返回`false`。**

**因为`qjsA[n - 1], qjsB[0]`这两个区间(qj)的id属性不相同**。

最后，我来说说排序的问题，就拿A容器的排序来说吧。如果我们**在L相同的情况下没有特殊处理**。就像下面这样：

```
bool cmpByL(qj a, qj b) {
return a.l < b.l;
}
```

这样就相当于**没有排序**。

我们用一个样例：

```
1
3
1 2
1 4
1 3
```

如果我们排序的时候在L或者R相同的情况下没有特殊处理，就会**导致排完序后的A、B中的区间顺序不相同**。这里就会输出”No”。
