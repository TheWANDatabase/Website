<script>
	export let schemaOrgObject;

	let jsonLdString = JSON.stringify(schemaOrgObject, null, '    ');
	let jsonLdScript = `
    <script type="application/ld+json">
        ${jsonLdString}
    ${'<'}/script>
`;
</script>

<svelte:head>
	{@html jsonLdScript}
</svelte:head>
