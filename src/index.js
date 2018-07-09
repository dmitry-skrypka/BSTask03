let tagArray = [],
    needTOfind = {},
    DeletedPost = [],
    visited;


function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function clear(parentElem) {

    let element = parentElem;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

}


function Render(json) {

    let pageCounter = 0;
    clear(ul);


    json.forEach(function (post) {

        if (DeletedPost.includes(post.id.toString())) {

            return;
        }

        let li = createNode("li"),
            img = createNode("img"),
            title = createNode("div"),
            description = createNode("div"),
            DateCreated = createNode("div"),
            tags = createNode("div"),
            delTag = createNode("div");


        li.setAttribute("class", "postLi");
        li.setAttribute("id", post.id);
        img.setAttribute("class", "posImg");
        title.setAttribute("class", "title");
        description.setAttribute("class", "description");
        DateCreated.setAttribute("class", "Date");
        tags.setAttribute("class", "tags_container");
        delTag.setAttribute("class", "delete");
        delTag.textContent = "Delete";

        delTag.addEventListener("click", ToggleDeleteTags);


        img.src = post.image;
        title.innerHTML = post.title;
        description.innerHTML = post.description;
        // DateCreated.innerHTML = post.createdAt;
        DateCreated.innerHTML = new Date(post.createdAt);

        let posttags = post.tags;

        posttags.forEach(function (item) {
            tagArray.push(item);
            let tag = createNode("span");
            tag.setAttribute("class", "tag");
            append(tags, tag);
            tag.innerHTML = item;
        });

        // buildList(title, description, img, DateCreated, tags, li);
        append(li, delTag);
        append(li, title);
        append(li, description);
        append(li, img);
        append(li, DateCreated);
        append(li, tags);
        append(ul, li);


        pageCounter++;

        if (pageCounter <= 10) {
            li.classList.add('p10');
        } else if (pageCounter > 10 || pageCounter <= 20) {
            li.classList.add('p20', 'hiden');

        } else if (pageCounter > 20 || pageCounter <= 30) {
            li.classList.add('p30', 'hiden');
        } else if (pageCounter > 30 || pageCounter <= 40) {
            li.classList.add('p40', 'hiden');
        } else if (pageCounter > 40 || pageCounter <= 50) {
            li.classList.add('p50', 'hiden');

        }


    });


}


function sortByDate(a, b) {
    let dateA = new Date(a.createdAt),
        dateB = new Date(b.createdAt);

    if (dateA > dateB) {
        return -1;
    }
    if (dateA < dateB) {
        return 1;
    }

    return 0;
}

function sortbyTagsThenDate(a, b) {
    let A = a.counter,
        B = b.counter;

    if (A > B) {
        return -1;
    }
    if (A < B) {
        return 1;
    }

    return sortByDate(a, b);
}

const ul = document.getElementById("PostList");
const url = "https://api.myjson.com/bins/152f9j";


function uniqueTags(arr) {
    let tagArray = Array.from(new Set(arr)),
        tagfield = document.getElementById("tags");

    tagArray.forEach(function (x) {
        let tagButton = createNode("div");
        tagButton.setAttribute('class', 'tagbu');
        append(tagfield, tagButton);
        tagButton.innerHTML = x;

    });


    document.addEventListener('scroll', function () {

            scroll()
        }
    );

    let sortByDateButton = document.getElementById('sortByDate');
    sortByDateButton.addEventListener('click', function (event) {
        // countIndex();
        let currentClass = event.target.getAttribute('class');
        if (currentClass.includes('marked')) {
            event.target.setAttribute('class', 'sortbu');
            Render(needTOfind.sort(sortByDate));
            saveToLocalStorage('lastSearch', 'date');
        } else {
            event.target.setAttribute('class', 'sortbu marked');


            // sortByDateButton.classList.toggle('sortByDate');
            Render(needTOfind.sort(sortByDate).reverse());

            saveToLocalStorage('lastSearch', 'dateReverse');

        }

    });


    let textSearch = document.getElementById('textTitleSearch');
    textSearch.addEventListener('keyup', function (event) {
        tempTxtArr = textSearch.value.toLocaleLowerCase();
        txtSearch(tempTxtArr);

        saveToLocalStorage('txtSearchLocal', tempTxtArr);
        saveToLocalStorage('lastSearch', 'txt');


    });


    let tempArr = document.getElementsByClassName('tagbu');
    for (let i = 0; i < tempArr.length; i++) {
        tempArr[i].addEventListener("click", toggleMarkedClass);
    }

    function toggleMarkedClass(event) {
        let currentClass = event.target.getAttribute('class');
        if (currentClass.includes('marked')) {
            event.target.setAttribute('class', 'tagbu');
        } else {
            event.target.setAttribute('class', 'tagbu marked');
        }
    }


    let findbutton = document.getElementsByClassName('tagbu');
    for (let i = 0; i < findbutton.length; i++) {
        findbutton[i].addEventListener('click', function (event) {
            countIndex(getMarkedTags());
            Render(needTOfind.sort(sortbyTagsThenDate));

        });

    }
}

