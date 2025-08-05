// App.jsx
import React, { useState } from 'react'
import SecureNumberPad from './SecureNumberPad'

const App = () => {
  const [password, setPassword] = useState('')

  return (
    <div style={{ padding: '20px' }}>
      <h2>安全数字键盘</h2>
      <p>输入值: {password}</p>

      <SecureNumberPad
        value={password}
        onChange={setPassword}
        maxLength={6}
        placeholder="请输入6位密码"
        enableVibration={true}
      />
    </div>
  )
}

export default App
