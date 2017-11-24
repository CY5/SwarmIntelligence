async function loadResources(loader, progressBar){
	if (!loader) {
		throw("THREE.JS JSON Loader is required");
	}
	let fish = await resolveFish(loader, progressBar);
	return {
		"fish" :fish
	}
}

function resolveFish(loader, progressBar){
	return new Promise((resolve, reject) => {
		loader.load(
			//resource url
			'assets/models/fish/source/fish.json',
			//On Success
			(geometry, material) => {

				resolve({"geometry" : geometry, "material":material});
			},
			// download progresses
	        ( xhr ) => {
	      		//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	      		if (xhr.total == 0){
	      			progressBar.textContent = Math.floor(xhr.loaded) + ' Loaded';
	      		}else {
	      			progressBar.textContent = Math.floor(xhr.loaded / xhr.total * 100) + '% Loaded';
	      		}
	      		
	      	},
			//On Error
			(xhr) => {
				reject(xhr);
			}
		);

	});
}

