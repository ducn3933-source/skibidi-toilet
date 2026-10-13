const courses = [
  {id:1,title:"Lập trình Python từ cơ bản đến thực hành",category:"Lập trình",teacher:"Nguyễn Minh Anh",rating:4.8,students:"12.450",hours:"18 giờ",price:299000,old:699000,art:"purple",symbol:"Py",popular:1},
  {id:2,title:"Digital Marketing: Xây dựng chiến lược hiệu quả",category:"Marketing",teacher:"Trần Hoàng Nam",rating:4.7,students:"8.210",hours:"12 giờ",price:249000,old:599000,art:"orange",symbol:"↗",popular:2},
  {id:3,title:"Thiết kế UI/UX với Figma cho người mới",category:"Thiết kế",teacher:"Lê Thu Hà",rating:4.9,students:"6.820",hours:"15 giờ",price:329000,old:799000,art:"pink",symbol:"✳",popular:3},
  {id:4,title:"Excel thực chiến cho học tập và công việc",category:"Kinh doanh",teacher:"Phạm Đức Long",rating:4.8,students:"15.100",hours:"10 giờ",price:199000,old:499000,art:"green",symbol:"X",popular:4},
  {id:5,title:"Phân tích dữ liệu với Python và Pandas",category:"Dữ liệu và AI",teacher:"Đỗ Quỳnh Chi",rating:4.9,students:"5.670",hours:"21 giờ",price:399000,old:899000,art:"blue",symbol:"⌁",popular:5},
  {id:6,title:"Lập trình Web với HTML, CSS và JavaScript",category:"Lập trình",teacher:"Vũ Thành Đạt",rating:4.7,students:"10.320",hours:"24 giờ",price:349000,old:849000,art:"dark",symbol:"</>",popular:6},
  {id:7,title:"Khởi nghiệp và xây dựng mô hình kinh doanh",category:"Kinh doanh",teacher:"Nguyễn Hải Yến",rating:4.6,students:"4.320",hours:"8 giờ",price:179000,old:399000,art:"orange",symbol:"↗",popular:7},
  {id:8,title:"Ứng dụng AI tạo sinh trong công việc",category:"Dữ liệu và AI",teacher:"Bùi Gia Bảo",rating:4.9,students:"9.760",hours:"9 giờ",price:279000,old:649000,art:"purple",symbol:"AI",popular:8}
];
let selectedCategory = "Tất cả";
let query = "";
let cart = JSON.parse(localStorage.getItem("udemyDemoCart") || "[]");
let learning = JSON.parse(localStorage.getItem("udemyDemoLearning") || "[]");
const $ = id => document.getElementById(id);
const money = n => n.toLocaleString("vi-VN") + "₫";

