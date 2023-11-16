async function login(event) {
    try {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = {
            email: email,
            password: password
        }
        const response = await axios.post('http://54.163.199.108/:3000/users/login', user);
        console.log('Login Successfully');
        
        if(response.data.success==true){
            alert(response.data.message);
            localStorage.setItem('token', response.data.token)
            window.location.href = '../expense/expense.html';
        }

    } catch (err) {
        let errorDiv = document.getElementById('error');
        let errorLogin = document.createElement('div');

        if (err.response && err.response.status === 200) {
            errorLogin.textContent = 'Login Successfully';
        } 
        else if (err.response && err.response.status === 404) {
            errorLogin.textContent = 'User Not Found';
        } 
        else if (err.response && err.response.status === 401) {
            errorLogin.textContent = 'User Not Authorized';
        } 
        else {
            errorLogin.textContent = 'An error occurred';
        }
        errorDiv.appendChild(errorLogin);
        console.log(err);
    }
}
