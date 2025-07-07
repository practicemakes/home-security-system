export const prerender = false;

export async function POST({request}) {
    const { token } = await request.json();

    if (!token) {
        return new Response(JSON.stringify({ success: false }), { status: 400 });
    }

    const formData = new FormData();
    formData.append('secret', import.meta.env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    return new Response(JSON.stringify({ success: result.success }));
}