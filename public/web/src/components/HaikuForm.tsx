import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../App.css';
import { HaikuFormProps, HaikuType } from '../types';

// TypeScript version of HaikuForm using functional component with hooks
const HaikuForm: React.FC<HaikuFormProps> = ({ addHaiku }) => {
  const [formData, setFormData] = useState({
    line1: '',
    line2: '',
    line3: '',
    username: '',
    font: 'Open Sans'
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [lineErrors, setLineErrors] = useState({
    line1: false,
    line2: false,
    line3: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateHaiku = (): boolean => {
    // Simple validation - in real app would check syllables
    if (!formData.line1 || !formData.line2 || !formData.line3) {
      setError('Must complete three lines for a haiku');
      return false;
    }
    if (!formData.username) {
      setError('Must specify a username');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateHaiku()) {
      return;
    }
    
    try {
      // In a real app, this would send data to the server
      // For this example, we'll create a mock haiku object
      const mockHaiku: HaikuType = {
        _id: `haiku_${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        top: Math.random() * 500,
        left: Math.random() * 500
      };
      
      addHaiku(mockHaiku);
      
      // Reset form
      setFormData({
        line1: '',
        line2: '',
        line3: '',
        username: '',
        font: 'Open Sans'
      });
      setError('');
      setMessage('Haiku added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting haiku:', err);
      setError('Failed to submit haiku');
    }
  };

  const formStyle: React.CSSProperties = {
    zIndex: 9999,
    padding: '10px',
    position: 'absolute',
    display: 'inline-block',
    top: '40px',
    left: '30px',
    border: 'solid 2px #cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff'
  };

  return (
    <div style={formStyle}>
      <div style={{paddingBottom: '5px'}}>
        <span style={{fontSize: '24px', color: '#4090a4'}}>haiku </span>
        <span style={{color: '#9040a4'}}>do you?</span>
      </div>
      
      {message && (
        <div style={{color: '#40f040', marginBottom: '10px'}}>{message}</div>
      )}
      
      {error && (
        <div style={{color: '#ff0000', marginBottom: '10px'}}>{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="line1">Line 1: </label>
          <input
            id="line1"
            name="line1"
            value={formData.line1}
            onChange={handleChange}
            style={{
              border: lineErrors.line1 ? 'solid 1px #ff0000' : 'solid 1px #ccc',
              marginBottom: '5px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="line2">Line 2: </label>
          <input
            id="line2"
            name="line2"
            value={formData.line2}
            onChange={handleChange}
            style={{
              border: lineErrors.line2 ? 'solid 1px #ff0000' : 'solid 1px #ccc',
              marginBottom: '5px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="line3">Line 3: </label>
          <input
            id="line3"
            name="line3"
            value={formData.line3}
            onChange={handleChange}
            style={{
              border: lineErrors.line3 ? 'solid 1px #ff0000' : 'solid 1px #ccc',
              marginBottom: '5px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="username">Username: </label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{marginBottom: '10px'}}
          />
        </div>
        
        <div>
          <label htmlFor="font">Font: </label>
          <select
            id="font"
            name="font"
            value={formData.font}
            onChange={(e) => setFormData(prev => ({...prev, font: e.target.value}))}
            style={{marginBottom: '15px'}}
          >
            <option value="Open Sans">Open Sans</option>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
        
        <button type="submit">Haiku!</button>
      </form>
    </div>
  );
};

export default HaikuForm;