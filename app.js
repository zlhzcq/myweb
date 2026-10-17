const searchInput = document.getElementById("search");
const categoryBar = document.getElementById("category-bar");
const grid = document.getElementById("grid");

let currentCategory = "全部";

function renderCategories() {
  const categories = ["全部", ...new Set(links.map(link => link.category))];

  categoryBar.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn" + (cat === currentCategory ? " active" : "");
    btn.textContent = cat;

    btn.addEventListener("click", () => {
      currentCategory = cat;
      renderCategories();
      renderGrid();
    });

    categoryBar.appendChild(btn);
  });
}

function renderGrid() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = links.filter(link => {
    const matchCategory =
      currentCategory === "全部" || link.category === currentCategory;

    const matchKeyword = link.name.toLowerCase().includes(keyword);

    return matchCategory && matchKeyword;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty">没有找到匹配的链接</p>';
    return;
  }

  filtered.forEach(link => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.src = link.icon;
    img.alt = link.name;

    img.onerror = function () {
      this.onerror = null;
      this.src = link.fallback;
    };

    const span = document.createElement("span");
    span.textContent = link.name;

    a.appendChild(img);
    a.appendChild(span);
    grid.appendChild(a);
  });
}

searchInput.addEventListener("input", renderGrid);

renderCategories();
renderGrid();


// // ============================================================
// // 1. 获取页面上的三个元素
// // ============================================================
// // document.getElementById("id名") 的作用：
// // 在 index.html 里找到 id 等于这个名字的元素，并把它存到一个变量里，
// // 后面就可以通过变量操作这个元素，比如往里塞内容、监听输入等。
// //
// // 对应 index.html 里的：
// //   <input id="search">          → 搜索框
// //   <nav id="category-bar">      → 分类按钮那一排
// //   <div id="grid">              → 放所有卡片的大盒子
// // ============================================================

// const searchInput = document.getElementById("search");       // 搜索框
// const categoryBar = document.getElementById("category-bar"); // 分类按钮容器
// const grid = document.getElementById("grid");                // 卡片网格容器


// // ============================================================
// // 2. 记录“当前选中的分类”
// // ============================================================
// // 默认是 "全部"，表示首页显示所有链接。
// // 用户点某个分类按钮后，这个变量会被改成对应的分类名。
// // 因为后面 renderGrid() 和 renderCategories() 都要读它，
// // 所以定义在最外面，让两个函数都能访问到。
// // ============================================================

// let currentCategory = "全部";


// // ============================================================
// // 3. 渲染分类按钮
// // ============================================================
// // 作用：根据 links.js 里所有链接的 category，
// // 自动生成「全部 / 社交 / 音乐 / 开发 / 工具 / AI / 阅读」这些按钮。
// // 以后你在 links.js 里加一个新分类，这里会自动多出一个按钮，
// // 不需要手动改 HTML。
// // ============================================================

// function renderCategories() {

//   // links 是 links.js 里定义的数组，里面每个元素是一个链接对象。
//   // links.map(link => link.category) 的意思是：
//   //   把每个链接对象变成它的 category 字符串。
//   //   例如 [{name:"QQ",category:"社交"}, {name:"微信",category:"社交"}]
//   //   会变成 ["社交", "社交"]。
//   //
//   // new Set(...) 的作用是“去重”：
//   //   ["社交", "社交", "音乐"] → Set { "社交", "音乐" }
//   //
//   // 前面的 ... 是“展开运算符”，把 Set 里的内容摊开成一个数组：
//   //   [...new Set(...)] → ["社交", "音乐", "开发", ...]
//   //
//   // 最前面的 "全部" 是我们手动加的第一个按钮。
//   const categories = ["全部", ...new Set(links.map(link => link.category))];

//   // 每次重新渲染前，先把容器清空，避免按钮重复叠加。
//   categoryBar.innerHTML = "";

//   // 遍历每一个分类名，生成一个按钮。
//   // forEach 是数组的方法，会对数组里每个元素执行一次函数。
//   // cat 就是当前这次循环拿到的分类名，比如 "社交"。
//   categories.forEach(cat => {

//     // 创建一个新的 <button> 元素，但此时还没放到页面上。
//     const btn = document.createElement("button");

//     // 给按钮加上 CSS 类名 "category-btn"，样式在 style.css 里定义。
//     // 如果当前分类等于 currentCategory，就额外加一个 "active" 类，
//     // 用来让选中的按钮显示蓝色高亮。
//     btn.className = "category-btn" + (cat === currentCategory ? " active" : "");

//     // 按钮上显示的文字就是分类名。
//     btn.textContent = cat;

//     // 给按钮绑定“点击事件”：
//     // 用户点这个按钮时，执行大括号里的代码。
//     btn.addEventListener("click", () => {

//       // 把当前分类改成被点击的分类。
//       currentCategory = cat;

