
import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import i18n from '@/lib/i18n';

const GoogleSignIn = () => {
  const { signIn, signOut, user } = useAuth();

  return (
    <View>
      {user ? (
        <Button title={i18n.t('auth.sign_out')} onPress={signOut} />
      ) : (
        <Button title={i18n.t('auth.sign_in')} onPress={() => signIn()} />
      )}
    </View>
  );
};

export default GoogleSignIn;
