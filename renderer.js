document.getElementById('login-button').addEventListener('click', async () => {
    console.log("Login button clicked!");  
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log("Sending login request:", { username, password });
  
    try {
      const response = await window.electronAPI.login(username, password);
      console.log("Received response from main.js:", response);
  
      if (response.success) {
        document.getElementById('user-info').innerText = `Welcome, ${response.full_name}!`;
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error("Error in renderer.js:", err);
    }
  });
  