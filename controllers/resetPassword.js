const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const Forgotpassword = require('../models/forgotPassword');
const { UUIDV4 } = require('sequelize');

exports.forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const id = uuid.v4();

            user.createForgotpassword({ id, isactive: true })
            .then(res => console.log('Create forgotPassword Completed'))
            .catch(err => {
                throw new Error(err)
            })
                    const client = Sib.ApiClient.instance;
                    const apiKey = client.authentications['api-key'];
                    apiKey.apiKey = process.env.API_KEY;
                    const tranEmailApi = new Sib.TransactionalEmailsApi();

                    const sender = {
                        email: 'omkarbende777@gmail.com',
                        name: 'Omkar @ Expense Tracker App',
                    };

                    const receivers = [
                        {
                            email: req.body.email,
                        },
                    ];

                    tranEmailApi.sendTransacEmail({
                        sender,
                        to: receivers,
                        subject: 'Reset Password',
                        htmlContent: `<h2>Reset Password</h2>
                        <p> <a href='http://54.163.199.108:3000/password/resetpassword/${id}'>Click Here</a> to reset password</p>`,
                    })
                    .then((result) => {
                        console.log('Sent>>>>', result);
                        res.status(202).json({
                            success: true,
                            message: 'Reset Password Link sent successfully',
                        });
                    })
                    .catch((error) => {
                        console.error('SendinBlue Error:', error.response ? error.response.body : error.message);
                        throw new Error(error);
                    });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Catch Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};


exports.resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;

        const forgotPassReq = await Forgotpassword.findOne({ where: { id: id, isactive: true } });
       if (forgotPassReq.isactive) {
           forgotPassReq.update({ isactive: false });
            res.status(200).send(`
                <html> 
                    <form id="resetPasswordForm" action="http://54.163.199.108:3000/password/updatepassword/${id}" method="POST">
                        <label for="newPassword">New Password</label>
                        <input name="newPassword" id="newPassword" type="password" required autocomplete="new-password">
                        <button type="submit">Reset Password</button>
                    </form>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js"></script>
                    <script>
                        document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
                            event.preventDefault();
                            const newPassword = document.getElementById('newPassword').value;
                            const id = "${id}"; // Use "${id}" for plain HTML templates
                            try {
                                const response = await axios.post(\`http://54.163.199.108:3000/password/updatepassword/\${id}\`, { newPassword });
                                console.log(newPassword);
                                console.log(response.data);
                                alert(response.data.message);
                            } catch (error) {
                                console.error(error);
                                alert('Error updating password.');
                            }
                        });
                    </script>
                </html>`
            );
      } else {
           console.log('isactive ==== false');
      }
    } catch (error) {
        res.json({ success: false, message: 'reset password controller failed' });
    }
}

exports.udpatePassword = async (req, res, next) => {
    console.log('Update Password route hit');
    console.log('Request Body:', req.body);

    try {
        const resetid = req.params.id || req.body.id; 
        console.log('Reset ID:', resetid);

        if (!resetid) {
            return res.status(400).json({ success: false, message: 'Reset ID is missing' });
        }

        const resetPassReq = await Forgotpassword.findOne({ where: { id: resetid, isactive: false } });

        if (!resetPassReq) {
            console.log('Reset request not found');
            return res.status(404).json({ success: false, message: 'Reset request not found' });
        }

        const user = await User.findOne({ where: { id: resetPassReq.userId } });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const saltRounds = 10;
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        console.log('Hashed Password:', hashedPassword);
        
        await user.update({ password: hashedPassword });
        await resetPassReq.update({ isactive: true }); // update isactive back to true

        console.log('Password Updated Successfully');

        return res.status(201).json({ message: 'Password Updated Successfully', success: true });
    } catch (error) {
        console.error('Update Password Error:', error);
        return res.status(500).json({ err: error, success: false });
    }
};


// exports.udpatePassword = async (req, res, next) => {
//     console.log('Update Password route hit');
//     console.log('Request Body:', req.body);
//     try {
//         const resetid = req.params.id || req.body.id; 
//         console.log('Reset ID:', resetid);
      
//         const newPassword = req.body.newPassword;
//         if (!resetid) {
//             return res.status(400).json({ success: false, message: 'Reset ID is missing' });
//         }
//       //  console.log(newPassword)
//         const resetPassReq = await Forgotpassword.findOne({where: {id: resetid, isactive: false}})
//         const user = await User.findOne({where: { id: resetPassReq.usedId}});
//       //  console.log(user);
//         if(user) {
//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//             console.log('Hashed Password:', hashedPassword); // Add this line
//             await user.update({password: hashedPassword});
//             return res.status(201).json({message: 'Password Updated Successfully', success: true})
//             alert('successful');
//         } else {
//             return res.status(404).json({message: 'User Not Found'})
//         }
//     } catch (error) {
//         console.error('Update Password Error:', error); // Add this line
//         return res.status({err: error, success: false})
//     }
// }