function renderCourses(){
  let list = courses.filter(c => (selectedCategory === "Tất cả" || c.category === selectedCategory) &&
    (c.title + " " + c.category + " " + c.teacher).toLowerCase().includes(query.toLowerCase()));
  const sort = $("sortSelect").value;
  if(sort === "priceAsc") list.sort((a,b)=>a.price-b.price);
  else if(sort === "rating") list.sort((a,b)=>b.rating-a.rating);
  else list.sort((a,b)=>a.popular-b.popular);
  $("courseGrid").innerHTML = list.map(c => `
    <article class="course-card">
      <div class="course-art ${c.art}"><span class="symbol">${c.symbol}</span></div>
      <div class="course-info">
        <div class="course-category">${c.category}</div>
        <h3>${c.title}</h3>
        <p class="instructor">${c.teacher}</p>
        <div class="rating">${c.rating} ★ <span>(${c.students} học viên)</span></div>
        <p class="course-meta">◷ ${c.hours} nội dung học</p>
        <div class="price-row"><span class="price">${money(c.price)}</span><span class="old-price">${money(c.old)}</span></div>
        <button class="add-cart" data-add="${c.id}">Thêm vào giỏ hàng</button>
      </div>
    </article>`).join("");
  $("emptyState").classList.toggle("hidden", list.length > 0);
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active", b.dataset.category===selectedCategory));
}
function saveState(){
  localStorage.setItem("udemyDemoCart",JSON.stringify(cart));
  localStorage.setItem("udemyDemoLearning",JSON.stringify(learning));
  $("cartCount").textContent=cart.length;
}
function toast(message){
  const el=$("toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}
function openModal(content){
  $("modalContent").innerHTML=content;
  $("modalBackdrop").classList.remove("hidden");
}
function closeModal(){ $("modalBackdrop").classList.add("hidden"); }
function loginModal(signup=false){
  openModal(`<h2 id="modalTitle">${signup?"Tạo tài khoản":"Chào mừng bạn trở lại"}</h2>
    <p>${signup?"Đăng ký để lưu khóa học và theo dõi tiến độ học tập.":"Đăng nhập mô phỏng để trải nghiệm giao diện học trực tuyến."}</p>
    ${signup?'<label for="fullName">Họ và tên</label><input id="fullName" placeholder="Nhập họ và tên">':''}
    <label for="email">Email</label><input id="email" type="email" placeholder="name@example.com">
    <label for="password">Mật khẩu</label><input id="password" type="password" placeholder="Ít nhất 6 ký tự">
    <button class="primary-btn" id="submitLogin">${signup?"Tạo tài khoản":"Đăng nhập"}</button>
    <p>Đây là biểu mẫu minh họa; thông tin không được gửi đến máy chủ.</p>`);
  $("submitLogin").addEventListener("click",()=>{
    const email=$("email").value.trim(), pass=$("password").value;
    if(!email.includes("@")||pass.length<6){toast("Vui lòng nhập email hợp lệ và mật khẩu từ 6 ký tự.");return;}
    closeModal();toast(signup?"Đã mô phỏng tạo tài khoản thành công.":"Đăng nhập mô phỏng thành công.");
    $("loginButton").textContent="Tài khoản";
  });
}
function showCart(){
  const items=cart.map(id=>courses.find(c=>c.id===id)).filter(Boolean);
  openModal(`<h2 id="modalTitle">Giỏ hàng (${items.length})</h2><p>Các khóa học bạn đã chọn.</p>
    ${items.length?items.map(c=>`<div class="cart-line"><span>${c.title}<br><b>${money(c.price)}</b></span><button data-remove="${c.id}">Xóa</button></div>`).join(""):`<p>Giỏ hàng của bạn đang trống. Hãy khám phá khóa học nhé!</p>`}
    <div class="cart-line"><b>Tổng cộng</b><b>${money(items.reduce((s,c)=>s+c.price,0))}</b></div>
    <button class="primary-btn" id="checkoutButton" ${items.length?"":"disabled"}>Tiến hành thanh toán</button>
    <p>Thanh toán thật chưa được tích hợp trong bản demo.</p>`);
}
function showLearning(){
  const items=learning.map(id=>courses.find(c=>c.id===id)).filter(Boolean);
  openModal(`<h2 id="modalTitle">Khóa học của tôi</h2><p>Các khóa học đã được thêm vào khu vực học tập trên trình duyệt này.</p>
    ${items.length?items.map(c=>`<div class="learning-line"><span><b>${c.title}</b><br><small>${c.hours} nội dung học · Tiến độ demo: 0%</small></span><button class="remove-btn" data-unenroll="${c.id}">Gỡ</button></div>`).join(""):`<p>Bạn chưa có khóa học nào trong khu vực học tập. Thêm khóa học từ danh sách để xem tại đây.</p>`}`);
}
$("searchForm").addEventListener("submit",e=>{e.preventDefault();query=$("searchInput").value.trim();renderCourses();$("courses").scrollIntoView({behavior:"smooth"});});
$("searchInput").addEventListener("input",e=>{query=e.target.value.trim();renderCourses();});
$("sortSelect").addEventListener("change",renderCourses);
$("filterRow").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;selectedCategory=b.dataset.category;renderCourses();});
$("categoryToggle").addEventListener("click",()=>$("categoryMenu").classList.toggle("hidden"));
$("categoryMenu").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;selectedCategory=b.dataset.category;$("categoryMenu").classList.add("hidden");renderCourses();$("courses").scrollIntoView({behavior:"smooth"});});
$("courseGrid").addEventListener("click",e=>{
  const b=e.target.closest("[data-add]");if(!b)return;
  const id=Number(b.dataset.add);
  if(cart.includes(id)){toast("Khóa học này đã có trong giỏ hàng.");return;}
  cart.push(id);saveState();toast("Đã thêm khóa học vào giỏ hàng.");
});
$("cartButton").addEventListener("click",showCart);
$("loginButton").addEventListener("click",()=>loginModal(false));
$("signupButton").addEventListener("click",()=>loginModal(true));
$("myLearningButton").addEventListener("click",showLearning);
$("teachButton").addEventListener("click",()=>openModal(`<h2 id="modalTitle">Khu vực giảng viên</h2><p>Trong hệ thống hoàn chỉnh, giảng viên có thể tạo khóa học, tải video và tài liệu, xây dựng bài kiểm tra, tương tác với học viên và theo dõi doanh thu.</p><label for="teacherEmail">Email liên hệ</label><input id="teacherEmail" type="email" placeholder="name@example.com"><button class="primary-btn" id="teacherDemo">Trải nghiệm giao diện giảng viên</button>`));
$("modalContent").addEventListener("click",e=>{
  const remove=e.target.closest("[data-remove]");
  const unenroll=e.target.closest("[data-unenroll]");
  if(remove){cart=cart.filter(id=>id!==Number(remove.dataset.remove));saveState();showCart();return;}
  if(unenroll){learning=learning.filter(id=>id!==Number(unenroll.dataset.unenroll));saveState();showLearning();return;}
  if(e.target.id==="checkoutButton"){toast("Đây là bản demo: chưa xử lý thanh toán thật.");return;}
  if(e.target.id==="teacherDemo"){toast("Khu vực giảng viên là bản mô phỏng giao diện.");closeModal();}
});
$("modalClose").addEventListener("click",closeModal);
$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();$("categoryMenu").classList.add("hidden");}});
renderCourses();saveState();
