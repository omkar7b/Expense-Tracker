async function addexpense(event){
    try {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
    
        const expense = {
            amount: amount,
            description: description,
            category: category
        }
         console.log(expense);
         const token = localStorage.getItem('token');
        const response = await axios.post('http://54.163.199.108/:3000/expense/add-expense', expense, {headers: {"Authorization" : token} })
        showExpenseInTable(response.data.newExpense);
        showExpenseOnScreen(response.data.newExpense)
    }
    catch (error) {
        console.log(error);
    }
}

async function showPremiumUser(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://54.163.199.108/:3000/purchase/ispremium', { headers: { "Authorization": token } } )
        //console.log(response.data);
    if (response.data.user.ispremiumuser == true){
        let premiumUserMessage = document.getElementById('premiumUser')
        premiumUserMessage.textContent = 'Premium User';
        premiumUserMessage.style.fontSize = 'large';
        premiumUserMessage.style.color = 'white';
        premiumUserMessage.style.fontWeight = 'bold';
        let button = document.getElementById('rzp-button')
        button.style.display = 'none';
        
    }
    else {
        document.getElementById('rzp-button').style.display = 'block';
    }
    } catch (err) {
        console.log(err);
    }
    
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://54.163.199.108/:3000/purchase/ispremium', { headers: { "Authorization": token } } )
        const isPremiumUser = res.data.user.ispremiumuser;
        console.log(isPremiumUser);
        if(isPremiumUser){
            showPremiumUser();  //premium feature
            showLeaderboard();  //premium feature
        }
        else {
            document.getElementById('rzp-button').style.display = 'block';
        }
        document.querySelector('#expenseperpage').value = localStorage.getItem('expPerPage');
        const page=1;
        const pagesize = localStorage.getItem('expPerPage');
        const response = await axios.get(`http://54.163.199.108/:3000/expense/get-expense?pagesize=${pagesize}&page=${page}`, {headers: {"Authorization" : token} });
            const expenses = response.data.expenses;
            expenses.forEach(expense => {
                showExpenseInTable(expense);
                //showExpenseOnScreen(expense);
            });
            showPagination(response.data.nextPage, response.data.previousPage, response.data.currentPage, response.data.hasPreviousPage, response.data.hasNextPage, response.data.lastPage);
            recentdownload();
    } catch (error) {
        console.log('Error while fetching data', error);
    }
});

function showPagination(nextPage, previousPage, currentPage, hasPreviousPage, hasNextPage, lastPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.style.width='30px';
        btn2.style.height='30px';
        btn2.style.backgroundColor='white';
        btn2.addEventListener('click', () => getExpenses(previousPage));
        pagination.appendChild(btn2);
    }
    const btn = document.createElement('button');
    btn.innerHTML = `<h5>${currentPage}</h5>`;
    btn.style.width='30px';
    btn.style.height='30px';
    btn.style.backgroundColor='white';
    btn.addEventListener('click', () => getExpenses(currentPage));
    pagination.appendChild(btn);

    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.style.width='30px';
        btn3.style.height='30px';
        btn3.style.backgroundColor='white';
        btn3.addEventListener('click', () => getExpenses(nextPage));
        pagination.appendChild(btn3);
    }
}
// button.style.padding = '6px 10px';
//     button.style.margin = '0 3px';
//     button.style.fontSize = '14px';
//     button.style.cursor = 'pointer';


async function getExpenses(page) {
    try {
        const pagesize = localStorage.getItem('expPerPage');
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://54.163.199.108/:3000/expense/get-expense?pagesize=${pagesize}&page=${page}`, { headers: { "Authorization": token }});
        const expArr = response.data.expenses;
        document.getElementById('tbody').innerHTML = '';
        expArr.forEach((exp) => {
            showExpenseInTable(exp)
        })
        showPagination(response.data.nextPage, response.data.previousPage, response.data.currentPage, response.data.hasPreviousPage, response.data.hasNextPage, response.data.lastPage);
    } catch (error) {
        console.log(error)
    }
}


function showExpenseOnScreen(expense){
    let parentElement = document.getElementById('listOfExpenses');
    let addExpense = document.createElement('li');
    addExpense.id = 'addExpense';
    addExpense.innerHTML = `${expense.amount} - ${expense.description} - ${expense.category}`;

    let deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.style.backgroundColor = 'red';
    deleteBtn.style.color = 'white';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.borderRadius = '5px';

    deleteBtn.onclick = async () => {
    const id = expense.id;
    //console.log(expense.id);
    
    const token = localStorage.getItem('token');
    await axios.delete(`http://54.163.199.108/:3000/expense/delete-expense/${id}`, {headers: {"Authorization" : token} })
    parentElement.removeChild(addExpense);
   // console.log('>>>>>successfull')
   }

    addExpense.appendChild(deleteBtn);
    parentElement.appendChild(addExpense);
}

