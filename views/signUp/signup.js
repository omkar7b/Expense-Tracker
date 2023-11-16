async function signUp(event){

try {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const newUser = {
        name: name,
        email: email,
        password: password
    }
    //console.log(newUser);
    const response = await axios.post('http://54.163.199.108:3000/users/signup',newUser);
    if(response.data.success === true) {
        let errorDiv = document.getElementById('error-message');
        let errorMessage = document.createElement('div');
        errorMessage.innerHTML = `<div style="color:red">${response.data.message}</div>`;
        errorDiv.appendChild(errorMessage);
    }
}
    catch (error) {
        console.log(error.response.data.error);
        if(error.response.data.error){
            let errorDiv = document.getElementById('error-message');
            let errorMessage = document.createElement('div');
            errorMessage.innerHTML = `<div style="color:red">${'User Already Exists'}</div>`;
            errorDiv.appendChild(errorMessage);
        }
    }
}
