export function fetch_segments(video_id) {
	return new Promise((resolve, reject) => {
		fetch("https://sponsor.ajay.app/api/skipSegments?videoID=" + video_id).then(response => response.json()).then(data => {
			resolve(data);
		}).catch(error => {
			reject(error);
		});
	});
}