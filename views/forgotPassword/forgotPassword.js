function forgotPassword(event) {
        event.preventDefault();

      //  const form = new FormData(event.target);
        const email = {
            email: event.target.email.value
        }
        console.log(email);
        axios.post('http://54.163.199.108:3000/password/forgotPassword',email)
        .then((response) => {
            if(response.data.success === true){
                alert(response.data.message)
            } else {
                alert(response.data.message);
            }
        })
        .catch(err => console.log('error at axios.post', err));  
    }
      


