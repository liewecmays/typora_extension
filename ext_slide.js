/*
- Typora拡張: スライド -
*/

document.documentElement.classList.add("slide");
document.documentElement.style.setProperty('--color-primary', '77, 90, 175');

// add cover
Array.prototype.map.call(document.querySelectorAll("p slide-cover:first-child"), node => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("frame", "slide-cover", "frame-no-pagenum");

    let title = document.createElement("div");
    title.classList.add("cover-title");
    title.innerHTML = node.dataset.title;
    wrapper.append(title);

    let author = document.createElement("div");
    author.classList.add("cover-author");
    author.innerHTML = node.dataset.author;
    wrapper.append(author);

    let date = document.createElement("div");
    date.classList.add("cover-date");
    date.innerHTML = node.dataset.date;
    wrapper.append(date);

    node.parentNode.replaceWith(wrapper);
});

// scan sections
let section_counter = 0; // 0-indexed
let section_info = [];
Array.prototype.map.call(document.querySelectorAll("h1"), h1 => {
    h1.dataset.id = section_counter;
    section_counter += 1;
    section_info.push([h1.id, Array.from(h1.cloneNode(true).childNodes)]);
});

if(section_counter > 0){
    // create toc
    let toc = document.createElement("div");
    toc.classList.add("frame", "slide-toc");
    let toc_list = document.createElement("ul");
    toc_list.classList.add("slide-toc-list");
    for(let [id, sec_name] of section_info){
        let li = document.createElement("li");
        let a = document.createElement("a"); // internal link
        a.setAttribute("href", "#" + id);
        for(let el of sec_name){
            a.append(el);
        }
        li.append(a);
        toc_list.append(li);
    }
    toc.classList.add("frame-no-pagenum");
    toc.append(toc_list);

    // top toc
    Array.prototype.map.call(document.querySelectorAll("p slide-toc:first-child"), node => {
        node.parentNode.replaceWith(toc.cloneNode(true));
    });

    // replace h1 with toc
    Array.prototype.map.call(document.querySelectorAll("h1"), h1 => {
        let toc_copy = toc.cloneNode(true);
        // toc_copy.id = h1.id;
        toc_copy.classList.add("slide-section-toc");
        toc_copy.firstChild.childNodes[h1.dataset.id].classList.add("current-section");
        // h1.removeAttribute("id");
        h1.insertAdjacentElement("afterend", toc_copy);
    });
}

// frame
Array.prototype.map.call(document.querySelectorAll("p begin-frame:first-child"), node => {
    let start = node.parentNode.nextElementSibling;
    start.classList.add("frame-title");
    node.parentNode.remove();

    let current = start.nextElementSibling;
    let wrapper = document.createElement("div");
    wrapper.classList.add("frame");
    wrapper.append(start.cloneNode(true));

    let frame_content = document.createElement("div");
    frame_content.classList.add("frame-content");
    
    while(!current.hasChildNodes() || current.childNodes[0].tagName != "END-FRAME"){
        next = current.nextElementSibling;
        frame_content.append(current);
        current = next;
    }
    current.remove();

    wrapper.append(frame_content);
    start.replaceWith(wrapper);
});

// page counter
let page_num = document.querySelectorAll(".frame").length;
let page_counter = 1;
Array.prototype.map.call(document.querySelectorAll(".frame"), frame => {
    let footer = document.createElement("p");
    footer.classList.add("frame-footer");
    footer.innerHTML = page_counter.toString() + "/" + page_num.toString();
    page_counter++;
    frame.append(footer);
});