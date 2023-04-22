export function removeWhitespace(string) {
  return string.trim().replace(/[\r\n]+/g, "\n").replace(/[ \t]+/g, " ");
}

export async function formDataToJson(req) {
  const formData = new URLSearchParams(await req.text());
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}
