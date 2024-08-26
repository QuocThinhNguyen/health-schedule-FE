import logo from './logo.svg';
import './App.css';

function App() {
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
                <label>Email</label>
                <input type="email" class="form-control" id="email" placeholder="Enter Name"

                // value={email}
                // onChange={(event) => {
                //   setEmail(event.target.value);
                // }}

                />
              </div>
              <div class="form-group">
                <label>password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter Fee"

                // value={password}
                // onChange={(event) => {
                //   setPassword(event.target.value);
                // }}

                />
              </div>
              <button type="submit" class="btn btn-primary"  >Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
