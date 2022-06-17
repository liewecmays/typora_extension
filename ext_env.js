/*
- Typora拡張: 環境 -
*/

// 環境の変換
let env_names = ["def", "thm", "cor", "lem", "prop", "rmk"];
Array.prototype.map.call(document.querySelectorAll("p strong:first-child span:first-child"), node => {
    let start = node.parentNode.parentNode;
    let current = start.nextElementSibling;
    let wrapper = document.createElement("div");
    wrapper.classList.add("myenv");

    let flg = false;
    let str = node.innerHTML;
    let len = node.parentNode.childNodes.length;
    let reg;

    if(len == 1){ // 文字列のみ
        for(env of env_names){
            reg = new RegExp("^(@" + env + "\\.)( )?((\\d)+\\.)*( )?(\\[.+\\])?$");
            if(str.match(reg)){
                flg = true;
                wrapper.classList.add("myenv-" + env);
                node.innerHTML = str.slice(1, 2).toUpperCase() + str.slice(2);
                break;
            }
        }
    }else{ // インライン数式を含む
        for(env of env_names){
            reg = new RegExp("^(@" + env + "\\.)( )?((\\d)+\\.)*( )?\\[$");
            if(str.match(reg) && node.parentNode.childNodes[len-1].innerHTML.match(/^.+\]$/)){
                flg = true;
                wrapper.classList.add("myenv-" + env);
                node.innerHTML = str.slice(1, 2).toUpperCase() + str.slice(2);
                break;
            }
        }
    }

    if(flg){
        start.classList.add("myenv__top");
        wrapper.append(start.cloneNode(true));
        
        if(current.tagName == "UL" || current.tagName == "OL"){ // 直後のリストは追加
            wrapper.append(current);
        }else{
            while(current.classList.contains("mathjax-block")){ // 直後の数式ブロックを全て追加
                let next = current.nextElementSibling;
                wrapper.append(current);
                current = next;
                if(current == null) break; // 直後に何もない場合は終了
            }
        }
        start.replaceWith(wrapper);
    }
});

// 自作タグによる環境の変換
let tag_names = ["side", "box", "supp"];
for(tag of tag_names){
    Array.prototype.map.call(document.querySelectorAll("p begin-" + tag), node => {
        let start = node.parentNode.nextElementSibling;
        node.parentNode.remove();
        let current = start.nextElementSibling;
        let wrapper = document.createElement("div");
        wrapper.classList.add("myenv", "myenv-" + tag);

        start.classList.add("myenv__top");
        wrapper.append(start.cloneNode(true));

        let side_level = 0; // 入れ子になった場合の階層の深さ
        while(true){
            if(current.childNodes[0].tagName == "END-" + tag.toUpperCase()){
                if(side_level == 0){
                    break;
                }else{
                    side_level -= 1;
                }
            }
            if(current.childNodes[0].tagName == "BEGIN-" + tag.toUpperCase()) side_level += 1;
            
            next = current.nextElementSibling;
            wrapper.append(current);
            current = next;
        }

        current.remove();
        start.replaceWith(wrapper);
    });
}
