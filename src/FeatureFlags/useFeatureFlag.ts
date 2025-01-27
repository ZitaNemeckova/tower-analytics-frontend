import { useContext } from 'react';
import Context from './Context';
import { FeatureFlagType, ValidFeatureFlags } from './types';

const isBeta = () => window.location.pathname.split('/')[1] === 'beta';

// Devel environment checks
const isLocalhost = () => window.location.hostname === 'localhost';
const isEphemeral = () => window.location.hostname.includes('ephemeral');

/**
 * On ephemeral and local environments change how the flags work:
 * If not defined => enabled
 * If defined and true => enabled
 * If defined and false => disabled
 */
const isEnabledDevel = (feature?: FeatureFlagType) => {
  if (!feature) return true;
  return feature?.enabled;
};

/**
 * In non developer environment enable the feature flag as:
 * If not defined => disabled
 * If defined and true => enabled
 * If defined and false => disabled
 */
const isEnabled = (feature?: FeatureFlagType) => {
  return !!feature && feature?.enabled;
};

const useFeatureFlag = (flag: ValidFeatureFlags): boolean => {
  const features = useContext(Context);

  // On beta use the beta flag which has the 'beta_flagname' format.
  const betaFlag = `beta_${flag}`;

  const feature = features.find(
    ({ name }) => name === (isBeta() ? betaFlag : flag)
  );

  if (isLocalhost() || isEphemeral()) return isEnabledDevel(feature);

  return isEnabled(feature);
};

export default useFeatureFlag;
