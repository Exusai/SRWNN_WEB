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
	const downloadCanvas = () => {
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
		<section>
			<Row>
				<div class="left-col">
					<div id="upload">
						{#if image}
							<img class="avatar" src="{image}" alt="d" />
						{:else}
							<img class="avatar" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
						{/if}
						<br>
						<input type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
						{#if image}
							<button id="processButton" on:click={()=>{generator.loadImage(image); generator.generate("imagePlaceholder");}}>Process</button>
						{:else}
							<button disabled>Please select an image first</button>
						{/if}
						
						<button disabled style="display: none;" id="processbuttonDis">Processing...</button>
						
					</div>
				</div>
	
				<div class="right-col">
					<canvas id="imagePlaceholder"></canvas>
					<div style="display: none;" id="loadMsg">
						<img src="/assets/Double Ring-1s-200px.svg" alt="">
					</div>
					<br>
					<button on:click={()=>{downloadCanvas();}}>Download</button>
				</div>
			</Row> 
		</section>

		<section>
			<h1>about</h1>
		</section>

		<section>
			<h1>try waifu2x</h1>
		</section>
	{:else}
		<div class="loader" use:onMount>
			<img src="/assets/Double Ring-1s-200px.svg" alt="">
		</div>
	{/if}
</main>

<style>
	:global(body) { 
		margin: 0; 
		padding: 0;
		background-color: #343434;
		overflow: overlay;
		scroll-snap-align: center;
	}
	:global(::-webkit-scrollbar) {
		width: 10px;
		height: 10px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: rgba(90, 90, 90);
	}

	:global(::-webkit-scrollbar-track) {
		background: rgba(0, 0, 0, 0.2);
	}

	main {
		text-align: center;
		padding: 0;
		background-color: #343434;
	}

	h1 {
		color: #0EACED;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		margin: 0;
	}

	#upload{
		display:flex;
		align-items:center;
		justify-content:center;
		flex-flow:column;
	}

	.avatar{
		display:flex;
		contain: inherit;
		height:200px;
		width:200px;
	}

	canvas {
		display: block;
		background-color: #f0f0f0;
		/* maximum width and height */
		max-width:85%;
		max-height: 85%;
	}

	.right-col{
		display:flex;
		flex-flow:column;
		align-items:center;
		justify-content:center;
		width: 70%;
		border-left: #0EACED solid 1px;
	}

	.left-col{
		display:flex;
		flex-flow:column;
		align-items:center;
		justify-content:center;
		width: 30%;
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

	section {
		height: 100vh;
		padding-top: 10px;
		padding-left: 0;
		padding-right: 0;
		padding-bottom: 0;
		margin: 0;
		border: 0;
	}
</style>