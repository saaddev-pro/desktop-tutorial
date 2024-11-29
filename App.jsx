import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelHeader, MessageList, MessageInput } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { chatConfig } from "./config";  // Assuming you have your API key stored here

const App = () => {
  const [client] = useState(() => new StreamChat(chatConfig.apiKey));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const users = [
    { id: "user1", name: "Alice" },
    { id: "user2", name: "Bob" },
  ];

  useEffect(() => {
    // Fetch token from the backend for the selected user
    const connectUser = async (userId) => {
      const response = await fetch('http://localhost:3000/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const { token } = await response.json();

      // Connect the user to the Stream Chat client
      client.connectUser({ id: userId, name: 'Tutorial User' }, token);
      setUser({ id: userId, name: 'Tutorial User' });
      setLoading(false);  // Stop loading when user is connected
    };

    // Automatically connect a user if needed
    if (!user) {
      connectUser("user1"); // Example: connect as "user1" by default
    }
  }, [user, client]);

  const connectUser = (selectedUser) => {
    client.connectUser(
      { id: selectedUser.id, name: selectedUser.name },
      client.devToken(selectedUser.id)
    );
    setUser(selectedUser);
  };

  if (loading) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h3>Select a user:</h3>
        {users.map((u) => (
          <button key={u.id} onClick={() => connectUser(u)}>
            {u.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Chat client={client}>
      <Channel channel={client.channel("messaging", "general")}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default App;
