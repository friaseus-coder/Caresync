import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import i18n from '@/lib/i18n';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          {i18n.t('explore.title')}
        </ThemedText>
      </ThemedView>
      <ThemedText>{i18n.t('explore.description')}</ThemedText>
      <Collapsible title={i18n.t('explore.routing_title')}>
        <ThemedText>
          {i18n.t('explore.routing_desc', { 
            screen1: 'app/(tabs)/index.tsx', 
            screen2: 'app/(tabs)/explore.tsx', 
            layout: 'app/(tabs)/_layout.tsx' 
          })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{i18n.t('explore.learn_more')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={i18n.t('explore.platforms_title')}>
        <ThemedText>
          {i18n.t('explore.platforms_desc', { key: 'w' })}
        </ThemedText>
      </Collapsible>
      <Collapsible title={i18n.t('explore.images_title')}>
        <ThemedText>
          {i18n.t('explore.images_desc', { x2: '@2x', x3: '@3x' })}
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{i18n.t('explore.learn_more')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={i18n.t('explore.themes_title')}>
        <ThemedText>
          {i18n.t('explore.themes_desc', { hook: 'useColorScheme()' })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">{i18n.t('explore.learn_more')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={i18n.t('explore.animations_title')}>
        <ThemedText>
          {i18n.t('explore.animations_desc', { 
            component: 'components/HelloWave.tsx', 
            library: 'react-native-reanimated' 
          })}
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              {i18n.t('explore.parallax_desc', { component: 'components/ParallaxScrollView.tsx' })}
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
