let storeItems = JSON.parse(localStorage.getItem('cm_items_v4')) || [];
let cartItems = JSON.parse(localStorage.getItem('cm_cart_v4')) || [];
let activeCat = 'সব';
let adminActive = sessionStorage.getItem('cm_admin_v4') === 'yes';
let base64Photo = '';

window.addEventListener('DOMContentLoaded', () => {
    if (adminActive) {
        document.getElementById('adminBox').style.display = 'block';
    }
    document.getElementById('cartNum').innerText = cartItems.length;
    drawProducts();
});

function showAdminLogin() {
    if (adminActive) {
        const box = document.getElementById('adminBox');
        box.style.display = 'block';
        box.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    document.getElementById('loginModal').style.display = 'flex';
}

function verifyAdminLogin() {
    const inputPass = document.getElementById('passVal').value.trim();
    if (inputPass === 'chitro2026') {
        adminActive = true;
        sessionStorage.setItem('cm_admin_v4', 'yes');
        document.getElementById('loginModal').style.display = 'none';
        const box = document.getElementById('adminBox');
        box.style.display = 'block';
        box.scrollIntoView({ behavior: 'smooth' });
        drawProducts();
    } else {
        alert('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন: chitro2026');
    }
}

function exitAdmin() {
    adminActive = false;
    sessionStorage.removeItem('cm_admin_v4');
    document.getElementById('adminBox').style.display = 'none';
    drawProducts();
}

function handlePhoto(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxW = 500;
            canvas.width = maxW;
            canvas.height = img.height * (maxW / img.width);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            base64Photo = canvas.toDataURL('image/jpeg', 0.8);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
}

function saveNewItem() {
    const name = document.getElementById('pName').value.trim();
    const cat = document.getElementById('pCat').value;
    const price = Number(document.getElementById('pPrice').value);
    const old = Number(document.getElementById('pOld').value) || 0;
    const img = base64Photo || document.getElementById('pLink').value.trim();
    const sizes = document.getElementById('pSizes').value.trim();
    const desc = document.getElementById('pDesc').value.trim() || '১০০% প্রিমিয়াম কোয়ালিটি পণ্য।';

    if (!name || !price || !img) {
        alert('অনুগ্রহ করে প্রোডাক্টের নাম, দাম এবং ছবি দিন!');
        return;
    }

    storeItems.unshift({ id: Date.now(), name, cat, price, old, img, sizes, desc });
    localStorage.setItem('cm_items_v4', JSON.stringify(storeItems));

    base64Photo = '';
    document.getElementById('pName').value = '';
    document.getElementById('pPrice').value = '';
    document.getElementById('pOld').value = '';
    document.getElementById('pLink').value = '';
    document.getElementById('pSizes').value = '';
    document.getElementById('pDesc').value = '';

    drawProducts();
    alert('অভিনন্দন! প্রোডাক্টটি সফলভাবে যুক্ত হয়েছে।');
}

function deleteItem(id) {
    if (!confirm('এই প্রোডাক্টটি ডিলিট করতে চান?')) return;
    storeItems = storeItems.filter(x => x.id !== id);
    localStorage.setItem('cm_items_v4', JSON.stringify(storeItems));
    drawProducts();
}

function changeCategory(cat, btn) {
    activeCat = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    drawProducts();
}

function drawProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const list = storeItems.filter(x => (activeCat === 'সব' || x.cat === activeCat) && x.name.toLowerCase().includes(query));
    const grid = document.getElementById('gridArea');

    if (list.length === 0) {
        grid.innerHTML = `<div class="empty-box"><div style="font-size:48px;">🛍️</div><h3>আমাদের নতুন কালেকশন সাজানো হচ্ছে</h3><p style="color:#64748b;">খুব শীঘ্রই প্রিমিয়াম সব পণ্য এখানে যুক্ত করা হবে।</p></div>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="card">
            ${adminActive ? `<button type="button" class="del-btn" onclick="deleteItem(${p.id})">ডিলিট ✕</button>` : ''}
            <div class="img-box" onclick="viewProduct(${p.id})"><img src="${p.img}" alt="${p.name}"></div>
            <div class="card-body">
                <div style="font-size:12px;color:#64748b;font-weight:700;">${p.cat}</div>
                <div class="card-title" onclick="viewProduct(${p.id})">${p.name}</div>
                <div class="card-price">৳${p.price} ${p.old > p.price ? `<span style="font-size:14px;color:#94a3b8;text-decoration:line-through;">৳${p.old}</span>` : ''}</div>
                <div class="btn-row">
                    <button type="button" class="btn-sub" onclick="pushCart(${p.id})">+ কার্ট</button>
                    <button type="button" class="btn-buy" onclick="viewProduct(${p.id})">অর্ডার করুন</button>
                </div>
            </div>
        </div>`).join('');
}

