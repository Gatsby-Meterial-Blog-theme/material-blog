---
title: "javascript typehinting"
date: "2019-07-26"
category: "Javascript"
tags: ["Javascript", "타입힌트", ]
private: false
log: [
  {date : "2019-07-26", msg: "최조 작성"},
  ]
---
Javascript`에서는 변수의 타입을 선언하지 않아 타입과 관련된 에러가 많이 발생할 수 있다. 이를 방지하고자 타입 힌트를 사용하는 데 사용방법은 다음과 같다.

---
```javascript
/**
* @return {undefined}
* @param {{foo: string, bar: number}} obj
*/
function func(obj) {
    var foo = obj.foo;
    var bar = obj.bar;
    //obj. 여기까지만 타이핑하면 프로퍼티 foo, bar가 존재함을 알 수 있다!
}
```
---

또한 제네릭 타입을 이용하여 타입 힌트를 줄 수도 있다.

---
```javascript
/**
 * @template T
 */

/**
 * @param {T} arg
 * @return {T}
 */
function func(arg) {
    return arg;
}
```
---

참고사항으로 타입 힌트 일 뿐이므로 코딩시에 타입에 관한 힌트를 얻을 수 있을 뿐, 타입 힌트에 의해 에러가 발생하지는 않는다.  

참조 : <https://bblog.tistory.com/319>