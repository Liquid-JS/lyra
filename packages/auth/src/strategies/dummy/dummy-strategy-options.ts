import { NbAuthStrategyOptions, NbStrategyToken } from '../auth-strategy-options';
import { NbAuthSimpleToken } from '../../services/token/token';

export class NbDummyAuthStrategyOptions extends NbAuthStrategyOptions {
  override token?: NbStrategyToken = {
    class: NbAuthSimpleToken,
  };
  delay?: number = 1000;
  alwaysFail?: boolean = false;
}

export const dummyStrategyOptions: NbDummyAuthStrategyOptions = new NbDummyAuthStrategyOptions();
