export class File {

	_mimeTypes = {
		image: [
			'image/bmp',
			'image/gif',
			'image/jpeg',
			'image/png',
			'image/svg+xml',
			'image/tiff',
			'image/vnd.wap.wbmp',
			'image/webp',
			'image/x-jng',
			'image/x-icon'
		],
		video: [
			'audio/midi',
			'audio/mp4',
			'audio/mpeg',
			'audio/ogg',
			'audio/x-realaudio',
			'audio/x-wav'
		],
		audio: [
			'application/vnd.apple.mpegurl',
			'application/x-mpegurl',
			'video/3gpp',
			'video/mp4',
			'video/mpeg',
			'video/ogg',
			'video/quicktime',
			'video/webm',
			'video/x-m4v',
			'video/ms-asf',
			'video/x-ms-wmv',
			'video/x-msvideo'
		]
	};

	toBase64(file) {

		return new Promise((resolve, reject) => {

			let reader = new FileReader();
			reader.onload = (event) => {
				resolve(event);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	base64toFile(base64, mimeType) {

		let data = base64.split(',')[1];
		return new Blob([window.atob(data)], {type: mimeType, encoding: 'utf-8'});
	}

	getMimeTypes(type) {

		return this.mimeTypes[type];
	}

	getChecksum(file) {

		return new Promise((resolve, reject) => {

			this.toBase64(file).then((event) => {
				let string = event.target.result;

				let index;
				let checksum = 0x12345678;

				for (index = 0; index < string.length; index++) {
					checksum += (string.charCodeAt(index) * (index + 1));
				}

				resolve(checksum);
			});
		});
	}

	downloadAs(mimeType, fileName, content) {

		let data = 'data:' + mimeType + 'charset=utf-8,' + content;
		data = encodeURI(data);

		let link = document.createElement('a');
		link.setAttribute('href', data);
		link.setAttribute('download', fileName);
		link.click();
		link.remove();
	}

	promptFileDialog(callback, accept, multiple = false) {

		let input = document.createElement('input');
		input.type = 'file';
		input.accept = accept;

		if (multiple) {
			input.multiple = true;
		}

		document.body.appendChild(input);
		input.click();

		input.onchange = (event) => {

			let files = Array.from(event.target.files);
			input.remove();

			callback(files);
		};
	}

	bindDropEvents(element, settings) {

		let namespace = 'zmFile';

		let isSupported = (event) => {

			if(!settings.supportedTypes
				|| settings.supportedTypes.length === 0) {
				return true;
			}

			let files = event.dataTransfer.items;
			for (let i = 0; i < files[i].length; i++) {
				let file = files[i];
				if(settings.supportedTypes.indexOf(file.type) === -1) {
					return false;
				}
			};

			return true;
		};

		let parseEvent = (event, callback) => {

			let result = [];
			let files = event.target.files || event.dataTransfer.files;
			let completed = 0;

			for (let i = 0, file; file = files[i]; i++) {

				let reader = new FileReader();
				reader.onload = (read) => {
					completed++;
					result.push(read);
					if(completed === files.length) {
						callback(result);
					}
				};
				reader.readAsDataURL(file);
			};
		};

		// $e.on('drop.' + namespace, (event) => {
		//
		// 	event.preventDefault();
		//
		// 	$e.removeClass('zm-file-drop-activate zm-file-drop-invalid');
		//
		// 	if(isSupported(event.originalEvent)
		// 		&& settings.onComplete instanceof Function) {
		//
		// 		settings.onComplete(event, event.originalEvent.dataTransfer.files);
		// 	}
		// });
		//
		// $e.on('dragover.' + namespace, (event) => {
		//
		// 	event.preventDefault();
		//
		// 	if(isSupported(event.originalEvent)) {
		// 		event.originalEvent.dataTransfer.dropEffect = "copy";
		// 		$e.addClass('zm-file-drop-activate');
		//
		// 		if(settings.onDragOver instanceof Function) {
		// 			return settings.onDragOver(event);
		// 		}
		// 	}
		// 	else {
		// 		event.originalEvent.dataTransfer.dropEffect = "none";
		// 		$e.addClass('zm-file-drop-invalid');
		// 	}
		// });
		//
		// $e.on('dragleave.' + namespace, (event) => {
		//
		// 	$e.removeClass('zm-file-drop-activate zm-file-drop-invalid');
		//
		// 	if(settings.onDragLeave instanceof Function) {
		// 		return settings.onDragLeave(event);
		// 	}
		// });
	}
}
