import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();

    async function login(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8080/auth/login", {
                username: username,
                password: password
            }).then((res) => {
                console.log(res.data);
                console.log(res.data.result.authenticated);

                if (res.data.result.authenticated === true) {
                    alert("Login successful");
                }
            });
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                console.log(err.request);
            } else {
                console.log('Error', err.message);
            }
            console.log(err.config);
            alert("Network error: " + err.message);
        }
    }

    return (
        <div>
            <div class="container">
                <div class="row">
                    <h2>Login</h2>
                    <hr />
                </div>
                <div class="row">
                    <div class="col-sm-6">

                        <form>
                            <div class="form-group">
                                <label>Username</label>
                                <input class="form-control" id="username" placeholder="Enter Username"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                    }}
                                />
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter Password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                />
                            </div>
                            <button type="submit" class="btn btn-primary"
                                onClick={login}
                            >Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;