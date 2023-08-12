import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [new_password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    setLoading(true);
    const userData = {
      email: email,
      new_password: new_password,
      roles: [
        {
          role: 'Publisher',
          parenttype: 'User',
          parentfield: 'roles',
          doctype: 'Has Role',
        },
      ],
    };

    fetch(`https://thz.fm/api/resource/User`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(() => {
      setLoading(false);
      navigate('/dashboard'); // Redirect to a success page or dashboard
    })
    .catch((error) => {
      setLoading(false);
      console.error(error);
    });
  };

return (
    <div className="mt-24 form-bg items-center relative h-screen">
      <div className="overlay form-bg absolute inset-0 z-0"></div>
      <div className="mx-4 mx-auto relative form-bg z-10">
        <div className="sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 form-bg mx-auto">
          <div className="rounded-lg box bg-white p-6 md:px-12 md:pt-12 border-t-10 border-solid border-indigo-600 shadow-lg">
            <h2 className="text-3xl text-gray-800 text-center">Create Your Account</h2>
            <div className="signup-form mt-6 md:mt-12">
            
              <div className="border-2 border-solid rounded flex items-center mb-4">
                <div className="w-10 h-10 flex justify-center items-center flex-shrink-0">
                  <span className="far fa-envelope text-gray-500"></span>
                </div>
                <div className="flex-1">
                  <input type="text" placeholder="E-mail" className="h-10 py-1 pr-3 w-full" value={email} onChange={e => setEmail(e.target.value)}></input>
                </div>
              </div>
   
              <div className="border-2 border-solid rounded flex items-center mb-4">
                <div className="w-10 h-10 flex justify-center items-center flex-shrink-0">
                  <span className="fas fa-lock text-gray-500"></span>
                </div>
                <div className="flex-1">
                  <input type="password" placeholder="Password" className="h-10 py-1 pr-3 w-full" value={new_password} onChange={e => setPassword(e.target.value)}></input>
                </div>
              </div>

              <p className="text-sm text-center mt-6">By signing up, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a></p>
              <div className="text-center mt-6 md:mt-12">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl py-2 px-4 md:px-6 rounded transition-colors duration-300" onClick={handleRegister} disabled={loading}>Sign Up <span className="far fa-paper-plane ml-2"></span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
