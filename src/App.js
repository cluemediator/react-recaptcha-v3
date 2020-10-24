import { useEffect, useState } from 'react';
const SITE_KEY = "<ENTER_YOUR_SITE_KEY>";

function App() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    }

    // load the script by passing the URL
    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, function () {
      console.log("Script loaded!");
    });
  }, []);

  const handleOnClick = e => {
    e.preventDefault();
    setLoading(true);
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(token => {
        submitData(token);
      });
    });
  }

  const submitData = token => {
    // call a backend API to verify reCAPTCHA response
    fetch('http://localhost:4000/verify', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "email": email,
        "g-recaptcha-response": token
      })
    }).then(res => res.json()).then(res => {
      setLoading(false);
      setResponse(res);
    });
  }

  return (
    <div className="App">
      <h3>reCAPTCHA v3 in React - <a href="https://www.cluemediator.com/" target="_blank">Clue Mediator</a></h3>
      <div className="box">
        <label>Name: </label>
        <input type="text" onChange={e => setName(e.target.value)} value={name} />
      </div>
      <div className="box">
        <label>Email: </label>
        <input type="text" onChange={e => setEmail(e.target.value)} value={email} />
      </div>
      <button onClick={handleOnClick} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      <br /><br />
      {response && <label>Output:<br /><pre>{JSON.stringify(response, undefined, 2)}</pre></label>}
    </div>
  );
}

export default App;
