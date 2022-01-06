let query = window.location.search;
query = new URLSearchParams(query);
const search = query.get('search');

let uid;
let path = window.location.pathname;
if (path.includes('users')) uid = path.split('/')[2];

let skip = 10;
let limit = 10;
const listPost = document.querySelector('.list-post');
infiteLoad(listPost.lastElementChild);

function loadPost() {
	listPost.innerHTML =
		listPost.innerHTML +
		'<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
	axios({
		method: 'get',
		url: `http://localhost:3000/pictures/posts?limit=${limit}&skip=${skip}${
			search ? '&search=' + search : ''
		}${uid ? '&uid=' + uid : ''}`,
		withCredentials: true,
	}).then((res) => {
		document.querySelector('.lds-ellipsis').remove();
		if (res.status == 400) return;

		let html = [];
		res.data.map((x) => {
			html.push(`
            <div class="mb-3">
            <div class="row ccard" id="<%= picture._id %>">
                <div class="author">
                    <div class="avatar">
                        <img
                            src="https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg"
                            alt="av"
                        />
                    </div>
                    <a href="/users/${x.author._id}" class="username"
                        >${x.author.username}</a
                    >
                </div>
                <a href="/pictures/${x._id}" class="img">
                    <span class="total-pic">${x.images.length}</span>
                    <img alt="" src="${x.images[0].url}" />
                </a>
                <div class="info">
                    <h5 class="card-title">${x.title}</h5>
                    <p class="card-text">${x.description}</p>
                    <p class="card-text">
                        <small class="text-muted">Vị trí: ${x.location}</small>
                    </p>                    
                </div>
                <div class="rating">
                    <span class="material-icons-outlined star"> star </span>
                    <span class="rate">${x.reviews.mean}</span>
                </div>
            </div>
        </div>
            `);
		});

		html = html.join('');
		listPost.innerHTML = listPost.innerHTML + html;

		skip += limit;
		infiteLoad(listPost.lastElementChild);
	});
}

function infiteLoad(target) {
	const io = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				loadPost();
				observer.disconnect();
			}
		});
	});

	io.observe(target);
}
