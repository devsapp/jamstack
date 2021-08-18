import { Logger } from '@serverless-devs/core';

export default class ComponentLogger {
  static CONTENT = 'Jamstack';

  static setContent(content) {
    ComponentLogger.CONTENT = content;
  }

  static log(m) {
    Logger.log(m);
  }

  static info(m) {
    Logger.info(ComponentLogger.CONTENT, m);
  }

  static debug(m) {
    Logger.debug(ComponentLogger.CONTENT, m);
  }

  static error(m) {
    Logger.error(ComponentLogger.CONTENT, m);
  }

  static warning(m) {
    Logger.warn(ComponentLogger.CONTENT, m);
  }

  static success(m) {
    Logger.log(m, 'green');
  }

  static fatal(m) {
    Logger.log(m, 'red');
  }
}
