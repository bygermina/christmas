import { createContext, useContext } from 'react';

export interface OrchestratorState {
  starRevealed: boolean;
  titleCompleted: boolean;
  subtitleCompleted: boolean;
}

export interface OrchestratorActions {
  notifyStarRevealed: () => void;
  notifyTitleCompleted: () => void;
  notifySubtitleCompleted: () => void;
}

export const OrchestratorStateContext = createContext<OrchestratorState | null>(null);
export const OrchestratorActionsContext = createContext<OrchestratorActions | null>(null);

export const useOrchestratorState = (): OrchestratorState => {
  const state = useContext(OrchestratorStateContext);
  if (!state) throw new Error('useOrchestratorState must be used within AnimationOrchestratorProvider');
  return state;
};

export const useOrchestratorActions = (): OrchestratorActions => {
  const actions = useContext(OrchestratorActionsContext);
  if (!actions) throw new Error('useOrchestratorActions must be used within AnimationOrchestratorProvider');
  return actions;
};
