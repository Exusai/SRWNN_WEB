<script>
	import { Generator } from './tensorflow.js';
	import { Row, Col, Grid, Item } from 'svelte-layouts'
	import { onMount } from 'svelte';

	let isPageLoaded = false;

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

	onMount(() => {
		isPageLoaded = true;
	});
</script>

<svelte:head>
	<title>Super Resolution Waifu Neural Network</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	{#if isPageLoaded}
		<h1>Free Super Resolution Online</h1>

		<Row justifyContent="space-around">
			
			<div>
				<div id="upload">
					{#if image}
						<img class="avatar" src="{image}" alt="d" />
					{:else}
						<img class="avatar" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
					{/if}

					<input type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
					<hr>
					<button on:click={()=>{generator.loadImage(image);generator.generate("imagePlaceholder");}}>Process</button>

				</div>
			</div>

			<div>
				{#if !generator.isWorking}
					<canvas id="imagePlaceholder"></canvas>
				{:else}
					<div>loading...</div>
				{/if}
				<hr>
				<button on:click={()=>{downloadCanvas();}}>Download</button>
			</div>
		</Row> 
	{:else}
		<div class="loader">Loading...</div>
	{/if}
</main>

<style>
	:global(body) { 
		margin: 0; 
		padding: 0;
		overflow: -moz-scrollbars-none;
		scrollbar-width: none;
		/* this will hide the scrollbar in internet explorers */
		-ms-overflow-style: none;
	}
	

	main {
		text-align: center;
		padding: 1em;
		background-color: white;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	#upload{
		display:flex;
		align-items:center;
		justify-content:center;
		flex-flow:column;
	}

	.avatar{
		display:flex;
		height:200px;
		width:200px;
	}

	canvas {
		display: flex;
		/* height: 75%;
		width: 75; */
		background-color: #f0f0f0;
	}

	.loader {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		place-items: center;
		background-color: white;
		z-index: 999;
	}
</style>