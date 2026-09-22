import { VILLAS, U } from "../src/server/db/seed";

const villaImages: {villa:string, id:string, url:string, alt:string}[] = [];

for (const v of VILLAS) {
  for (const img of v.images) {
    const url = U(img.id, 1600);
    villaImages.push({villa: v.slug, id: img.id, url, alt: img.alt});
  }
}

console.log(`Total villa images: ${villaImages.length}`);

async function checkUrl(url: string): Promise<{ok:boolean, status:number, contentType:string}> {
  try {
    const res = await fetch(url, {method: 'HEAD'});
    return {ok: res.ok, status: res.status, contentType: res.headers.get('content-type') || ''};
  } catch (e:any) {
    return {ok: false, status: 0, contentType: e.message};
  }
}

async function audit() {
  const broken: typeof villaImages = [];
  for (const img of villaImages) {
    const result = await checkUrl(img.url);
    if (!result.ok || result.status >= 400) {
      console.log(`BROKEN: ${img.villa} id=${img.id} status=${result.status} url=${img.url}`);
      broken.push(img);
    } else {
      console.log(`OK: ${img.villa} id=${img.id} status=${result.status} ct=${result.contentType}`);
    }
    await new Promise(r=>setTimeout(r, 150));
  }
  console.log(`\nBroken count: ${broken.length}`);
  if (broken.length>0) {
    console.log("Broken list:", broken.map(b=>`${b.villa}:${b.id}`).join(", "));
  }
}

audit();
