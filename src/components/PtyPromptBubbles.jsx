import React from 'react';
import { isPlanApprovalPrompt, isDangerousOperationPrompt } from '../utils/promptClassifier';
import styles from './PtyPromptBubbles.module.css';

function PtyPromptBubbles({ prompts, lastResponseAskQuestions, onOptionClick }) {
  if (!prompts || prompts.length === 0) return null;

  const filtered = prompts.filter(p => {
    if (isPlanApprovalPrompt(p) && p.status === 'active') return false;
    if (isDangerousOperationPrompt(p) && p.status === 'active') return false;
    if (lastResponseAskQuestions && lastResponseAskQuestions.size > 0
      && p.status === 'active' && lastResponseAskQuestions.has(p.question)) return false;
    return true;
  });

  if (filtered.length === 0) return null;

  return (<>
    {filtered.map((p, i) => {
      const isActive = p.status === 'active';
      const isAnswered = p.status === 'answered';
      return (
        <div key={`pty-prompt-${i}`} className={`${styles.ptyPromptBubble}${isActive ? '' : ' ' + styles.ptyPromptResolved}`}>
          <div className={styles.ptyPromptQuestion}>{p.question}</div>
          <div className={styles.ptyPromptOptions}>
            {p.options.map(opt => {
              const chosen = isAnswered && p.selectedNumber === opt.number;
              let cls = styles.ptyPromptOption;
              if (isActive && opt.selected) cls = styles.ptyPromptOptionPrimary;
              if (chosen) cls = styles.ptyPromptOptionChosen;
              if (!isActive && !chosen) cls = styles.ptyPromptOptionDimmed;
              return (
                <button
                  key={opt.number}
                  className={cls}
                  disabled={!isActive}
                  onClick={isActive ? () => onOptionClick(opt.number) : undefined}
                >
                  {opt.number}. {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      );
    })}
  </>);
}

export default PtyPromptBubbles;