function viewProduct(id) {
    const p = storeItems.find(x => x.id === id);
    if (!p) return;
    const sizeSelect = p.sizes ? `<select id="oSize" style="width:100%;padding:10px;margin-bottom:8px;border:1px solid #cbd5e1;border-radius:8px;">${p.sizes.split(',').map(s => `<option>সাইজ: ${s.trim()}</option>`).join('')}</select>` : '';
    document.getElementById('modalBody').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;">
            <img src="${p.img}" style="width:100%;max-height:280px;object-fit:contain;border:1px solid #eee;border-radius:10px;padding:10px;">
            <div>
                <h2>${p.name}</h2><div class="card-price">৳${p.price}</div>
                <p style="background:#f8fafc;padding:10px;border-radius:8px;white-space:pre-line;font-size:14px;margin-bottom:10px;">${p.desc}</p>
                ${sizeSelect}
                <input id="cName" placeholder="আপনার নাম *" style="width:100%;padding:10px;margin-bottom:8px;border:1px solid #cbd5e1;border-radius:8px;">
                <input id="cPhone" placeholder="মোবাইল নম্বর *" style="width:100%;padding:10px;margin-bottom:8px;border:1px solid #cbd5e1;border-radius:8px;">
                <select id="cArea" style="width:100%;padding:10px;margin-bottom:8px;border:1px solid #cbd5e1;border-radius:8px;">
                    <option value="70">ঢাকার ভেতরে ডেলিভারি (৳৭০)</option>
                    <option value="130">ঢাকার বাইরে সারা বাংলাদেশ (৳১৩০)</option>
                </select>
                <input id="cAddr" placeholder="সম্পূর্ণ ঠিকানা *" style="width:100%;padding:10px;margin-bottom:10px;border:1px solid #cbd5e1;border-radius:8px;">
                <button type="button" onclick="orderWhatsApp('${p.name}', ${p.price})" style="width:100%;background:#25D366;color:#fff;border:none;padding:12px;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;">WhatsApp-এ অর্ডার কনফার্ম করুন</button>
            </div>
        </div>`;
    document.getElementById('orderModal').style.display = 'flex';
}

function orderWhatsApp(name, price) {
    const cn = document.getElementById('cName').value.trim();
    const cp = document.getElementById('cPhone').value.trim();
    const ca = document.getElementById('cAddr').value.trim();
    const dl = Number(document.getElementById('cArea').value);
    const sz = document.getElementById('oSize') ? `\n📏 ${document.getElementById('oSize').value}` : '';
    if (!cn || !cp || !ca) { alert('নাম, নম্বর ও ঠিকানা দিন!'); return; }
    const txt = `আসসালামু আলাইকুম, Chitro mart bd থেকে অর্ডার:\n\n🛍️ পণ্য: ${name}${sz}\n💰 দাম: ৳${price}\n🚚 ডেলিভারি: ৳${dl}\n💵 মোট: ৳${price + dl}\n\n👤 নাম: ${cn}\n📞 ফোন: ${cp}\n📍 ঠিকানা: ${ca}`;
    window.open(`https://wa.me{encodeURIComponent(txt)}`, '_blank');
}

function pushCart(id) {
    const p = storeItems.find(x => x.id === id);
    if (!p) return;
    cartItems.push(p);
    localStorage.setItem('cm_cart_v4', JSON.stringify(cartItems));
    document.getElementById('cartNum').innerText = cartItems.length;
    alert('পণ্যটি কার্টে যুক্ত হয়েছে!');
}

function viewCart() {
    if (cartItems.length === 0) { alert('আপনার কার্ট খালি!'); return; }
    const total = cartItems.reduce((s, x) => s + x.price, 0);
    const list = cartItems.map((x, i) => `${i + 1}. ${x.name} - ৳${x.price}`).join('\n');
    if (confirm(`কার্টের পণ্যসমূহ:\n${list}\n\nমোট মূল্য: ৳${total}\n\nWhatsApp-এ অর্ডার করতে OK চাপুন।`)) {
        window.open(`https://wa.me{encodeURIComponent('কার্ট অর্ডার:\n' + list + '\nমোট: ৳' + total)}`, '_blank');
    }
}
