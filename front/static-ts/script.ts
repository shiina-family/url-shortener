const postUrl = async () => {
  const data = new FormData(document.getElementById("url-shortener-form") as HTMLFormElement);
  const slug = data.get('shorten_slug') as string;
  const target = data.get('target_url') as string;
  const params = { 'slug': slug, 'target': target }
  const qs = new URLSearchParams(params);

  fetch(`/register?${qs}`, { method: "POST" })
    .then(async response => {
      const responseText = await response.text();
      if (response.status === 201) {
        alert(responseText);
      } else {
        alert(responseText);
      }
    })
    .then(console.log)
    .catch(error => {
      console.log("failure");
    });
};
