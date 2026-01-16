import '@/styles/LoginPage.css';

const LoginRegister = () => {
  return (
    <div className="login-body">
      <div className="login-container">
        <div className="drop">
          <div className="content">
            <h2>Login</h2>
            <form>
              <div className="input-box">
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-box">
                <input type="password" placeholder="Password" />
              </div>
              <div className="input-box">
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
        <a href="#" className='btn'>Forgot Password</a>
        <a href="#" className='btn signup'>Signup</a>
      </div>
    </div>
  );
};

export default LoginRegister;
