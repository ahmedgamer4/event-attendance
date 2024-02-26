<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount, beforeUpdate } from 'svelte';

	let show = false;

	let scanning = false;

	let html5Qrcode: any;

	let from = '';
	let to = '';

	onMount(init);
	// beforeUpdate(init);

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	function start() {
		html5Qrcode = new Html5Qrcode('reader');
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 250 }
			},
			onScanSuccess,
			onScanFailure
		);
		scanning = true;
	}

	async function stop() {
		await html5Qrcode.stop();
		scanning = false;
	}

	async function onScanSuccess(decodedText: string, decodedResult: string) {
		alert(`matched ${decodedText}`);
		try {
			const respGET = await fetch(`/students?code=${decodedText}&sheetFrom=${from}&sheetTo=${to}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const resGET = await respGET.json();
			if (resGET.inOriginalSheet === false) {
				alert(`Student ${decodedText} is not in the original sheet`);
			} else if (resGET.found === true) {
				alert(`Student ${decodedText} already exists`);
			} else {
				const resp = await fetch('/students', {
					method: 'POST',
					body: JSON.stringify({ code: decodedText, sheetFrom: from, sheetTo: to }),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const res = await resp.json();
				alert(res.studentData);
				alert(`Added ${decodedText} to the sheet`);
			}
		} catch (error) {
			alert(error);
		}
	}

	function onScanFailure(error: Error) {
		// console.warn(`Code scan error = ${error}`);
	}
</script>

{#if show}
	<main>
		<reader id="reader" />
		{#if scanning}
			<Button on:click={stop}>stop</Button>
		{:else}
			<Button on:click={start}>start</Button>
		{/if}
	</main>
{/if}

{#if !show}
	<div class="px-8 pt-10">
		<div class="mb-2">
			<Label for="from">From</Label>
			<Input id="from" name="from" bind:value={from} />
		</div>
		<div class="mb-3">
			<Label for="to">To</Label>
			<Input id="to" name="to" bind:value={to} />
		</div>
		<Button on:click={() => (show = true)} type="button">Submit</Button>
	</div>
{/if}

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}
	reader {
		width: 100%;
		min-height: 200px;
		background-color: black;
	}
</style>
