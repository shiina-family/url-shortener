const postUrl = () => {
  const data = new FormData(document.getElementById("url-shortener-form"));
  const slug = data.get('shorten_slug');
  const target = data.get('target_url');
  const params = {'slug': slug, 'target': target}
  const qs = new URLSearchParams(params);
  fetch(`https://u.shiina.family/register?${qs}`, {method: "POST",})
    .then(response => {
      return response.text();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log("failure");
    });
};
