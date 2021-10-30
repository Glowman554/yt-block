function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

function check_for_head() {
	var head = document.getElementsByTagName('head')[0];
	if (!head) {
		console.log('waiting for head...');
		setTimeout(check_for_head, 1);
	} else {
		injectScript(chrome.runtime.getURL('injected.js'), 'head');
		console.log('injected');
	}
}

console.log('injecting...');
setTimeout(check_for_head, 1);