function ToggleDeleteTags(event) {
    let PostID = event.target.parentNode.getAttribute("id");
    DeletedPost.push(PostID);

    restore()


}

function getMarkedTags() {
    return Array.from(document.getElementsByClassName('tagbu marked'), function (item) {
        return item.innerText;
    });
}

function countIndex(x) {
    needTOfind.forEach(function (post) {
        post.counter = 0;
        let markedTags = x;
        saveToLocalStorage('lastSearch', 'tag');
        saveToLocalStorage('tagSearchLocal', markedTags);
        for (let i = 0, iMax = markedTags.length; i < iMax; i++) {
            if (post.tags.includes(markedTags[i])) {
                post.counter++;
            }
        }
    });
}

function txtSearch(str) {
    let nArray = needTOfind,
        titleArray = [];


    for (let i = 0; i < nArray.length; i++) {

        let textTitle = nArray[i].title.toLocaleLowerCase();

        if (textTitle.includes(str)) {
            titleArray.push(nArray[i]);
        }

    }
    Render(titleArray)
}

function scroll() {

}

function saveToLocalStorage(key, value) {

    localStorage.setItem(key, value);
}

function restore() {
    if (visited === 1 && localStorage.getItem('lastSearch') === "tag") {
        console.log("LastSort" + "=" + localStorage.getItem('lastSearch'));


        countIndex(localStorage.getItem('tagSearchLocal').split(','));
        Render(needTOfind.sort(sortbyTagsThenDate));
        let NewTagArray = document.getElementsByClassName('tagbu'),
            LastMarkedbuttons = localStorage.getItem('tagSearchLocal').split(',');


        LastMarkedbuttons.forEach(function (tag) {

            for (let i = 0; i < NewTagArray.length; i++) {

                if (NewTagArray[i].textContent.includes(tag)) {
                    NewTagArray[i].classList.add("marked")
                }

            }


        })


    } else if (visited === 1 && localStorage.getItem('lastSearch') === "txt") {

        console.log("LastSort" + "=" + localStorage.getItem('lastSearch'));
        let NewInput = document.getElementById('textTitleSearch');
        NewInput.value = localStorage.getItem('txtSearchLocal');
        txtSearch(localStorage.getItem('txtSearchLocal'));


    } else if (visited === 1 && localStorage.getItem('lastSearch') === "dateReverse") {

        console.log("LastSort" + "=" + localStorage.getItem('lastSearch'));
        Render(needTOfind.sort(sortByDate).reverse());
        document.getElementById('sortByDate').classList.add('marked')

    }
    Render(needTOfind.sort(sortByDate))
}


window.onload = function () {


    fetch(url)
        .then(resp => resp.json())
        .then(function (data) {
            let posts = data.data;

            posts = posts.map(function (item, index) {
                item.counter = 0;
                item.deleted = 0;
                item.id = index;
                return item;
            });


            Render(posts.sort(sortByDate));
            uniqueTags(tagArray);

            needTOfind = posts;

            visited = 1;
            console.log('OK');
            restore()


        })

        .catch(function (error) {
            console.log(JSON.stringify(error));
        });


};

