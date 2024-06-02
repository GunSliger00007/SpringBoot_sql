import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users', formData);
            setUsers([...users, response.data]);
            setFormData({ name: '', email: '' });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${id}`);
            const updatedUsers = users.filter(user => user.id !== id);
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const updateUserForm = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${id}`);
            setSelectedUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/users/${selectedUser.id}`, selectedUser);
            // Update the users list with the updated user data
            const updatedUsers = users.map(user => {
                if (user.id === selectedUser.id) {
                    return selectedUser;
                }
                return user;
            });
            setUsers(updatedUsers);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <button type="submit">Create</button>
            </form>

            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                        <button onClick={() => updateUserForm(user.id)}>Update</button>
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
                    <h2>Update User</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={selectedUser.name}
                            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={selectedUser.email}
                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                        <button type="submit" style={{ marginRight: '10px' }}>Update</button>
                        <button type="button" onClick={() => setSelectedUser(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserForm;
