// ==UserScript==
// @name         Jellyfin with Potplayer
// @version      0.2
// @description  Play video with Potplayer
// @author       Tccoin, Xei
// @match        http://localhost:8096/web/index.html
// ==/UserScript==

(function() {
	'use strict';

	// Open Potplayer with the specified item ID
	let openPotplayer = async (itemId) => {
	  let userId = (await ApiClient.getCurrentUser()).Id;
	  ApiClient.getItem(userId, itemId).then(r => {
		if (r.Path) {
		  let path = r.Path.replace(/\\/g, '/');
		  // path = path.replace('D:', 'Z:'); // Modify the path if needed
		  console.log(path);

		  // Open Potplayer in the background using a hidden iframe
		  const iframe = document.createElement('iframe');
		  iframe.style.display = 'none';
		  iframe.src = 'potplayer://' + path;
		  document.body.appendChild(iframe);

		  // Find the button with the specified attributes
		  let button = document.querySelector('button[is="emby-playstatebutton"][data-played="false"][data-id="' + itemId + '"]');
		  if (button) {
			  button.dispatchEvent(new MouseEvent('click')); // Trigger a mouse click event
		  }
		  // End of watched button click
		} else {
		  ApiClient.getItems(userId, itemId).then(r => openPotplayer(r.Items[0].Id));
		}
	  });
	};

	// Bind event listeners to the play and resume buttons
	let bindEvent = async () => {
	  let buttons = [];
	  let retry = 6 + 1;
	  while (buttons.length === 0 && retry > 0) {
		await new Promise(resolve => setTimeout(resolve, 500));
		buttons = document.querySelectorAll('[data-mode=play],[data-mode=resume],[data-action=resume]');
		retry -= 1;
	  }
	  for (let button of buttons) {
		let nextElementSibling = button.nextElementSibling;
		let parentElement = button.parentElement;
		let outerHTML = button.outerHTML;
		button.parentElement.removeChild(button);
		let newButton = document.createElement('button');
		if (nextElementSibling) {
		  parentElement.insertBefore(newButton, nextElementSibling);
		} else {
		  parentElement.append(newButton);
		}
		newButton.outerHTML = outerHTML;
	  }
	  buttons = document.querySelectorAll('[data-mode=play],[data-mode=resume]');
	  for (let button of buttons) {
		button.removeAttribute('data-mode');
		button.addEventListener('click', e => {
		  e.stopPropagation();
		  let itemId = /id=(.*?)&serverId/.exec(window.location.hash)[1];
		  openPotplayer(itemId);
		});
	  }
	  buttons = document.querySelectorAll('[data-action=resume]');
	  for (let button of buttons) {
		button.removeAttribute('data-action');
		button.addEventListener('click', e => {
		  e.stopPropagation();
		  let item = e.target;
		  while (!item.hasAttribute('data-id')) { item = item.parentNode; }
		  let itemId = item.getAttribute('data-id');
		  openPotplayer(itemId);
		});
	  }
	};

	// Lazy load images when scrolling
	let lazyload = () => {
	  let items = document.querySelectorAll('[data-src].lazy');
	  let y = document.scrollingElement.scrollTop;
	  let intersectinglist = [];
	  for (let item of items) {
		let windowHeight = document.body.offsetHeight;
		let itemTop = item.getBoundingClientRect().top;
		let itemHeight = item.offsetHeight;
		if (itemTop + itemHeight >= 0 && itemTop <= windowHeight) {
		  intersectinglist.push(item);
		}
	  }
	  for (let item of intersectinglist) {
		item.style.setProperty('background-image', `url("${item.getAttribute('data-src')}")`);
		item.classList.remove('lazy');
		item.removeAttribute('data-src');
	  }
	};

	window.addEventListener('scroll', lazyload);

	window.addEventListener('viewshow', async () => {
	  bindEvent();
	  window.addEventListener('hashchange', bindEvent);
	});
})();
