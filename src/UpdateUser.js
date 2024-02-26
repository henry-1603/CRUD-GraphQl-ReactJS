import React, { useState ,Suspense } from 'react';
import { gql, useMutation, useQuery, useSuspenseQuery} from '@apollo/client';

// Define the GraphQL mutation for updating a user
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $email: String!) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
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
    id: '',
    name: '',
    email: ''
  });

  // Query to fetch all users
  const { loading, error, data , refetch} = useQuery(GET_USERS);

  // Mutation to update a user
  const [updateUser] = useMutation(UPDATE_USER, {
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
      // Send mutation request to update user data
      await updateUser({
        variables: { id: formData.id, name: formData.name, email: formData.email }
      });
      // Reset the form after submission
      setFormData({
        id: '',
        name: '',
        email: ''
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Update User</h1>
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
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update User</button>
      </form>

      <button onClick={() => refetch({
        id:2
      })} >Refresh</button>
      {/* Display list of users */}
      <h2>List of Users</h2>
      <ul>
        {data.users.map(user => (
          <li key={user.id}>{user.id} : {user.name} - {user.email}</li>
        ))}
      </ul>

<hr></hr><hr></hr>

<Suspense fallback={<div>Loading...</div>}>
      <UserData id="1" />
    </Suspense>

    </div>
  );
}

function UserData({ id }) {
  const { data } = useSuspenseQuery(GET_USERS, {
    variables: { id },
  });
  
  console.log(data.users[id].name);
  return <>Name: {data.users[id].name}</>;
}

export default App;
