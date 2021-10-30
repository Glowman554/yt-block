import { notification } from "./notification.js";
import { fetch_segments } from "./sponsor_block.js";

notification("Injected", "Successfully injected YT Block!", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Checkmark_green.svg/1200px-Checkmark_green.svg.png");

var video_player = null;

var observer = new MutationObserver(function(mutationList) {
	for (var i = 0, l = mutationList.length; i < l; i++) {
		var mutation = mutationList[i];
		if (mutation.type === 'childList') {
			for (var j = 0, k = mutation.addedNodes.length; j < k; j++) {
				var node = mutation.addedNodes[j];
				var name = node.nodeName;
				var id = node.id;

				if (id === 'movie_player') {
					video_player = node;
				}
			}
		}
	}
});

observer.observe(document, {
	attributes: false,
	childList: true,
	subtree: true
});

function do_it() {
	var id = new URLSearchParams(window.location.search).get("v");
	console.log("id: " + id);

	var segments = null;

	fetch_segments(id).then(function(segments_) {
		segments = segments_;
		console.log(segments);

		notification("Segments loaded", `Successfully loaded ${segments.length} segments to skip for this video!`, "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Checkmark_green.svg/1200px-Checkmark_green.svg.png");
	});

	return setInterval(() => {
		if (!video_player || !segments) {
			console.log('waiting for video_player and segments');
			return;
		}

		var current_time = video_player.getCurrentTime();
		var current_segment = segments.find(segment => segment.segment[0] <= current_time && segment.segment[1] >= current_time);

		if (current_segment) {
			console.log(`Skip to ${current_segment.segment[1]}`);
			video_player.seekTo(current_segment.segment[1]);

			notification("Skipping...", `Skipping to second ${Math.ceil(current_segment.segment[1])} because there was a ${current_segment.category} segment!`, "https://cdn4.iconfinder.com/data/icons/media-controls-4/100/skip-ahead-512.png");
		}
	}, 1000);
}

var interval = null;

window.addEventListener('yt-page-data-updated', function (event) {
	console.log('yt-page-data-updated');

	if (interval) {
		clearInterval(interval);
	}


	if (event.detail.pageType === 'watch') {
		interval = do_it();
	} else {
		console.log('not a watch page');
	}
});