import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Text } from 'components';
import { useAppState } from 'containers';
import {
  palette,
  typography,
} from 'constants/style';
import { AnalyticsService } from 'services';
import { numberPad } from 'utils';

const HITSLOP = {
  top: 16,
  bottom: 16,
  left: 16,
  right: 16,
};

const COIN_ICON = { uri: 'ic_coin' };

interface Props {
  canUseFreeCoinAt: number;
  showModal: () => void;
}

const CompactFreeCoinTimer: React.FunctionComponent<Props> = ({
  canUseFreeCoinAt,
  showModal,
}) => {
  const onAppStateChange = useRef(() => setCounter((canUseFreeCoinAt - Date.now()) / 1000));

  const [counter, setCounter] = useState(0);

  const onPress = useCallback(() => {
    showModal();
    AnalyticsService.logEvent('show_coin_modal');
  }, [showModal]);

  useAppState(() => onAppStateChange.current());

  useEffect(() => {
    setCounter((canUseFreeCoinAt - Date.now()) / 1000);
  }, [canUseFreeCoinAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(counter / 60);
  const seconds = Math.floor(counter % 60);

  return (
    <TouchableOpacity
      hitSlop={HITSLOP}
      onPress={onPress}
      style={[styles.container, counter > 0 && styles.timer]}
    >
      {counter > 0 ? (
        <Text style={[typography.heading4, styles.counter]}>
          {numberPad(minutes)}:{numberPad(seconds)}
        </Text>
      ) : (
        <Image source={COIN_ICON} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 60,
    height: 28,
  },
  timer: {
    alignItems: 'center',
    borderColor: palette.gray[60],
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: palette.yellow.default,
  },
  counter: {
    marginTop: Platform.select({
      ios: 2,
      android: 0,
    }),
  },
});

export default CompactFreeCoinTimer;
