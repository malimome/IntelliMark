import { getStorage, getBookmarks, setStorage, bookmark2code, escapeXML } from './utils.js';
import { TimeoutQueue } from './queue.js';
import {getEmbeddings, findMostSimilarIds} from './embedding.js';

let allBookmarks = {};
let previous_searches = new Map();

async function init() {
	const queue = new TimeoutQueue(0, 100);
	allBookmarks = await getBookmarks();
	const storedEmbedding = await getStorage();
	
	for(let [id, bookmark] of Object.entries(allBookmarks)) { 
		// check if embedding already exists otherwise get the embedding
		if (id in storedEmbedding) {
			allBookmarks[id].embedding = storedEmbedding[id];
			//console.log('already ' + id);
		} else {
			let code = bookmark2code(bookmark);
			// call the api to get the embedding with timeout
			const task = { fn: async () => { return await getEmbeddings([code]); } };
			const embeddings = await queue.enqueue(task);
			allBookmarks[id].embedding = embeddings[0].embedding;
			setStorage({[id]: allBookmarks[id].embedding});
			console.log('Value set', id);
		}
	}
}

chrome.runtime.onInstalled.addListener(() => {
  // runs on first install/update
	init();
});

let timer;
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	if (text.length < 5) return;
	if (previous_searches.has(text)) {
		suggest(previous_searches.get(text));
		return;
	}
	if (previous_searches.size > 20) {
		el = map1.entries().next().value[0];
		map1.delete(el);
	}
	clearTimeout(timer);
	timer = setTimeout(() => {
		getEmbeddings([text]).then(embeddings => {
			const ids = findMostSimilarIds(embeddings[0].embedding, allBookmarks, 5);
			let suggestions = [];
			for (const i in ids) {
				const id = ids[i];
				suggestions.push({
					content: allBookmarks[id].url, 
					description: escapeXML(allBookmarks[id].title)
				});
			}
			suggest(suggestions);
			previous_searches.set(text, suggestions);
		});
		
	}, 500);
});


chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  chrome.tabs.update(null, {url: text}); 
  init();
});