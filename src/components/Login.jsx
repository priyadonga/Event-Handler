import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import img from "./img/medicines.jpg";

const LoginForm = ({ onLogin, onForgotPassword, passwordResetShown, newPassword, onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }
        if (username === 'priya' && password === '12345' || password === newPassword) {
            onLogin(username, password);
        } else {
            alert('Incorrect username or password. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="card-title text-center">Login</h2>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label>Username :-</label>
                                    <input type="text" className="form-control my-2" value={username} onChange={(e) => setUsername(e.target.value)} disabled={passwordResetShown} />
                                </div>
                                <div className="form-group">
                                    <label>Password :-</label>
                                    <input type="password" className="form-control mt-2" value={password} onChange={(e) => setPassword(e.target.value)} disabled={passwordResetShown} />
                                </div>
                                <div className="form-group mt-3">
                                    <button type="button" className="btn btn-primary btn-block" onClick={handleLogin} disabled={passwordResetShown}>Login</button>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <button className="btn btn-link text-primary" onClick={onForgotPassword}>Forgot Password?</button>
                            <button className="btn btn-link text-primary" onClick={onSignup}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuccessfulLogin = ({ username }) => {
    const [data, setData] = useState([]);
    const nameRef = useRef();
    const quantityRef = useRef();
    const priceRef = useRef();
    const expiryRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get("http://localhost:3001/post").then((res) => {
            setData(res.data);
        });
    };

    const handleSubmit = () => {
        const newData = {
            name: nameRef.current.value,
            quantity: quantityRef.current.value,
            price: priceRef.current.value,
            expiry: expiryRef.current.value,
        };

        axios.post("http://localhost:3001/post", newData).then((res) => {
            setData([...data, res.data]);
        });
    };

    const deleteData = (id) => {
        axios.delete(`http://localhost:3001/post/${id}`).then(() => {
            setData(data.filter((val) => val.id !== id));
        }).catch(error => {
            console.error("Error deleting data:", error);
        });
    };

    const [selectedCard, setSelectedCard] = useState(null);
    const viewCardDetails = (id) => {
        setSelectedCard(selectedCard === id ? null : id);
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col mt-2">
                        <div className="alert alert-success text-center" role="alert">
                            Logging Successful! Welcome, {username}!
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="d-flex">
                        <input type="text" className="form-control me-2 h-100" placeholder="Enter name" ref={nameRef} />
                        <input type="number" className="form-control me-2 h-100" placeholder="Enter quantity" ref={quantityRef} />
                        <input type="number" className="form-control me-2 h-100" placeholder="Enter price" ref={priceRef} />
                        <input type="number" className="form-control me-2 h-100" placeholder="Enter expiry" ref={expiryRef} />
                        <button onClick={handleSubmit} className="btn btn-success h-100 w-100">Add New Card</button>
                    </div>
                </div>

            </div>
            <div className="row">
                {data.map((val) => (
                    <div key={val.id} className='col-md-3'>
                        <div className="card mt-3 shadow">
                            <img src={img} className="card-img-top" alt={val.name} style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title mb-2">ID :- {val.id}</h5>
                                <h5 className="card-title mb-2">Name :- {val.name}</h5>
                                <button className="btn btn-primary btn-block me-2" onClick={() => viewCardDetails(val.id)}>View</button>
                                <button onClick={() => deleteData(val.id)} className="btn btn-danger">Delete</button>
                                {selectedCard === val.id && (
                                    <div className='mt-3'>
                                        <h2 className='text-primary'>Details :-</h2>
                                        <h5 className='mt-3'>ID :- {val.id}</h5>
                                        <h5>Name :- {val.name}</h5>
                                        <p className='mb-1'>Quantity :- {val.quantity}</p>
                                        <p className='mb-1'>price :- $ {val.price}</p>
                                        <p className='mb-1'>Expiry :- {val.expiry}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};


const ResetPasswordForm = ({ onResetPassword, onCancel }) => {
    const [newPassword, setNewPassword] = useState('');

    const handleResetPassword = () => {
        onResetPassword(newPassword);
        setNewPassword('');
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="card-title text-center">Forgot Password</h2>
                        </div>
                        <div className="card-body">
                            <label>Enter your new password :-</label>
                            <input type="password" className="form-control my-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="card-footer text-center">
                            <button className="btn btn-primary" onClick={handleResetPassword}>Reset Password</button>
                            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignupForm = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }
        onSignup(username, password);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="card-title text-center">Sign Up</h2>
                        </div>
                        <div className="card-body">
                            <label>Username :-</label>
                            <input type="text" className="form-control my-2" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <label>Password :-</label>
                            <input type="password" className="form-control mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="card-footer text-center">
                            <button className="btn btn-primary" onClick={handleSignup}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignupConfirmation = ({ username }) => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="alert alert-success text-center" role="alert">
                        Registration Successful ! Welcome, {username} !
                    </div>
                </div>
            </div>
        </div>
    );
};

const Login = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showSignup, setShowSignup] = useState(false);
    const [showSignupConfirmation, setShowSignupConfirmation] = useState(false);
    const [medicineData, setMedicineData] = useState([]);

    const handleLogin = (username, password) => {
        console.log('Logging in with:', "Username :-", username, " Password :-", password);
        setLoggedIn(true);
        setLoggedInUsername(username);
        setShowSignupConfirmation(false);
    };

    const handleResetPassword = (newPassword) => {
        console.log('Password reset with new password:', newPassword);
        setNewPassword(newPassword);
        setShowResetPassword(false);
    };

    const toggleSignupForm = () => {
        setShowSignup(!showSignup);
    };

    const handleSignup = (username, password) => {
        setLoggedIn(true);
        setLoggedInUsername(username);
        setShowSignupConfirmation(true);
        setShowLogin(false);
    };

    const handleAddNewval = (newval) => {
        setMedicineData([...medicineData, newval]);
    };

    const handleDeleteval = (id) => {
        setMedicineData(medicineData.filter((val) => val.id !== id));
    };

    return (
        <div className="container-fluid">
            {showLogin && !loggedIn && <LoginForm onLogin={handleLogin} onForgotPassword={() => setShowResetPassword(true)} passwordResetShown={showResetPassword} newPassword={newPassword} onSignup={toggleSignupForm} />}
            {loggedIn && !showSignupConfirmation && <SuccessfulLogin username={loggedInUsername} onAddNewval={handleAddNewval} onDeleteval={handleDeleteval} />}
            {showResetPassword && <ResetPasswordForm onResetPassword={handleResetPassword} onCancel={() => setShowResetPassword(false)} />}
            {showSignup && <SignupForm onSignup={handleSignup} />}
            {showSignupConfirmation && <SignupConfirmation username={loggedInUsername} />}
        </div>
    );
};

export default Login;