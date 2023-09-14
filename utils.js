// storage.js
export async function getStorage() {
	return await chrome.storage.local.get();
}

async function getStorageItem(item) {
	return await chrome.storage.local.get(item);
}

export async function setStorage(data) {
	await chrome.storage.local.set(data);
}

function flattenBookmarks(bmtree, allBookmarks) {
    for (let i = 0; i < bmtree.length; i++) {
        const bookmark = bmtree[i];
        if (bookmark.url) {
            allBookmarks[bookmark.id] = {
                title: bookmark.title.toLowerCase(),
                url: bookmark.url,
				//icon: bookmark.favicon
            };
            //console.log("bookmark: " + bookmark.title + " ~  " + bookmark.url + " ~  " + bookmark.parentId);
        }
        if (bookmark.children) {
            flattenBookmarks(bookmark.children, allBookmarks);
        }
    }
}

export async function getBookmarks() {
	let allBookmarks = {};
	let bmtree = await chrome.bookmarks.getTree();
	flattenBookmarks(bmtree, allBookmarks);
	return allBookmarks;
}

export function bookmark2code(bookmark) {
	// Get url short 
	let urlsh = bookmark.url;
	urlsh = urlsh.replace('http://', '');
	urlsh = urlsh.replace('https://', '');
	urlsh = urlsh.replace('www.', '');
	urlsh = urlsh.replace('.com', '');
	urlsh = urlsh.replace('.net', '');
	urlsh = urlsh.replace('.org', '');
	// Extract urlsh
	//urlsh = urlsh.split('/')[0];
	return bookmark.title + ' ' + urlsh;
}

export function escapeXML(str){
	return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

