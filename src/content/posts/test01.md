---
title: "这是一篇测试文章"
published: 2025-08-08
description: '一篇测试文章，包含 DFS 全排列代码示例。'
category: '其他'
draft: false
---

## 这是标题

In this letter, you should give one of your friends some advice about how to improve the presentation he is going to take next month. You should write at least 120 words but no more than 180 words

你是一名大一新生,你的好朋友将要在下个月做一个演讲。请你用英语写一封信,对于如何去改善他的演讲提出一些建议。使用简单易懂的单词,词数在120到180以内。

```
#define _CRT_SECURE_NO_WARNINGS 1
#include<bits/stdc++.h>
using namespace std;

const int N = 10;
int n;
int path[N];
bool st[N];

void dfs(int u) {
if (u == n) {
for(int i = 0; i < n; i++) {
cout << path[i] << " ";
}
cout << endl;
return;
}

for (int i = 1; i <= n; i++) {
if (!st[i]) {
path[u] = i;
st[i] = true;
dfs(u + 1);
st[i] = false;
}
}

}

int main() {
cin >> n;

dfs(0);

return 0;
}
```
