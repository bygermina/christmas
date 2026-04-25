import { useMemo, useState, type ReactNode } from 'react';

import {
  OrchestratorActionsContext,
  OrchestratorStateContext,
} from './animation-orchestrator-context';

export const AnimationOrchestratorProvider = ({ children }: { children: ReactNode }) => {
  const [starRevealed, setStarRevealed] = useState(false);
  const [titleCompleted, setTitleCompleted] = useState(false);
  const [subtitleCompleted, setSubtitleCompleted] = useState(false);

  const actions = useMemo(
    () => ({
      notifyStarRevealed: () => setStarRevealed(true),
      notifyTitleCompleted: () => setTitleCompleted(true),
      notifySubtitleCompleted: () => setSubtitleCompleted(true),
    }),
    [],
  );

  const state = useMemo(
    () => ({ starRevealed, titleCompleted, subtitleCompleted }),
    [starRevealed, titleCompleted, subtitleCompleted],
  );

  return (
    <OrchestratorActionsContext.Provider value={actions}>
      <OrchestratorStateContext.Provider value={state}>
        {children}
      </OrchestratorStateContext.Provider>
    </OrchestratorActionsContext.Provider>
  );
};
