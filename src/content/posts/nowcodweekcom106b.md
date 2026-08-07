---
title: "小苯的数字折叠-牛客周赛106B"
published: 2025-08-24
description: '牛客周赛106B题解，大数回文数字折叠，C++ 溢出后用 Java BigInteger 解决。'
image: '/images/2025/08/20250824-e1756038478924.jpg'
tags: [C_C++, Java, 算法]
category: '题解'
draft: false
---

[题目链接](https://ac.nowcoder.com/acm/contest/116002/B)

这是爆掉的C++(long long 爆了)

```
#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
using namespace std;

long long reverse(long long n) {
long long rev = 0;
while (n > 0) {
int digit = n % 10;
rev = rev * 10 + digit;
n /= 10;
}
return rev;
}

bool isPalindrome(long long n) {
long long rev = reverse(n);
return n == rev;
}

int main() {
int T;
cin >> T;
while (T--) {
long long n;
int k;
cin >> n >> k;
bool found = false;
int steps = 0;
for (int i = 0; i < k; i++) {
long long nx = reverse(n);
long long temp = n + nx;
if (isPalindrome(temp)) {
n = temp;
steps = i + 1;
found = true;
break;
}
n = temp;
}
if (found) {
cout << n << " " << steps << endl;
}
else {
cout << n << " " << -1 << endl;
}
}
return 0;
}
```

博主很懒，所以干脆换成了Java

```

import java.math.BigInteger;
import java.util.Scanner;

public class Main {

public static BigInteger reverse(BigInteger n) {
String str = n.toString();
StringBuilder sb = new StringBuilder();
for (int i = str.length() - 1; i >= 0; i--) {
sb.append(str.charAt(i));
}
int st = 0;
while (st < sb.length() - 1 && sb.charAt(st) == '0') {
st++;
}
return new BigInteger(sb.substring(st));
}

public static boolean isPalindrome(BigInteger n) {
String str = n.toString();
int l = 0;
int r = str.length() - 1;
while (l < r) {
if (str.charAt(l) != str.charAt(r)) {
return false;
}
l++;
r--;
}
return true;
}

public static void main(String[] args) {
Scanner scanner = new Scanner(System.in);
int T = scanner.nextInt();

for (int t = 0; t < T; t++) {
BigInteger n = scanner.nextBigInteger();
int k = scanner.nextInt();
boolean found = false;
int steps = 0;
if (isPalindrome(n)) {
System.out.println(n + " 0");
continue;
}
for (int i = 0; i < k; i++) {
BigInteger reversed = reverse(n);
n = n.add(reversed);
steps = i + 1;
if (isPalindrome(n)) {
found = true;
break;
}
}
if (found) {
System.out.println(n + " " + steps);
} else {
System.out.println(n + " -1");
}
}

}
}
```
