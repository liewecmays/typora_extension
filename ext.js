/*
- Typora拡張 -
*/

// 脚注番号を[]に入れる
Array.prototype.map.call(document.querySelectorAll("sup a"), node => {
    node.innerHTML = "[" + node.innerHTML + "]";
});

// 蛍光ペンのスタイルを灰色文字に上書き
Array.prototype.map.call(document.querySelectorAll("li mark"), node => {
    node.parentNode.classList.add("has-gray-mark");
});
Array.prototype.map.call(document.querySelectorAll("li p mark"), node => {
    node.parentNode.parentNode.classList.add("has-gray-mark");
});

// マクロ定義部分を隠す
Array.prototype.map.call(document.querySelectorAll("p begin-defmacro"), node => {
    let start = node.parentNode.nextElementSibling;
    node.parentNode.remove();
    let current = start.nextElementSibling;
    let wrapper = document.createElement("div");
    wrapper.classList.add("defmacro-box");
    wrapper.append(start.cloneNode(true));

    while(current.childNodes[0].tagName != "END-DEFMACRO"){
        next = current.nextElementSibling;
        frame_content.append(current);
        current = next;
    }
    current.remove();
    start.replaceWith(wrapper);
});
