import React from 'react'
import Signup from './components/Signup'
import Login from './components/Login'

const App = () => {
  return (
    <div>
      <h1>Firebase 2-Step Verification</h1>
      <div>
        <Signup/>
      </div>
      <div>
        <Login/>
      </div>
      
    </div>
  )
}

export default App
