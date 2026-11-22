export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const token = body.token;
    const repo = "redstar287888-hash/chitro-mart-bd";

    const headers = {
      "Authorization": `token ${token}`,
      "User-Agent": "Chitro-Mart-Admin",
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    };

    const imgRes = await fetch(`https://github.com{repo}/contents/${body.imgPath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Add image ${body.imgPath}`,
        content: body.base64Img
      })
    });

    if (!imgRes.ok) {
      const err = await imgRes.json();
      return new Response(JSON.stringify({ error: err.message || "Token ভুল অথবা repo পারমিশন নেই!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const prodRes = await fetch(`https://github.com{repo}/contents/${body.jsonPath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Add product ${body.title}`,
        content: body.jsonContent
      })
    });

    if (!prodRes.ok) {
      const err = await prodRes.json();
      return new Response(JSON.stringify({ error: err.message || "প্রোডাক্ট সেভ হয়নি!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
