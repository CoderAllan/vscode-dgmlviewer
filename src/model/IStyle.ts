import {
  ICondition,
  ISetter
} from '@model';

// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export interface IStyle {
  targetType: string;
  isEnabled: boolean;
  valueLabel: string;
  toolTip: string;
  condition: ICondition;
  setters: ISetter[];
}