document.getElementById('rzp-button').onclick = async (e) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://54.163.199.108/:3000/purchase/premiummembership', { headers: { "Authorization": token } });
    console.log('Response:', response);

    // Extract the order_id from the response
    const order_id = response.data.order.orderid;
    console.log(order_id);

    var options = {
        "key": response.data.key_id,
        "order_id": order_id, // Use the extracted order_id
        "handler": async function (response) {
            // Use the 'response' object directly here
            const result = await axios.post('http://54.163.199.108/:3000/purchase/updatetransactionstatus', {
                order_id: order_id, // Use the extracted order_id
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } });

            alert('You are a Premium User Now');
            localStorage.setItem('token', result.data.token);
            showPremiumUser();
            showLeaderboard(); 
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed', function (response) {
        axios.post('http://54.163.199.108/:3000/purchase/updatetransactionstatus', {
            orderid: order_id, // Use the extracted order_id
            paymentid: response.error.reason,
        }, { headers: { "Authorization": token } })
        alert('Payment Failed => Try Again');
    })
}


function showLeaderboard() {
    let LeaderButton = document.createElement('input');
    LeaderButton.type = 'button';
    LeaderButton.value = 'Show Leaderboard';
    LeaderButton.style.color = 'white';
    LeaderButton.style.borderRadius = '5px';
    LeaderButton.style.backgroundColor = 'rgb(20, 216, 20)';
    LeaderButton.style.width = '160px'

    LeaderButton.onclick = async () => {
        const token = localStorage.getItem('token');
        let userLeaderboard = await axios.get('http://54.163.199.108/:3000/premium/showleaderboard', { headers: { "Authorization": token } });
    
        console.log(userLeaderboard);
    
        let LeaderboardEle = document.getElementById('leaderboard');
        LeaderboardEle.innerHTML = ''; // Clear previous data
    
        // Create the table element
        let leaderboardTable = document.createElement('table');
        leaderboardTable.innerHTML += '<h1 style="color:blueviolet; text-align:center;"> Leader Board </h1>';
        leaderboardTable.style.color = 'black';
    
        // Create the table header row
        let headerRow = leaderboardTable.insertRow();
        let nameHeader = headerRow.insertCell(0);
        let expenseHeader = headerRow.insertCell(1);
        nameHeader.innerHTML = '<b>Name</b>';
        expenseHeader.innerHTML = '<b>Total Expense</b>';
    
        const userLeaderboardDetails = userLeaderboard.data;
        userLeaderboardDetails.forEach((userDetails) => {
            // Create a new row for each user
            let row = leaderboardTable.insertRow();
            let nameCell = row.insertCell(0);
            let expenseCell = row.insertCell(1);
    
            // Populate the cells with user details
            nameCell.innerText = userDetails.name;
            expenseCell.innerText = userDetails.totalExpense;
        });
    
        // Append the table to the leaderboard element
        LeaderboardEle.appendChild(leaderboardTable);
    }
    
    let parentEle = document.getElementById('leaderbutton');
    parentEle.appendChild(LeaderButton);
    
   
}

function showExpenseInTable(expense) {
    let tr = document.createElement('tr');

    let currentDate = new Date();
    let formattedDate = currentDate.toLocaleDateString();

    let td1 = tr.appendChild(document.createElement('td'));
    let td2 = tr.appendChild(document.createElement('td'));
    let td3 = tr.appendChild(document.createElement('td'));
    let td4 = tr.appendChild(document.createElement('td'));

    td1.innerHTML = formattedDate;
    td2.innerHTML = expense.amount;
    td3.innerHTML = expense.description;
    td4.innerHTML = expense.category;

    let td5 = document.createElement('td');
    td5.innerHTML = 'Delete Expense';
    td5.style.color = 'red';
    td5.style.fontWeight = 'bold';
    td5.style.cursor = 'pointer';
    td5.style.textDecoration = 'underline';
    td5.onclick = async()=> {
        try {
            const id = expense.id;
            const token = localStorage.getItem('token');
            await axios.delete(`http://54.163.199.108/:3000/expense/delete-expense/${id}`, {headers: {"Authorization" : token} });
            document.getElementById('tbody').removeChild(tr);
        }
        catch(error) {
            let errDiv = document.createElement('div');
            let errorDiv = document.getElementById('error');
            errDiv.innerHTML = `<div style="color:red">Error: ${error.message}</div>`;
            errorDiv.appendChild(errDiv);
        }
    }
    tr.appendChild(td5);
    document.getElementById('tbody').appendChild(tr);
}


function download() {
    const token = localStorage.getItem('token');
    axios.get('http://54.163.199.108/:3000/expense/download', { headers: { "Authorization": token } })
    .then(response => {
        //backend is essentially sending a download link
        //which if we open in brwoser, file would download
        if(response.status === 200) {
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
        console.log(response);
        } else {
            throw new Error(response.data.message);
        }
    })
    .catch(err => {
        console.log(err);
    })
}

function recentdownload() {
    const token = localStorage.getItem('token');
    axios.get('http://54.163.199.108/:3000/expense/recentdownload', { headers: { "Authorization": token }})
    .then((response) => {
        let recentdownloads = document.getElementById('recentdownloads');
        response.data.forEach((data) => {
            let file = document.createElement('li');
            file.innerHTML =  `<a style="color:red"href="${data.fileURL}">Downloaded On ${data.date}</a>`;
            recentdownloads.appendChild(file);
            console.log(data.fileURL)
        })
    })
    .catch(err => console.log(err));
}

document.querySelector('#expenseperpage').addEventListener('change', () => {
    console.log('expenserow=>>', document.querySelector('#expenseperpage').value);
    localStorage.setItem('expPerPage', document.querySelector('#expenseperpage').value);
    location.reload();
})