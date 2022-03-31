<script>
	import {Generator} from './generator.js';

	let generator = new Generator();
	generator.loadModel('./models/SRWNN/model.json');
	//let promise = generator.loadModel('./models/SRWNN/model.json');

	let  avatar, fileinput;
	const onFileSelected =(e)=>{
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = e => {
			avatar = e.target.result
		};
		reader.onerror = e => {
			console.log('Error uploading or selecting: ', e);
		};
	}

</script>

<svelte:head>
	<title>Super Resolution Waifu Neural Network</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	<h1>Hello weeb!</h1>
	{#if !generator.isReady}
		<p>Model not loaded</p>
	{:else}
		<p>Generator Ready</p>
	{/if}

	<h1>Upload Image</h1>
	<div id="upload">
		{#if avatar}
			<img class="avatar" src="{avatar}" alt="d" />
		{:else}
			<img class="avatar" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
		{/if}
		
		<img class="uploadBtn" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{fileinput.click();}} />
		<div class="chan" on:click={()=>{fileinput.click();}}>Choose Image</div>
		<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
	</div>

	<h1>Process</h1>
	<img class="uploadBtn" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{generator.loadImage(avatar);}} />
	<img class="uploadBtn" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{generator.generate("imagePlaceholder");}} />

	<h1>Result</h1>
	<canvas id="imagePlaceholder"></canvas>

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