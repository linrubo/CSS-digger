// 从 https://www.w3.org/TR/css-2020/ 获取属性列表
const properties = document.querySelector('#properties+div>ul').children;
const list = Array.from(properties).map(item => {
	const node = item.firstChild;
	let result;

	switch (node.nodeType) {
	case 1:
		result = node.innerText;
		break;
	case 3:
		result = node.nodeValue.trim();
		break;
	default:
	}

	return result;
});

console.log(JSON.stringify(list.slice(1), null, 4));