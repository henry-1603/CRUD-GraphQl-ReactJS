import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Define the GraphQL mutation for deleting a user
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

// Define the GraphQL query for fetching all users
const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

function App() {
  const [formData, setFormData] = useState({
    id: ''
  });

  // Query to fetch all users
  const { loading, error, data, refetch } = useQuery(GET_USERS);

  // Mutation to delete a user
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }] // Refetch the users query after mutation
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send mutation request to delete user
      await deleteUser({
        variables: { id: formData.id }
      });
      // Reset the form after submission
      setFormData({
        id: '',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Delete User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">User ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Delete User</button>
      </form>

      <button onClick={() => refetch()}>Refresh</button>
      {/* Display list of users */}
      <h2>List of Users</h2>
      <ul>
        {data.users.map(user => (
          <li key={user.id}>{user.id} : {user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
