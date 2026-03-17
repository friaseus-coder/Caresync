
import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const GoogleSignIn = () => {
  const { signIn, signOut, user } = useAuth();

  return (
    <View>
      {user ? (
        <Button title="Sign Out" onPress={signOut} />
      ) : (
        <Button title="Sign in with Google" onPress={() => signIn()} />
      )}
    </View>
  );
};

export default GoogleSignIn;
