import { useState } from "react";
import axios from "axios";

function Register() {

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");

    async function save(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8080/users", {
                firstName: firstname,
                lastName: lastname,
                username: username,
                password: password,
                dob: dob
            })
            alert("User registered successfully");
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <div class="container mt-4" >
                <div class="card">
                    <h1>Register</h1>

                    <form>
                        <div class="form-group">
                            <label>First name</label>
                            <input type="text" class="form-control" id="firstname" placeholder="First Name"

                                value={firstname}
                                onChange={(event) => {
                                    setFirstname(event.target.value);
                                }}
                            />
                        </div>
                        <div class="form-group">
                            <label>Last name</label>
                            <input type="text" class="form-control" id="lastname" placeholder="Last Name"
                                value={lastname}
                                onChange={(event) => {
                                    setLastname(event.target.value);
                                }}
                            />
                        </div>

                        <div class="form-group">
                            <label>User name</label>
                            <input type="text" class="form-control" id="username" placeholder="User Name"
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }}
                            />
                        </div>

                        <div class="form-group">
                            <label>password</label>
                            <input type="password" class="form-control" id="password" placeholder="Enter password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" className="form-control" id="birthdate" placeholder="Enter Birthdate"
                                value={dob}
                                onChange={(event) => {
                                    setDob(event.target.value);
                                }}
                            />
                        </div>
                        <button type="submit" class="btn btn-primary mt-4" onClick={save} >
                            Save
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;