//       // 重新渲染按钮，让新选中的按钮变成 active 样式。
//       renderCategories();

//       // 重新渲染卡片，只显示当前分类下的链接。
//       renderGrid();
//     });

//     // 把创建好的按钮放进分类容器里，页面上才能看到它。
//     categoryBar.appendChild(btn);
//   });
// }


// // ============================================================
// // 4. 渲染卡片网格
// // ============================================================
// // 作用：根据当前分类 + 搜索框内容，筛选出要显示的链接，
// // 然后为每个链接生成一张卡片（图标 + 文字）。
// // ============================================================

// function renderGrid() {

//   // 读取搜索框里的内容，并去掉前后空格。
//   // .trim() 去掉首尾空格，比如 "  q  " 变成 "q"。
//   // .toLowerCase() 把字母全部转成小写，这样搜索 "Q" 和 "q" 都能匹配。
//   const keyword = searchInput.value.trim().toLowerCase();

//   // links.filter(...) 的作用是“筛选”：
//   // 对数组里每个链接执行一次函数，返回 true 的保留，返回 false 的丢弃。
//   // 最后 filtered 是一个新数组，只包含符合条件的链接。
//   const filtered = links.filter(link => {

//     // 条件一：分类是否匹配。
//     // 如果当前是 "全部"，任何分类都算匹配；
//     // 否则必须 link.category 等于 currentCategory。
//     const matchCategory =
//       currentCategory === "全部" || link.category === currentCategory;

//     // 条件二：名称是否包含搜索关键字。
//     // link.name.toLowerCase() 把名称转小写，
//     // .includes(keyword) 判断名称里是否包含关键字。
//     // 因为是“包含”，所以搜 "q" 能匹配 "QQ"，搜 "网" 能匹配 "网易云音乐"。
//     const matchKeyword = link.name.toLowerCase().includes(keyword);

//     // 两个条件都满足才保留这个链接。
//     return matchCategory && matchKeyword;
//   });

//   // 清空网格容器，准备重新放卡片。
//   grid.innerHTML = "";

//   // 如果筛选后一个都没有，显示一句提示，然后直接结束函数。
//   if (filtered.length === 0) {
//     grid.innerHTML = '<p class="empty">没有找到匹配的链接</p>';
//     return;
//   }

//   // 遍历筛选后的链接，为每个链接生成一张卡片。
//   filtered.forEach(link => {

//     // 创建一个 <a> 标签，也就是超链接。
//     const a = document.createElement("a");

//     // 加上 CSS 类名 "card"，样式在 style.css 里定义。
//     a.className = "card";

//     // 设置点击后跳转的地址，来自 links.js 里的 url 字段。
//     a.href = link.url;

//     // target="_blank" 表示在新标签页打开，不覆盖当前导航页。
//     a.target = "_blank";

//     // rel="noopener noreferrer" 是安全设置：
//     // 防止新打开的页面通过 window.opener 操作你的导航页。
//     a.rel = "noopener noreferrer";

//     // 创建 <img> 元素，用来显示图标。
//     const img = document.createElement("img");

//     // 图标地址来自 links.js 里的 icon 字段。
//     img.src = link.icon;

//     // alt 是图片加载失败时显示的替代文字，也有利于无障碍访问。
//     img.alt = link.name;

//     // 给图片绑定“加载失败”事件。
//     // 如果主图标 icon 加载不出来（比如 CDN 抽风），就自动换成 fallback。
//     img.onerror = function () {

//       // 先把 onerror 置空，防止备用图标也失败时反复触发，造成死循环。
//       this.onerror = null;

//       // this 指当前这张图片，把它的地址换成 links.js 里的 fallback。
//       this.src = link.fallback;
//     };

//     // 创建 <span> 元素，用来显示链接名称。
//     const span = document.createElement("span");

//     // 文字内容就是 links.js 里的 name 字段。
//     span.textContent = link.name;

//     // 把图片和文字放进 <a> 标签里。
//     // 这样点击图标或点击文字，都会触发 <a> 的跳转。
//     a.appendChild(img);
//     a.appendChild(span);

//     // 把整张卡片放进网格容器。
//     grid.appendChild(a);
//   });
// }


// // ============================================================
// // 5. 监听搜索框输入
// // ============================================================
// // 用户在搜索框里每输入或删除一个字符，都会触发 "input" 事件，
// // 然后重新执行 renderGrid()，实现实时过滤。
// // ============================================================

// searchInput.addEventListener("input", renderGrid);


// // ============================================================
// // 6. 页面加载后第一次渲染
// // ============================================================
// // 打开页面时，先渲染分类按钮，再渲染卡片。
// // 此时 currentCategory 是 "全部"，搜索框是空的，
// // 所以会显示所有链接。
// // ============================================================

// renderCategories();
// renderGrid();