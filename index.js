/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {simulatorApp} from './src/simulatorApp';

AppRegistry.registerComponent(appName, () => simulatorApp);
