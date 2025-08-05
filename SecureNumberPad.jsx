import React, { memo, useEffect, useState } from 'react';
import './SecureNumberPad.css';

/**
 * @returns {string[]}
 */
const shuffled = (list) => {
  const array = list.slice()
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
}

const SecureNumberPad = ({ 
  value = '', 
  onChange, 
  maxLength = 6, 
  placeholder = '请输入密码',
  enableVibration = true,
  shuffle = true 
}) => {
  const [vb, setVb] = useState(false)
  const [keys, setKeys] = useState([])
  useEffect(() => {
    console.log('navigator.vibrate: ', navigator.vibrate)
    console.log('navigator.vibrate typeof: ', typeof navigator.vibrate)
    const vb = navigator && typeof navigator.vibrate === 'function'
    setVb(vb)
  }, [])
  useEffect(() => {
    // 数字按键（可打乱顺序增强安全）
    const dot = '.'
    const del = '←'
    const keyItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // . 可用于金额
    const keys = shuffle ? shuffled(keyItems) : keyItems.slice()
    keys.splice(9, 0, dot)
    keys.push(del)
    console.log('keys: ', keys)
    setKeys(keys)
  }, [])
 
  // 触发震动 
  const vibrate = () => {
    if (enableVibration && navigator.vibrate) {
      navigator.vibrate(100); // 震动 100ms
    } else {
      console.log('')
    }
  };

  const handleKeyClick = (key) => {
    vibrate(); // 震动反馈

    if (key === '←') {
      onChange?.(value.slice(0, -1));
      return;
    }

    if (value.length < maxLength) {
      onChange?.(value + key);
    }
  };

  return (
    <div className="secure-keyboard">
      <div>vibrate: {vb ? 1 : 0}</div>
      {/* 显示输入框（掩码） */}
      <div className="input-display">
        {value ? '●'.repeat(value.length) : <span className="placeholder">{placeholder}</span>}
      </div>

      {/* 数字键盘 */}
      <div className="keypad">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            className={`key key-${key}`}
            onMouseDown={(e) => e.preventDefault()} // 防止长按选中
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SecureNumberPad