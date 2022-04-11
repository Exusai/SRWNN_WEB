<script>
	import {Generator} from './tensorflow.js';

	let generator = new Generator();
	// Load model is only used for inference in the main thread
	//generator.loadModel('./models/SRWNN256/model.json');
	//generator.loadModel('./models/SRWNN/model.json');

	let  image, fileinput, filename;
	const onFileSelected =(e)=>{
		let imageURL = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(imageURL);
		reader.onload = e => {
			image = e.target.result
		};
		// get name from the file reader
		filename = imageURL.name;
		// remove the extension from the name
		filename = filename.substring(0, filename.lastIndexOf('.'));
		console.log(filename);
		reader.onerror = e => {
			console.log('Error uploading or selecting: ', e);
		};
	}

	// Create a function that downloads the canvas as an image
	const downloadCanvas = function(){
		var link = document.createElement('a');
		link.download = filename + '2x.png';
		link.href = document.getElementById('imagePlaceholder').toDataURL()
		link.click();
	}
	

</script>

<svelte:head>
	<title>Super Resolution Waifu Neural Network</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	<h1>Welcome To!</h1>
	{#if !generator.isReady}
		<p>Model not loaded</p>
	{:else}
		<p>Generator Ready</p>
	{/if}

	<h1>Upload Image</h1>
	<div id="upload">
		{#if image}
			<img class="avatar" src="{image}" alt="d" />
		{:else}
			<img class="avatar" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
		{/if}
		
		<img class="uploadBtn" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{fileinput.click();}} />
		<div class="chan" on:click={()=>{fileinput.click();}}>Choose Image</div>
		<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
	</div>

	<h1>Process</h1>
	<!-- <img class="uploadBtn" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{generator.loadImage(avatar);}} /> -->
	<img class="uploadBtn" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{generator.loadImage(image);generator.generate("imagePlaceholder");}} />

	<h1>Result</h1>
	<canvas id="imagePlaceholder"></canvas>

	<h1>Download the image</h1>
	<button on:click={()=>{downloadCanvas();}}>Download</button>

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	#upload{
		display:flex;
		align-items:center;
		justify-content:center;
		flex-flow:column;
	}

	.uploadBtn{
		display:flex;
		height:50px;
		width:50px;
		cursor:pointer;
	}
	.avatar{
		display:flex;
		height:200px;
		width:200px;
	}
</style>