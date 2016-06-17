# 响应式设计

描述响应式设计，CSS Media Query只是响应式设计的一种方法。

### Media Query

```@css
@media (max-width: 767px) {
	p {
		color:blue;
	}
}
```
()中间的是媒介的属性，如果满足则就会应用media中的样式。最常用的方式是使用设备的宽度来指定不同的媒介。