import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const from = formData.get('from');
		const to = formData.get('to');
    
    
	}
};
