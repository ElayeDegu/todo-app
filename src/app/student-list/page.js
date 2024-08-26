'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '@/Components/SideBar';
import RightSideBar from '@/Components/RightSideBar';
import UserDiagram from '@/Components/UserDiagram';
import '../../styles/table.css';

export default function ListPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null); 
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const changeRole = async (userId) => {
    try {
      // Send the selected role to the backend to update the user's role
      await axios.put(`/api/users`, { id:userId, role: selectedRole });
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: selectedRole } : user
        )
      );
      setEditingUserId(null); // Reset after updating
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Error updating role. Please try again later.');
    }
  };

  return (
    <>
      <SideBar/>
      <div className="header">
        <h1 className="heading">Users</h1>
        {isLoading ? (
          <p className="loading-text">Loading users...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <UserDiagram />
            <div className="header2">
              <table className="T">
                <thead>
                  <tr>
                    <th className="table-header">Users email</th>
                    <th className="table-header">role</th>
                    <th className="table-header">change role</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td className="table-cell">{user.email}</td>
                      <td className="table-cell">{user.role}</td>
                      <td className="table-cell">
                      {editingUserId === user._id ? (
                          <div>
                            <select 
                              value={selectedRole} 
                              onChange={(e) => setSelectedRole(e.target.value)}
                            >
                              <option value="">Select Role</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                              <option value="instructor">Instructor</option>
                            </select>
                            <button 
                              className="roleBtn" 
                              onClick={() => changeRole(user._id)}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="roleBtn" 
                            onClick={() => setEditingUserId(user._id)}
                          >
                            Change
                          </button>
                        )}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <RightSideBar/>
    </>
  );
}
