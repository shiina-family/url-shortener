const postUrl = () => {
  const callback = async() => {
    // const endPoint = "https://u.shiina.family"
    const endPoint = "https://8083.shiina.family"
    const data = new FormData(document.getElementById("url-shortener-form") as HTMLFormElement);
    const slug = data.get('shorten_slug') as string;
    const target = data.get('target_url') as string;
    const params = {'slug': slug, 'target': target}
    const qs = new URLSearchParams(params);

    fetch(`${endPoint}/register?${qs}`, {method: "POST", mode: 'no-cors'})
      .then(async response => {
        const responseText = await response.text();
        if (response.status === 201) {
          alert(responseText);
        } else {
          alert(responseText);
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log("failure");
      });
  }
  callback().then()
};

